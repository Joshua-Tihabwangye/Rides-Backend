import { FleetPartnerProfile } from './fleet-partner-profile.entity';
export declare class FleetBranch {
    id: string;
    fleetPartnerId: string;
    fleetId: string;
    fleetPartner: FleetPartnerProfile;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    managerName: string;
    operatingHours: Record<string, any>;
}
