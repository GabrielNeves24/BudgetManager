export interface BudgetDetail {
    budgetDetailId: number;
    budgetId: number;
    itemId: number;
    companyId: number;
    ItemDescription: string;
    unitId: string;
    quantity: number;
    price: number;
    iva: number; //nova
    discount: number;
    total: number;
}
