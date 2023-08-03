import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBudgetsComponent } from './list-budgets.component';

describe('ListBudgetsComponent', () => {
  let component: ListBudgetsComponent;
  let fixture: ComponentFixture<ListBudgetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBudgetsComponent]
    });
    fixture = TestBed.createComponent(ListBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
