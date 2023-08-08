import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  even,
  RxFormBuilder,
  RxFormGroup,
} from '@rxweb/reactive-form-validators';
import { Validators } from '@angular/forms';
import { Budget } from 'src/models/Budget';
import { environment } from 'src/environments/environment';

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
  public base_url = environment.apiUrl;
  public predicted_budget:number | string = '';

  public form = <RxFormGroup> this.fservice.group(
    { 
      LIBACTGE: ['', Validators.required],
      MONTSTRU: ['', Validators.required],
      MONTRAPP: ['', Validators.required],
      MOISSOLD: ['', Validators.required],
      CODYTPAC: ['', Validators.required],
      budgetphoto: ['', Validators.required]
    }
  );

  constructor(
    private budgetService: BudgetService,
    private modalService: NgbModal,
    private fservice: RxFormBuilder){
  }

  ngOnInit() {
    this.getBudgets();
    this.itemsType = this.budgetService.ItemsType;
  }

  getBudgets() {
    this.budgetService.getBudgets().subscribe((data: any) => {
      this.budgets = data.budgets;

      // correct the image path to be displayed
      this.budgets.forEach((budget: any) => {
        budget.budgetphoto = this.base_url + budget.budgetphoto;
      } );

    });
  }

  predictBudget(budget: Budget) {
    this.budgetService.predictBudget(budget).subscribe((data: any) => {
      console.log(data);
    });
  }


  fun(content: any, s: Budget) {

    this.form.setValue({
      LIBACTGE: s.LIBACTGE,
      MONTSTRU: s.MONTSTRU,
      MONTRAPP: s.MONTRAPP,
      MOISSOLD: s.MOISSOLD,
      CODYTPAC: s.CODYTPAC,
      Budgets: s.Budgets
    });
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
  
      this.budgetService.addBudget(formData).subscribe( response => {
        console.log(response);
        this.getBudgets();
      },
        error => {
          console.log(error);
        }
        );
      }
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