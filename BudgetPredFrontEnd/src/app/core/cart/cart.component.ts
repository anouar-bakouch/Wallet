import { Component } from '@angular/core';
import { ItemPurchaseService } from '../services/itemPurchase.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  public itemsCart: any[] = [];
  public dataArray: any[] = [];

  constructor(private itemService: ItemPurchaseService) {}

  ngOnInit(): void {
    this.itemService.getItemsCart().subscribe((data: any) => {
      this.dataArray = data;


      this.dataArray.forEach((x) => {
        this.itemService.getItemInfoById(x.item).subscribe((y: any) => {

          y.item.quantity = x.quantity;
          y.item.MONTSTRU = x.MONTSTRU;
          console.log(y)
          this.itemsCart.push(y.item);
          this.correctImagePath(y.item);
        });
      });
    });
  }

  correctImagePath(item: any): void {
    item.budgetphoto = environment.apiUrl + '/' + item.budgetphoto;
  }
}