export interface Budget {
    budgetId: number;
    clientId: number;
    companyId: number;
    date: Date;
    origin: string;
    totalWithoutIva: number;
    totalIva: number;
    totalWithIva: number;
    state: string;
    obs: string;
    active: boolean;
    lastUpdate: Date;
} 