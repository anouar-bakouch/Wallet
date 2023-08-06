import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Budget } from 'src/models/Budget';

@Component({
  selector: 'app-list-budgets',
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.css']
})
export class ListBudgetsComponent {

  public budgets: any[] = [];
  public form: FormGroup;
  closeResult: string = '';
  itemsType: any[] = [];

  constructor(
    private budgetService: BudgetService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      LIBACTGE: ['', [Validators.required, Validators.minLength(7)]],
      MONTSTRU: ['', [Validators.required, Validators.minLength(2)]],
      MONTRAPP: ['', Validators.required],
      MOISSOLD: ['', Validators.required],
      CODYTPAC: ['', Validators.required],
      Budgets: ['', Validators.required],
      budgetphoto: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getBudgets();
    this.itemsType = this.budgetService.ItemsType;
  }

  getBudgets() {
    this.budgetService.getBudgets().subscribe((data: any) => {
      this.budgets = data.budgets;
    });
  }

  fun(content: any, s: Budget) {
    this.form.setValue({
      LIBACTGE: s.LIBACTGE.toString(),
      MONTSTRU: s.MONTSTRU.toString(),
      MONTRAPP: s.MONTRAPP.toString(),
      MOISSOLD: s.MOISSOLD.toString(),
      CODYTPAC: s.CODYTPAC,
      Budgets: s.Budgets.toString()
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
      const budget = {
        MONTSTRU: this.form.value.MONTSTRU,
        MONTRAPP: this.form.value.MONTRAPP,
        MOISSOLD: this.form.value.MOISSOLD,
        CODYTPAC: this.form.value.CODYTPAC,
        LIBACTGE: this.form.value.LIBACTGE,
        Budgets: this.form.value.Budgets
      };

      // budgetphoto

      const formData = new FormData();
      formData.append('MONTSTRU', this.form.value.MONTSTRU);
      formData.append('MONTRAPP', this.form.value.MONTRAPP);
      formData.append('MOISSOLD', this.form.value.MOISSOLD);
      formData.append('CODYTPAC', this.form.value.CODYTPAC);
      formData.append('LIBACTGE', this.form.value.LIBACTGE);
      formData.append('Budgets', this.form.value.Budgets);
      const selectedFile = (document.getElementById('inputGroupFile01') as HTMLInputElement).files;
      if (selectedFile != null) {
        formData.append('budgetphoto', selectedFile[0], selectedFile[0].name);
      }

      this.budgetService.addBudget(budget).subscribe(() => {
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