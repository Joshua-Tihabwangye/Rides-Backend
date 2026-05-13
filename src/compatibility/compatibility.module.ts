import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompatibilityContractController } from './compatibility.controller';
import { CompatibilityContractService } from './compatibility.service';
import { FeatureFlag } from '../entities/feature-flag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureFlag]),
  ],
  controllers: [CompatibilityContractController],
  providers: [CompatibilityContractService],
  exports: [CompatibilityContractService],
})
export class CompatibilityContractModule {}
