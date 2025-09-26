import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/* This guard is to prevent the user from login/registering multiple times */
export const authGuard: CanActivateFn = (route, state) => {
  const storedToken = localStorage.getItem('token')
  const token = storedToken ? JSON.parse(storedToken) : null
  const router = inject(Router)

  if (token) {
    return router.parseUrl('/')
  }

  return true;
};
