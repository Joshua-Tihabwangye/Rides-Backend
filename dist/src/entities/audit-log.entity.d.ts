export declare class AuditLog {
    id: string;
    actorId: string;
    actorType: string;
    action: string;
    resource: string;
    resourceId: string;
    before: Record<string, any>;
    after: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
