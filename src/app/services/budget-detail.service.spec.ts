import { TestBed } from '@angular/core/testing';

import { BudgetDetailService } from './budget-detail.service';

describe('BudgetDetailService', () => {
  let service: BudgetDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
