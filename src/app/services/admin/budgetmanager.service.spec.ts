import { TestBed } from '@angular/core/testing';

import { BudgetmanagerService } from './budgetmanager.service';

describe('BudgetmanagerService', () => {
  let service: BudgetmanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetmanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
