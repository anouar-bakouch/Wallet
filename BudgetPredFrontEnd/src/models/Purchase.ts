import { User } from "./User";


export interface Purchase {
    user :User;
    MOISSOLD : Date;
    MONTSTRU : number;
    MONTRAPP : number;
    Budget : number;
}