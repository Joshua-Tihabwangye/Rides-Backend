"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/api/http-exception.filter");
const api_response_service_1 = require("./common/api/api-response.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
        ],
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