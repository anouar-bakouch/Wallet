

export interface MonthlyBudget {
    id: number;
    user_id: number;
    month: string;
    savings : number;
    spendings : number;
    budget : number;
    needs_new_form : boolean;
}