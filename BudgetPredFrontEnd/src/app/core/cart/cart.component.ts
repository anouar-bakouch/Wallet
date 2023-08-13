import { Component } from '@angular/core';
import { ItemPurchase } from 'src/models/ItemPurchase';
import { ItemPurchaseService } from '../services/itemPurchase.service';
import { Item } from 'src/models/Item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  public itemsCart: Item[] = [];
  public dataArray: Array<ItemPurchase> = [];

  constructor(private itemService: ItemPurchaseService) {}

  ngOnInit(): void {
    this.itemService.getItemsCart().subscribe((data: ItemPurchase[]) => {
      this.dataArray = data;

      this.dataArray.forEach((x) => {
        console.log(x);
        this.itemService.getItemInfoById(x.item).subscribe((y) => {
          // console.log(y);
        });
      });
    });
  }
}