import { inject } from "@angular/core/primitives/di";
import { AuthService } from "../services/auth.service";
import { CanActivateFn, Router } from "@angular/router";


export const roleGuard = (requiredRole: string): CanActivateFn => {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        if (auth.hasRole(requiredRole)) {
            return true;
        }
        // This route is not registered, so redirect to a valid page instead.
        return router.createUrlTree(['/login']);
    };
};