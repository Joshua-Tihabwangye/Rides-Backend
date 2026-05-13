import type { NextFunction, Request, Response } from "express";
import type { DriverDocumentRepository } from "../repositories/documentRepository";
export declare function requireValidDocuments(repository: DriverDocumentRepository): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
