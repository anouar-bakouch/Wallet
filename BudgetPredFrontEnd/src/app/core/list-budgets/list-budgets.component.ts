import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  RxFormBuilder,
  RxFormGroup,
} from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { Item } from 'src/models/Item';
import { environment } from 'src/environments/environment';
import { ItemPurchase } from 'src/models/ItemPurchase';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-list-budgets',
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.css']
})
export class ListBudgetsComponent {

  public budgets: any[] = [];
  closeResult: string = '';
  itemsType: any[] = [];
  public selectedFie : any | null = null;
  public base_url = environment.apiUrl+"/";
  public current_number : number = 1;
  categories: string[] = [];

  // Property to track whether the filter section should be shown or not
  showFilter: boolean = false;
  
  // Property to store the filtered budgets
  filteredBudgets: Item[] = []; 

  public form = <RxFormGroup> this.fservice.group(
    { 
      LIBACTGE: ['', Validators.required],
      CODYTPAC: ['', Validators.required],
      budgetphoto: ['', Validators.required],
      categorie : ['', Validators.required],
    }
  );

  constructor(
    private budgetService: BudgetService,
    private modalService: NgbModal,
    private fservice: RxFormBuilder,
    private authService: AuthService){
  }

  ngOnInit() {
    this.getBudgets();
    this.itemsType = this.budgetService.ItemsType;
    this.categories = this.budgetService.ItemsType.map((item: any) => item.value);
  }

  getBudgets() {
    this.budgetService.getItems(this.current_number).subscribe((data: any) => {
      this.budgets = data.results;
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      } );
    });
  }

  getItemsByCategorie(categorie:string){
    console.group(categorie);
    this.budgetService.getItemsByCategorie(categorie,1).subscribe((data: any) => {
      this.budgets = data.results;
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      } );
    });
  }

  nextPage() {
    this.current_number = this.current_number + 1;
    this.budgetService.getItems(this.current_number).subscribe((data: any) => {
      this.budgets = data.results;
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      }
      );
    });
  }



// Method to toggle the filter section visibility
toggleFilter() {
  this.showFilter = !this.showFilter;
}

// Method to filter the items based on the selected category
filterItems(category: string) {
  this.filteredBudgets = this.budgets.filter(budget => budget.CODTYPAC === category);
}

  addToCart(item: any) {
    console.log(item)
    const ItemPurchase:ItemPurchase = {
      item : item,
      quantity : 1,
      user : this.authService.getCurrentUser()
    }

    // this.budgetService.addToCart(item).subscribe((data: any) => {
    //   console.log(data);
    // });
  }



  fun(content: any, s: Item) {

    // this.form.setValue({
    //   LIBACTGE: s.LIBACTGE,
    //   MONTSTRU: s.MONTSTRU,
    //   MONTRAPP: s.MONTRAPP,
    //   MOISSOLD: s.MOISSOLD,
    //   CODYTPAC: s.CODYTPAC,
    //   Budgets: s.Budgets
    // });
    this.open(content);
  }

  open(content: any) {
    if (content._declarationTContainer.localNames[0] == 'mymodal') {
      this.form.reset();
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
    if (this.form.valid) {
      // budgetphoto
      const formData = this.form.toFormData();
      const selectedFile = (document.getElementById('inputGroupFile01') as HTMLInputElement).files;
      if (selectedFile != null) {
        formData.append('budgetphoto', selectedFile[0], selectedFile[0].name);
      }
  
      this.budgetService.addItem(formData).subscribe( response => {
        this.getBudgets();
      },
        error => {
          console.log(error);
        }
        );
      }
      // close the model 
      this.modalService.dismissAll();
    }

    onFileSelected(event: any) {
      this.selectedFie = event.target.files[0];
    }

  onDelete(id: number) {
    this.budgetService.deleteBudget(id).subscribe(() => {
      this.getBudgets();
    });
  }
}