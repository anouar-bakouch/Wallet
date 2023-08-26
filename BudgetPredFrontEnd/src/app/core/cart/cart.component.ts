import { Component } from '@angular/core';
import { ItemPurchaseService } from '../services/itemPurchase.service';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  RxFormBuilder,
  RxFormGroup,
} from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { Purchase } from 'src/models/Purchase';
import { Item } from 'src/models/Item';
import { Router } from '@angular/router';

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
    private router : Router
    ) {}

  ngOnInit(): void {
    this.itemService.getItemsCart().subscribe((data: any) => {
      this.dataArray = data;
      this.dataArray.forEach((x) => {
        this.itemService.getItemInfoById(x.item).subscribe((y: any) => {
          if( !x.is_purchased){
            this.itemsCart.push(y.item);
            this.correctImagePath(y.item);
          }
        });
      });
    });

    if(this.itemsCart.length == 0 ) {
      this.showMessage = true;
      this.message = "is empty";
    }else {
      this.showMessage = false;
    }
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
        MOISSOLD : '2021-04-23',
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
    const cost = this.form_.value.quantity * this.prix_item;  

    if(cost <= this.form_.value.Budget){

    const MONTRAPP = this.form_.value.Budget - cost;

    const item:Purchase = {
      Budget: this.form_.value.Budget,
      quantity: this.form_.value.quantity,
      MOISSOLD: this.form_.value.MOISSOLD,
      MONTRAPP : MONTRAPP,
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
  }else {
    alert("You don't have enough money to buy this item");
  }

  }


}