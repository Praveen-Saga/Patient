import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { UserAppointmentsComponent } from './user-appointments/user-appointments.component';

const routes: Routes = [
  {
    path: '',
    children:[
        {
          path:'',
          component:ProfilePage
        },
        {
          path:'appointments',
          component:UserAppointmentsComponent,
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
    ProfilePage,
    UserAppointmentsComponent
  ]
})
export class ProfilePageModule {}
