import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const registerSuccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const navigation = router.currentNavigation()
  const navigationState = navigation?.extras.state
  console.log(navigationState)

  if (navigationState?.['email']) {
    return true;
  }
  return router.createUrlTree(['']);
};
