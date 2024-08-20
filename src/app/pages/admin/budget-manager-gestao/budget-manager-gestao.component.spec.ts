import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetManagerGestaoComponent } from './budget-manager-gestao.component';

describe('BudgetManagerGestaoComponent', () => {
  let component: BudgetManagerGestaoComponent;
  let fixture: ComponentFixture<BudgetManagerGestaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetManagerGestaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetManagerGestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
