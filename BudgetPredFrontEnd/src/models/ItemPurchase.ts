import { Item } from "./Item";
import { Purchase } from "./Purchase";
import { User } from "./User";


export interface ItemPurchase {
    user :User;
    item : Item;
    quantity : number;
    purchase : Purchase;
}