

export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    path_photo : string | undefined ;
    month_budget : number;
}