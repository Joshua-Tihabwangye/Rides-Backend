import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { getRequestId } from '../common/utils/request-id';
import { CompatSignInDto } from './dto/compat-auth.dto';
import type { AppId } from './contracts.types';
import { CompatibilityContractService } from './compatibility.service';

@Controller('compat')
export class CompatibilityContractController {
  constructor(
    private readonly compatibilityService: CompatibilityContractService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('contracts')
  getContracts(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'COMPAT_CONTRACTS_FETCHED',
      message: 'Compatibility contracts fetched',
      requestId: getRequestId(req),
      data: this.compatibilityService.getContracts(),
    });
  }

  @Get('canonical-routes')
  getCanonicalContracts(@Req() req: Request) {
    return this.apiResponse.success({
      code: 'CANONICAL_CONTRACTS_FETCHED',
      message: 'Canonical route contracts fetched',
      requestId: getRequestId(req),
      data: this.compatibilityService.getCanonicalContracts(),
    });
  }

  @Get('contracts/:appId')
  getContract(@Param('appId') appId: AppId, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'COMPAT_CONTRACT_FETCHED',
      message: 'Compatibility contract fetched',
      requestId: getRequestId(req),
      data: this.compatibilityService.getContract(appId),
    });
  }

  @Get('canonical-routes/:appId')
  getCanonicalContract(@Param('appId') appId: AppId, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'CANONICAL_CONTRACT_FETCHED',
      message: 'Canonical route contract fetched',
      requestId: getRequestId(req),
      data: this.compatibilityService.getCanonicalContract(appId),
    });
  }

  @Get('bootstrap/:appId')
  getBootstrap(@Param('appId') appId: AppId, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'COMPAT_BOOTSTRAP_FETCHED',
      message: 'Compatibility bootstrap fetched',
      requestId: getRequestId(req),
      data: this.compatibilityService.getBootstrap(appId),
    });
  }

  @Get('flags/:appId')
  async getRuntimeFlags(@Param('appId') appId: AppId, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'COMPAT_FLAGS_FETCHED',
      message: 'Compatibility runtime flags fetched',
      requestId: getRequestId(req),
      data: await this.compatibilityService.getRuntimeFlags(appId),
    });
  }

  @Post(':appId/auth/sign-in')
  compatSignIn(
    @Param('appId') appId: AppId,
    @Body() body: CompatSignInDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'COMPAT_SIGN_IN_OK',
      message: 'Compatibility sign-in payload generated',
      requestId: getRequestId(req),
      data: this.compatibilityService.signInCompat(appId, body),
    });
  }
}
