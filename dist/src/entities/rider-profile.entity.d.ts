import { User } from './user.entity';
export declare class RiderProfile {
    id: string;
    userId: string;
    riderId: string;
    user: User;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    preferredCurrency: string;
    preferences: Record<string, any>;
    rating: number;
    totalTrips: number;
}
