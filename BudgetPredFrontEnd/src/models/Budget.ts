import { User } from "./User";


export interface Budget {
    IDEIMPST : number;
    MONTSTRU : number;
    MONTRAPP : number;
    MOISSOLD : Date;
    CODYTPAC : string;
    LIBACTGE : string;
    Budgets : number;
    UserId : User;
}

