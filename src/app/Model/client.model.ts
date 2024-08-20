export interface Client {
    find(arg0: (client: any) => boolean): unknown;
    clientId: number;
    companyId: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    nif: string;
    obs: string;
    active: boolean;
    lastUpdate: Date;
}