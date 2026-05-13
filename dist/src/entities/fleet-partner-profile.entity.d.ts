import { User } from './user.entity';
import { FleetBranch } from './fleet-branch.entity';
export declare class FleetPartnerProfile {
    id: string;
    userId: string;
    user: User;
    fleetId: string;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    registrationNumber: string;
    taxId: string;
    status: string;
    verticals: Record<string, boolean>;
    branches: FleetBranch[];
}
