import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const localData = localStorage.getItem('user');
  if (!localData) {
    router.navigate(['/login']);
    return false;
  }else{
    return true;
  }

};
