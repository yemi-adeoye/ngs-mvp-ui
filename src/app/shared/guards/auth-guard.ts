import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../core/services/impl/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)

  return authService.verifyAuthentication();
};
