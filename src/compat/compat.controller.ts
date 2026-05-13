import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DocumentsService } from '../documents/documents.service';
import { JobsDispatchService } from '../jobs-dispatch/jobs-dispatch.service';

@Controller('drivers/:driverId')
export class CompatibilityController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly jobsDispatchService: JobsDispatchService,
  ) {}

  @Post('documents')
  async postLegacyDocument(
    @Param('driverId') driverId: string,
    @Body() body: { documentType: string; fileUrl: string; expiryDate: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', '2027-01-01');
    return this.documentsService.upsertForUser('driver', driverId, body);
  }

  @Get('documents/status')
  async getLegacyDocumentStatus(
    @Param('driverId') driverId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', '2027-01-01');
    return this.documentsService.getDocumentsStatusForUser('driver', driverId);
  }

  @Get('orders')
  async getLegacyOrders(
    @Param('driverId') driverId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', '2027-01-01');

    const documentStatus = await this.documentsService.getDocumentsStatusForUser('driver', driverId);
    const hasExpired = documentStatus.documents.some((doc: any) => doc.expiryStatus === 'expired');
    if (hasExpired) {
      res.status(403);
      return {
        code: 'DOCUMENTS_EXPIRED',
        message: 'Your documents have expired. Please upload valid documents.',
        requestId: req.headers['x-request-id'] ?? 'legacy-no-request-id',
      };
    }

    return {
      orders: await this.jobsDispatchService.list(driverId, {}),
    };
  }
}
