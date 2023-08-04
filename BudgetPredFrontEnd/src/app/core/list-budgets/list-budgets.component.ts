import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Budget } from 'src/models/Budget';

@Component({
  selector: 'app-list-budgets',
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.css']
})

export class ListBudgetsComponent {

  public budgets: any[] = [];
  public form = new FormGroup({
    LIBACTGE: new FormControl('', [Validators.required, Validators.minLength(7)]),
    MONTSTRU: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    MONTRAPP: new FormControl('', [Validators.required]),
    MOISSOLD: new FormControl('', [Validators.required]),
    CODYTPAC: new FormControl('', [Validators.required]), 
    Budgets : new FormControl('', [Validators.required])
  });

    closeResult: string = '';


  constructor(private budgetService:BudgetService,private modalService:NgbModal) { }

  ngOnInit() {

    this.getBudgets();
    
  }

  getBudgets(){
    this.budgetService.getBudgets().subscribe((data:any) => {
      this.budgets = data.budgets;
    });
  } 

   fun = (content: any, s: Budget) => {



    this.open(content);
  };

    open(content: any) {
    if (content._declarationTContainer.localNames[0] == 'mymodal') {
      this.form.reset()
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result:any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason:any) => {
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

      const budget= {
        MONTSTRU : this.form.value.MONTSTRU,
        MONTRAPP : this.form.value.MONTRAPP,
        MOISSOLD : this.form.value.MOISSOLD,
        CODYTPAC : this.form.value.CODYTPAC,
        LIBACTGE : this.form.value.LIBACTGE,
        Budgets : this.form.value.Budgets
      };

      this.budgetService.addBudget(budget).subscribe( ()=> {
        this.getBudgets();
      });
    }
  }

  onDelete(id: number) {
    this.budgetService.deleteBudget(id).subscribe(() => {
      this.getBudgets();
    });
  }

}
