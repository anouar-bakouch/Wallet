import { Item } from "./Item";
import { Purchase } from "./Purchase";
import { User } from "./User";


export interface ItemPurchase {
    user_id : number;
    item_id : number;
    quantity : number;
}