import { Component } from '@angular/core';
import { ItemPurchase } from 'src/models/ItemPurchase';
import { ItemPurchaseService } from '../services/itemPurchase.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {

  itemsCart : any [] = [];

  constructor(private itemService:ItemPurchaseService) { }

  ngOnInit(): void {
    this.itemService.getItemsCart().forEach((data:any) => {
    
      this.itemsCart = data;
      
      this.infoItem(this.itemsCart[0].it);    

    });
    
  }

  infoItem(id:number){
      this.itemService.getItemInfoById(id).forEach((data:any) => {
        console.log(data);
      });
  }


}
