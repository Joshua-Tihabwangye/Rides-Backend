import type { Request } from 'express';
import { randomUUID } from 'crypto';

export function getRequestId(req: Request): string {
  const headerId = req.headers['x-request-id'];
  if (typeof headerId === 'string' && headerId.trim()) {
    return headerId;
  }
  return randomUUID();
}
