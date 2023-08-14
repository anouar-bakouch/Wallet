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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  public itemsCart: any[] = [];
  public dataArray: any[] = [];
  closeResult: string = '';

  public form_ = <RxFormGroup> this.fservice.group(
    { 
      Budget: ['', Validators.required],
      MOISSOLD: ['', Validators.required],
      quantity: ['', Validators.required],
      item_id : ['', Validators.required],
      MONTSTRU : ['', Validators.required]
    }
  );

  item_:Item | undefined = undefined;

  constructor(
    private itemService: ItemPurchaseService,
        private modalService: NgbModal,
    private fservice: RxFormBuilder
    ) {}

  ngOnInit(): void {
    this.itemService.getItemsCart().subscribe((data: any) => {
      this.dataArray = data;
      this.dataArray.forEach((x) => {
        this.itemService.getItemInfoById(x.item).subscribe((y: any) => {
          console.log(x)
          if( !x.is_purchased){
            this.itemsCart.push(y.item);
            this.correctImagePath(y.item);
          }
        });
      });
    });
  }

  correctImagePath(item: any): void {
    item.budgetphoto = environment.apiUrl + '/' + item.budgetphoto;
  }

  // modal LOGIC


  // fun(content: any, s: any) {

  //   this.form_.setValue({
  //     MONTSTRU: s.MONTSTRU,
  //   });
  //   this.open(content,{});
  // }

  open(content: any,x:Item) {

    this.item_ = x;
    if (content._declarationTContainer.localNames[0] == 'mymodal') {
      this.form_.reset();
      this.form_.setValue({
        item_id : x.IDEIMPST,
        Budget : x.MONTSTRU ,
        MOISSOLD : '2021-04-23',
        quantity : 1,
         MONTSTRU : x.MONTSTRU

      })
    
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

    const MONTRAPP = this.form_.value.Budget - this.form_.value.MONTSTRU;

    const item:Purchase = {
      Budget: this.form_.value.Budget,
      quantity: this.form_.value.quantity,
      MOISSOLD: this.form_.value.MOISSOLD,
      MONTSTRU : this.form_.value.MONTSTRU,
      MONTRAPP : MONTRAPP,
      user_id : Number(localStorage.getItem('user_id')) ,
      item_id : this.item_?.IDEIMPST,
    }

    // making a purchase request
    this.itemService.addToPurchase(item).subscribe((data: any) => {
      // delete the data from itemsCart 
      this.itemsCart = this.itemsCart.filter((x) => x.IDEIMPST != this.item_?.IDEIMPST);
      console.log(data);
    } , (error: any) => {
      console.log(error);
    } , () => {
      console.log('done');
      // close the modal 
      this.modalService.dismissAll();
    });

  }

   updateMontant() {
    const quantity :number = this.form_.value.quantity;
    const montant : number = this.form_.value.MONTSTRU * quantity;
    this.form_.get('MONTSTRU')?.setValue(montant);
    // update Budget also 
    const Budget : number = this.form_.value.Budget;
    const newBudget : number = Budget + this.form_.value.MONTSTRU; 
    this.form_.get('Budget')?.setValue(newBudget);
  }

}