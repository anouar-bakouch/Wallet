import { Item } from "./Item";
import { User } from "./User";


export interface ItemPurchase {
    user :User;
    item : Item;
    quantity : number;
}