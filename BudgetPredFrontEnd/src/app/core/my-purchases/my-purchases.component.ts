import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';
import { PurchaseService } from '../services/Purchase.service';
import { ItemPurchaseService } from '../services/itemPurchase.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css']
})
export class MyPurchasesComponent {
  my_purchases: any[] = [];
  user_id: number = 0;
  show_loading = false;
  currency:string = localStorage.getItem('currency')|| "MAD";
  purchaseMessage:string = "You have no purchases yet"
  purchaseMessageAppear:boolean = false;

  constructor(
    private puchaseservice: PurchaseService,
    private itemService: ItemPurchaseService
  ) {}

  ngOnInit() {
    this.user_id = Number(localStorage.getItem('user_id'));
    this.show_loading = true;
    this.purchaseMessageAppear = false;
    this.puchaseservice.getPurchaseByUser(this.user_id).subscribe(
      (data: any) => {
        this.my_purchases = data;
        if(this.my_purchases.length == 0){
          this.purchaseMessageAppear = true;
        }
      },
      error => {
        console.log(error);
      },
      () => {
        const updatedPurchases: any[] = [];
        const totalPurchases = this.my_purchases.length;
        let processedCount = 0;

        this.my_purchases.forEach(element => {
          this.itemService.getItemInfoById(element.item).subscribe(
            (y: any) => {
              y.item.budgetphoto = environment.apiUrl + '/' + y.item.budgetphoto;
              updatedPurchases.push(y.item);
            },
            error => {
              console.log(error);
            },
            () => {
              processedCount++;
              if (processedCount === totalPurchases) {
                this.my_purchases = updatedPurchases;
              }
            }
          );
        });
        this.show_loading = false;
      }
    );
    
  }

  deletePurchase(id: number) {
    this.puchaseservice.deletePurchase(id).subscribe(
      (data: any) => {
        console.log(data);
      },
      error => {
        console.log(error);
      },
      () => {
        this.ngOnInit();
      }
    );
  }


}