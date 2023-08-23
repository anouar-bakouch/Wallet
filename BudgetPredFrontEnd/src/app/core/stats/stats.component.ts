import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { StatsService } from '../services/stats.service';
import { MonthlyBudget } from 'src/models/MonthlyBudget';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  budgets: number[] = [];
  savings: number[] = [];
  spendings: number[] = [];
  dataR: MonthlyBudget[] = [];
  months: string[] = [];
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Budget, Savings, and Spendings'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount'
        }
      }
    }
  };

  @ViewChild('chartCanvas') chartCanvas: ElementRef | undefined;

  public lineChart: Chart | undefined;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getStats().subscribe(data => {
      this.dataR = data;

      this.dataR.forEach((element: MonthlyBudget) => {
        this.budgets.push(element.budget);
        this.savings.push(element.savings);
        this.spendings.push(element.spendings);
        this.months.push(element.month);
      });

      if (this.chartCanvas) {
        this.lineChart = new Chart(this.chartCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.months,
            datasets: [
              {
                label: 'Budget',
                data: this.budgets,
                borderColor: 'blue',
                fill: false
              },
              {
                label: 'Savings',
                data: this.savings,
                borderColor: 'green',
                fill: false
              },
              {
                label: 'Spendings',
                data: this.spendings,
                borderColor: 'red',
                fill: false
              }
            ]
          },
          options: this.chartOptions
        });
      }
    });
  }
}