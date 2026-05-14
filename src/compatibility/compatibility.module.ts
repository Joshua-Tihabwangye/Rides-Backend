import { Module } from '@nestjs/common';
import { CompatibilityContractController } from './compatibility.controller';
import { CompatibilityContractService } from './compatibility.service';

@Module({
  controllers: [CompatibilityContractController],
  providers: [CompatibilityContractService],
  exports: [CompatibilityContractService],
})
export class CompatibilityContractModule {}
