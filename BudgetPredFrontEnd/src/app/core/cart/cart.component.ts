import { Component } from '@angular/core';
import { ItemPurchaseService } from '../services/itemPurchase.service';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import {
  RxFormBuilder,
  RxFormGroup,
} from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { Purchase } from 'src/models/Purchase';
import { Item } from 'src/models/Item';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  public itemsCart: any[] = [];
  public dataArray: any[] = [];
  closeResult: string = '';
  showMessage = false;
  message = '';
  prix_item:number = 0;
  today: string="";
  currency = localStorage.getItem('currency') || "MAD";

  public form_ = <RxFormGroup> this.fservice.group(
    { 
      Budget: ['', Validators.required],
      MOISSOLD: ['', Validators.required],
      quantity: ['', Validators.required],
      item_id : ['', Validators.required],
    }
  );

  item_:Item | undefined = undefined;

  constructor(
    private itemService: ItemPurchaseService,
    private modalService: NgbModal,
    private fservice: RxFormBuilder,
    private router : Router,
    private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
      this.itemService.getItemsCart().subscribe((data: any) => {
        this.dataArray = data;
        const itemInfoRequests = this.dataArray.map((x) => this.itemService.getItemInfoById(x.item));
        forkJoin(itemInfoRequests).subscribe((responses: any) => {
          responses.forEach((y: any, index: number) => {
            const x = this.dataArray[index];
            if (!x.is_purchased) {
              const item = y.item;
              this.itemsCart.push(item);
              this.correctImagePath(item);
            }
          });
    
          if (this.itemsCart.length == 0) {
            this.showMessage = true;
          } else {
            this.showMessage = false;
          }
        });
      });
      this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || "";

    }
    
  correctImagePath(item: any): void {
    item.budgetphoto = environment.apiUrl + '/' + item.budgetphoto;
  }


  open(content: any,x:Item) {

    this.item_ = x;
    if (content._declarationTContainer.localNames[0] == 'mymodal') {
      this.form_.reset();
      this.form_.setValue({
        item_id : x.IDEIMPST,
        Budget : x.MONTSTRU ,
        MOISSOLD : this.today,
        quantity : 1,
      })

      this.prix_item = x.MONTSTRU;
    
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: any) => {

          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onClickSubmit() {
  
    const item:Purchase = {
      Budget: this.form_.value.Budget,
      quantity: this.form_.value.quantity,
      MOISSOLD: this.form_.value.MOISSOLD,
      MONTRAPP : 0,
      user_id : Number(localStorage.getItem('user_id')) ,
      item_id : this.item_?.IDEIMPST,
    }
    // making a purchase request
    this.itemService.addToPurchase(item).subscribe((data: any) => {
      // delete the data from itemsCart 
      this.itemsCart = this.itemsCart.filter((x) => x.IDEIMPST != this.item_?.IDEIMPST);
      this.router.navigate(['/budgetHome/myPurchases']);
    } , (error: any) => {
      console.log(error);
    } , () => {

      this.modalService.dismissAll();
    });

  }

  OnDelete(item:number){
    this.itemService.deleteItemCart(item).subscribe((data:any) => {
      this.itemsCart = this.itemsCart.filter((x) => x.IDEIMPST != item);
      this.showMessage = true;
      this.message = "is empty";
    });
  }

  // function to increment the price by the quantity 
  incrementPrice():number{
    const quantity = this.form_.value.quantity;
    const basePrice = this.form_.value.Budget; 

    return quantity * basePrice;
  }

  canPurchase():boolean{
    const quantity = this.form_.value.quantity;
    const basePrice = this.form_.value.Budget; 
    const budget = this.form_.value.MOISSOLD; 

    return quantity * basePrice <= budget;
  }


}