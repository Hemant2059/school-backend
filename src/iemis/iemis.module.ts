import { Module } from '@nestjs/common';
import { IemisExportController } from './controllers/iemis-export.controller.js';
import { IemisExportService } from './services/iemis-export.service.js';

@Module({
  controllers: [IemisExportController],
  providers: [IemisExportService],
  exports: [IemisExportService],
})
export class IemisModule {}
