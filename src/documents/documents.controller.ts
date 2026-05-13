import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { assertUserScopeAccess, normalizeUserTypePath } from '../common/utils/user-scope';
import { PatchDocumentDto, UpsertDocumentDto } from './dto/document.dto';
import { DocumentsService } from './documents.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Post(':userType/me/documents')
  async postDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Body() body: UpsertDocumentDto,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'DOCUMENT_UPSERTED',
      message: 'Document uploaded',
      requestId: getRequestId(req),
      data: await this.documentsService.upsertForUser(userType as any, user.userId, body),
    });
  }

  @Get(':userType/me/documents')
  async listDocuments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'DOCUMENTS_FETCHED',
      message: 'Documents fetched',
      requestId: getRequestId(req),
      data: await this.documentsService.listForUser(userType as any, user.userId),
    });
  }

  @Get(':userType/me/documents/status')
  async getStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'DOCUMENT_STATUS_FETCHED',
      message: 'Document status fetched',
      requestId: getRequestId(req),
      data: await this.documentsService.getDocumentsStatusForUser(userType as any, user.userId),
    });
  }

  @Patch(':userType/me/documents/:documentId')
  async patchDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Param('documentId') documentId: string,
    @Body() body: PatchDocumentDto,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'DOCUMENT_UPDATED',
      message: 'Document updated',
      requestId: getRequestId(req),
      data: await this.documentsService.patchForUser(userType as any, user.userId, documentId, body),
    });
  }

  @Post(':userType/me/documents/:documentId/resubmit')
  async resubmit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userType') userTypeParam: string,
    @Param('documentId') documentId: string,
    @Body() body: PatchDocumentDto,
    @Req() req: Request,
  ) {
    const userType = normalizeUserTypePath(userTypeParam);
    assertUserScopeAccess(user.roles, userType);
    return this.apiResponse.success({
      code: 'DOCUMENT_RESUBMITTED',
      message: 'Document resubmitted',
      requestId: getRequestId(req),
      data: await this.documentsService.resubmitForUser(userType as any, user.userId, documentId, body),
    });
  }
}
