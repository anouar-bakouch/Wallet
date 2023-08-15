import { Component } from '@angular/core';
import { SpaceService } from '../services/space.service';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})

export class MySpaceComponent {
  monthly_budgets: number[] = [];
  monthly_expenses: number[] = [];
  monthly_savings: number[] = [];
  month: string[] = [];
  dataArray: any[] = [];
  private user_id = Number(localStorage.getItem('user_id'));

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.spaceService.getPurchaseByUser(this.user_id).subscribe((data: any) => {
      this.dataArray = data;
      this.sortDataArray();
    });
  }

  sortDataArray() {
    this.dataArray.sort((a, b) => {
      const dateA = new Date(a.MOISSOLD);
      const dateB = new Date(b.MOISSOLD);
      return dateA.getTime() - dateB.getTime();
    });

    this.dataArray.forEach((item: any) => {
      this.monthly_budgets.push(item.budget);
      this.monthly_savings.push(item.MONTRAPP);
      this.monthly_expenses.push(item.budget - item.MONTRAPP);
      const formattedDate = new Date(item.MOISSOLD).toISOString().split('T')[0];
      this.month.push(formattedDate);
    });
  }
}