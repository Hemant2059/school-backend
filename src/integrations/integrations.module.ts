import { Module } from '@nestjs/common';
import { ApiKeysController } from './controllers/api-keys.controller.js';
import { ApiKeyService } from './services/api-key.service.js';

@Module({
  controllers: [ApiKeysController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class IntegrationsModule {}
