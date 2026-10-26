import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/impl/auth';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)

  const authState = authService.authState()
  const router = inject(Router)

  if (authState === 'anonymous') {
    return true
  }

  if (authState === 'authenticated') {
    return router.createUrlTree(['app'])
  }

  return authService.tryRefresh(router.createUrlTree(['app']), true)

};
