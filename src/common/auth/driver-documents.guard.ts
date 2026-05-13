import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { DocumentsService } from '../../documents/documents.service';
import type { Request } from 'express';
import type { AuthenticatedUser } from './current-user.decorator';

@Injectable()
export class DriverDocumentsGuard implements CanActivate {
  constructor(private readonly documentsService: DocumentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const userId = request.user?.userId;
    if (!userId) {
      throw new ForbiddenException('Driver context not found');
    }

    const status = await this.documentsService.getDocumentsStatusForUser('driver', userId);
    const blocked = status.documents.some((item) => item.expiryStatus === 'expired');
    if (blocked) {
      throw new ForbiddenException('Your documents have expired. Please upload valid documents.');
    }
    return true;
  }
}
