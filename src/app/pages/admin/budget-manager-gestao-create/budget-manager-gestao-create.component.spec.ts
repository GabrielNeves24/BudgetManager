import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetManagerGestaoCreateComponent } from './budget-manager-gestao-create.component';

describe('BudgetManagerGestaoCreateComponent', () => {
  let component: BudgetManagerGestaoCreateComponent;
  let fixture: ComponentFixture<BudgetManagerGestaoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetManagerGestaoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetManagerGestaoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
