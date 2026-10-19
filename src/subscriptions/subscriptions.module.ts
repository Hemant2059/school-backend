import { Module } from '@nestjs/common';
import { FeatureController } from './controllers/feature.controller.js';
import { PlanController } from './controllers/plan.controller.js';
import { PlanFeatureController } from './controllers/plan-feature.controller.js';
import { FeatureService } from './services/feature.service.js';
import { PlanService } from './services/plan.service.js';
import { PlanFeatureService } from './services/plan-feature.service.js';

@Module({
  controllers: [FeatureController, PlanController, PlanFeatureController],
  providers: [FeatureService, PlanService, PlanFeatureService],
  exports: [FeatureService, PlanService, PlanFeatureService],
})
export class SubscriptionsModule {}