import { Component } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-budgets',
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.css']
})

export class ListBudgetsComponent {

  public budgets: any[] = [];

  constructor(private budgetService:BudgetService) { }

  ngOnInit() {

    this.getBudgets();

    

  }

  getBudgets(){
    this.budgetService.getBudgets().subscribe((data:any) => {
      this.budgets = data.budgets;
    });
  } 


}
