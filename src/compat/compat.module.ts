import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { JobsDispatchModule } from '../jobs-dispatch/jobs-dispatch.module';
import { CompatibilityController } from './compat.controller';

@Module({
  imports: [DocumentsModule, JobsDispatchModule],
  controllers: [CompatibilityController],
})
export class CompatibilityModule {}
