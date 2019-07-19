import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'',
        component:LoginPage,
      },
      {
        path:'sign-up',
        component:SignupComponent
      },
      {
        path:':resetPwd',
        component:ResetPasswordComponent
      },
      {
        path:'**',
        component:LoginPage
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginPage,
    SignupComponent,
    ResetPasswordComponent
  ]
})
export class LoginPageModule {}
