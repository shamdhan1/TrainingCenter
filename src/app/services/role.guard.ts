import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data?.['roles'] as string[] | undefined;
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(expectedRoles)) {
    return true;
  }

  // Not authorized for this route: redirect to dashboard
  console.warn(`User does not have required roles [${expectedRoles.join(', ')}]. Redirecting to dashboard.`);
  router.navigate(['/dashboard']);
  return false;
};
