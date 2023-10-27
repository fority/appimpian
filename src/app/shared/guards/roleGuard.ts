import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MessageService } from 'primeng/api';
import { Observable, map, of, switchMap } from 'rxjs';

export const RoleGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(OidcSecurityService);
  const message = inject(MessageService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    switchMap(({ isAuthenticated }): Observable<boolean> => {
      if (!isAuthenticated) {
        return of(false);
      }
      return authService.getUserData().pipe(
        map((user) => {
          const routeRoles = (route?.data['role'] as string[]) || [];
          const userRoles = (user?.role as string[]) || [];
          const isFound = routeRoles.some((role) => userRoles.includes(role));

          if (isFound) return true;
          router.navigate(['/unauthorized'], { replaceUrl: true });
          message.add({ severity: 'error', summary: 'Unauthorized', detail: 'Access denied !' });
          return false;
        })
      );
    })
  );
};

// export const RoleGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   const router = inject(Router);
//   const authService = inject(AuthService)

//   return authService.getIsAuthenticated().pipe(
//     switchMap((isAuthenticated) => {
//       if (!isAuthenticated) {
//         router.navigate(['/unauthorized'], { replaceUrl: true });
//         return of(false);
//       }
//       return authService.getUserData().pipe(
//         map((res) => (res?.role || []) as string[]), tap((r) => { console.log(r) }),
//         map((roles) => {

//           if (roles.some((role) => route.data['role'].includes(role))) return true;
//           router.navigate(['/unauthorized'], { replaceUrl: true });
//           return false;
//         })
//       );
//     })
//   );
// }
