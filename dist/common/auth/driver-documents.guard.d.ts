import { CanActivate, ExecutionContext } from '@nestjs/common';
import { DocumentsService } from '../../documents/documents.service';
export declare class DriverDocumentsGuard implements CanActivate {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
