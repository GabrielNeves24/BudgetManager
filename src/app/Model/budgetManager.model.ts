export interface budgetManager {
    budgetManagerId: number;
    companyId: number;
    userId: number;
    creationDate: Date;
    expirtationDate: Date;
    lastLogin: Date;
    active: boolean;
    lastUpdate: Date;
}