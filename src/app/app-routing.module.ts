import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { LoginComponent } from './pages/login/login.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {path: 'register', component: SignupComponent, canActivate: [authGuard]},
  {path: 'product/:id', component: ProductComponent},
  {path: 'login', component: LoginComponent, canActivate: [authGuard]},
  {path: 'checkout', component: CheckoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
