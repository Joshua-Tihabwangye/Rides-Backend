export declare class TemporaryStopRequestDto {
    note?: string;
}
export declare class TemporaryStopRespondDto {
    decision: 'confirm' | 'decline';
}
export declare class SafetyCheckRespondDto {
    actor: 'driver' | 'passenger';
    action: 'okay' | 'sos';
}
export declare class SosDto {
    contactsNotified?: string[];
    latitude?: number;
    longitude?: number;
    helpMessage?: string;
}
export declare class EmergencyContactDto {
    name: string;
    phone: string;
    relationship?: string;
}
