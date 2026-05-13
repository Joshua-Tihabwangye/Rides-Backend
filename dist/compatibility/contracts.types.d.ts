export type AppId = 'rider' | 'driver' | 'fleet' | 'admin';
export interface StorageKeyContract {
    key: string;
    shape: string;
    purpose: string;
    critical: boolean;
}
export interface AppBehaviorContract {
    appId: AppId;
    appName: string;
    localStorageKeys: StorageKeyContract[];
    uiSideEffects: string[];
    mustNotChangeAcceptance: string[];
    compatibilityEndpoints: string[];
}
export interface CompatibilityBootstrapPayload {
    appId: AppId;
    storageSnapshot: Record<string, unknown>;
}
export interface AppCanonicalContract {
    appId: AppId;
    rest: Record<string, string>;
    realtime: {
        namespace: string;
        path: string;
    };
    notes?: string[];
}
