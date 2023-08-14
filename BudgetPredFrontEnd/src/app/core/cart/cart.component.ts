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
    }
  );

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
          this.itemsCart.push(y.item);
          this.correctImagePath(y.item);
        });
      });
    });
  }

  correctImagePath(item: any): void {
    item.budgetphoto = environment.apiUrl + '/' + item.budgetphoto;
  }

  // modal LOGIC


  fun(content: any, s: any) {

    this.form_.setValue({
      MONTSTRU: s.MONTSTRU,
    });
    this.open(content);
  }

  open(content: any) {
    if (content._declarationTContainer.localNames[0] == 'mymodal') {
      this.form_.reset();
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
      
    }

    // making a purchase request
    this.itemService.addToPurchase()

  }

}