import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { registerSuccessGuardGuard } from './register-success-guard-guard';

describe('registerSuccessGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => registerSuccessGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
