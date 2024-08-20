export interface Unit {
    find(arg0: (unit: any) => boolean): unknown;
    unitId: number;
    companyId: number;
    name: string;
    symbol: string;
    active: boolean;
    lastUpdated: Date;
}