import { Module } from '@nestjs/common';
import { GradingScaleController } from './controllers/grading-scale.controller.js';
import { GradingScaleService } from './services/grading-scale.service.js';

@Module({
  controllers: [GradingScaleController],
  providers: [GradingScaleService],
  exports: [GradingScaleService],
})
export class ExaminationsModule {}