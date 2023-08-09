import { Item } from "./Item";
import { User } from "./User";


export interface Purchase {
    user :User;
    item : Item;
    date : Date;
}