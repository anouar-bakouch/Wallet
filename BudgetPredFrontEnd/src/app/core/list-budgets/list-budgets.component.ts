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
import { Router } from '@angular/router';

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
  showLoading = false;
  itemsError: string | null = null;
  itemsFound = false;
  searchText: string = "";
  searchResults: any[]=[];
  messageItemAdded = ""
  showAdded = false;
  currency :string = "";
  public id_to_update:number = 0;

  // Property to track whether the filter section should be shown or not
  showFilter: boolean = false;
  
  // Property to store the filtered budgets
  filteredBudgets: Item[] = []; 
  budgetphoto:string="";

  public form = <RxFormGroup> this.fservice.group(
    { 
      LIBACTGE: ['', Validators.required],
      CODTYPAC: ['', Validators.required],
      budgetphoto: ['', Validators.required],
      categorie : ['', Validators.required],
      MONTSTRU: ['', Validators.required],
    }
  );

  constructor(
    private budgetService: BudgetService,
    private modalService: NgbModal,
    private fservice: RxFormBuilder,
    private router:Router,
    private authService: AuthService){
  }

  ngOnInit() {
    if(this.budgets.length == 0 ) {
      this.itemsError = "No items found";
      this.itemsFound = true;
    } 
    this.getBudgets();
    this.itemsType = this.budgetService.ItemsType;
    this.categories = this.budgetService.ItemsType.map((item: any) => item.value);
    this.itemsFound = false;
    this.currency = localStorage.getItem('currency') || "USD";
    
  }


  getBudgets() {
    this.showLoading = true;
    this.budgetService.getItems(this.current_number).subscribe((data: any) => {
      this.budgets = data.results;
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      } );
    }, error => {
      console.log(error);
    }, () => {
      this.showLoading = false;
    } );
  }

  getItemsByCategorie(categorie:string){
    this.budgetService.getItemsByCategorie(categorie,1).subscribe((data: any) => {
      this.budgets = data.results;
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      } );
    });
  }

  nextPage() {
    this.current_number = this.current_number + 1;
    this.showLoading = true;
    this.budgetService.getItems(this.current_number).subscribe((data: any) => {
      this.budgets = data.results;
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      }
      );
    }, error => {
      console.log(error);
    }, () => {
        this.showLoading = false;
    }
      );
  }



// Method to toggle the filter section visibility
toggleFilter() {
  this.showFilter = !this.showFilter;
  // close it automatically after 3 s
  setTimeout(() => {
    this.showFilter = false;
  } , 3000);

}

// Method to filter the items based on the selected category
filterItems(category: string) {
  this.filteredBudgets = this.budgets.filter(budget => budget.CODTYPAC === category);
}

addToCart(item: Item) {
    const ItemPurchase:ItemPurchase = {
      item_id : item.IDEIMPST,
      user_id : this.authService?.getId(),
      is_purchased : false
    }

    this.budgetService.addToCart(ItemPurchase).subscribe((data: any) => {
      this.router.navigate(['/budgetHome/cart']);
    });
}



  fun(content: any, s: any) {
    this.form.setValue({
      LIBACTGE: s.LIBACTGE,
      CODTYPAC: s.CODTYPAC,
      budgetphoto: s.budgetphoto,
      categorie : s.categorie,
      MONTSTRU: s.MONTSTRU,
    });
    this.id_to_update = s.IDEIMPST;
    this.budgetphoto = s.budgetphoto;
  
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
    this.showAdded = false;
    if (this.form.valid) {
      // budgetphoto
      const formData = this.form.toFormData();
      const selectedFile = (document.getElementById('inputGroupFile01') as HTMLInputElement).files;
      if (selectedFile != null) {
        formData.append('budgetphoto', selectedFile[0], selectedFile[0].name);
      }
  
      this.budgetService.addItem(formData).subscribe( response => {
        this.getBudgets();
        setTimeout(() => {
          this.showAdded = true;
          this.messageItemAdded = "Added successfully !";
        }, 3000);
      },
        error => {
          console.log(error);
          setTimeout(() => {
            this.showAdded = true;
            this.messageItemAdded = "something went wrong";
          }, 3000);
          
        },()=>{
        
            this.showAdded = false;
         
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
    }
    
    );

  }

  performSearch() {
    if (this.searchText !== '') {
      this.budgets = this.budgets.filter(item => {
        return item.LIBACTGE.toLowerCase().includes(this.searchText.toLowerCase());
      });
    } else {
      this.getBudgets(); // Reset the items array to the original state
    }
  }

  onClickUpdate(){

    const form_data = this.form.toFormData();
    // budgetphoto
    const selectedFile = (document.getElementById('inputGroupFile02') as HTMLInputElement).files;
    if (selectedFile != null) {
      form_data.append('budgetphoto', selectedFile[0], selectedFile[0].name);
    }
    
    this.budgetService.updateItem(form_data,this.id_to_update).subscribe( response => {
      this.getBudgets();
      console.log(response)
      // setTimeout(() => {
      //   this.showAdded = true;
      //   this.messageItemAdded = "Updated successfully !";
      //   window.location.reload();
      // } , 2000);

    }, 
    error => {
      // console.log(error);
    }
    );

  }

  onFileSelected_(event: any) {
    this.selectedFie = event.target.files[0];
  }

}