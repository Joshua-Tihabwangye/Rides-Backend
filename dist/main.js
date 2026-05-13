"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_dns_1 = require("node:dns");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/api/http-exception.filter");
const api_response_service_1 = require("./common/api/api-response.service");
function parseOrigins(raw) {
    if (!raw?.trim()) {
        return [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
        ];
    }
    return raw
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}
async function bootstrap() {
    const dnsOrder = (process.env.DB_DNS_RESULT_ORDER || 'ipv4first');
    (0, node_dns_1.setDefaultResultOrder)(dnsOrder);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    const corsOrigins = parseOrigins(process.env.CORS_ORIGINS || process.env.SOCKET_CORS_ORIGINS);
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const apiResponse = app.get(api_response_service_1.ApiResponseService);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(apiResponse));
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(`EVzone backend listening on http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map