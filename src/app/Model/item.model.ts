export interface Item {
    itemId: number;
    companyId: number;
    code: string;
    name: string;
    costPrice: number;
    unitId: number;
    margin: number;
    sellingPrice: number;
    iva: number;
    active: boolean;
    lastUpdated: Date;
}