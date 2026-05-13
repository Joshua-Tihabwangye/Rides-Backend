import type { DriverDocumentRepository } from "../repositories/documentRepository";
interface DocumentRoutesDeps {
    repository: DriverDocumentRepository;
    extractExpiryDateFromOcr?: (fileUrl: string) => Promise<string | null>;
}
export declare function createDocumentRoutes({ repository, extractExpiryDateFromOcr }: DocumentRoutesDeps): import("express-serve-static-core").Router;
export {};
