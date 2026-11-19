import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { SmsService } from '../../sms/sms.service.js';

export interface GuardianNotifyPayload {
  /** Short title for the in-app notification. */
  title: string;
  /** Full message for the in-app notification (shown in the app). */
  message: string;
  /** Text to send by SMS; omitted → no SMS is sent. */
  smsText?: string;
  /** Notification type tag, e.g. 'admission' | 'fee' | 'exam'. */
  type?: string;
}

export interface GuardianNotifyResult {
  guardians: number;
  inApp: number;
  smsSent: number;
  smsFailed: number;
}

/**
 * One-shot guardian notification for a student event: enrollment submitted,
 * fee invoice generated, results published.
 *
 * In-app notifications are sent to guardians that have a linked user
 * account; SMS is sent to every guardian with a phone number. Any failure
 * is logged and counted — never thrown — because a notification must not
 * abort the transaction that triggered it.
 */
@Injectable()
export class GuardianNotificationService {
  private readonly logger = new Logger(GuardianNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: SmsService,
  ) {}

  async notifyForStudent(
    tenantId: string,
    studentId: string,
    payload: GuardianNotifyPayload,
  ): Promise<GuardianNotifyResult> {
    const links = await this.prisma.studentGuardian.findMany({
      where: { student: { id: studentId, tenantId, deletedAt: null }, guardian: { deletedAt: null } },
      include: {
        guardian: {
          select: {
            id: true,
            phone: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    const result: GuardianNotifyResult = { guardians: links.length, inApp: 0, smsSent: 0, smsFailed: 0 };

    for (const link of links) {
      if (link.guardian.user) {
        try {
          await this.prisma.notification.create({
            data: {
              tenantId,
              recipientType: 'USER',
              recipientId: link.guardian.user.id,
              title: payload.title,
              message: payload.message,
              type: payload.type,
            },
          });
          result.inApp++;
        } catch (error) {
          this.logger.warn(`in-app notification failed for guardian ${link.guardian.id}: ${String(error)}`);
        }
      }

      if (payload.smsText && link.guardian.phone) {
        try {
          const sent = await this.sms.send(link.guardian.phone, payload.smsText);
          if (sent.ok) result.smsSent++;
          else {
            result.smsFailed++;
            this.logger.warn(`SMS to guardian ${link.guardian.id} not accepted: ${sent.error}`);
          }
        } catch (error) {
          result.smsFailed++;
          this.logger.warn(`SMS to guardian ${link.guardian.id} failed: ${String(error)}`);
        }
      }
    }

    return result;
  }
}
