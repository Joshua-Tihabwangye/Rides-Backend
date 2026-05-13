export interface AuthenticatedUser {
    userId: string;
    email?: string;
    roles: string[];
    driverId: string;
    riderId?: string;
    fleetId?: string;
    adminId?: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
