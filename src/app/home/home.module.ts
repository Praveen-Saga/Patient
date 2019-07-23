import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SearchComponent } from './search/search.component';
import { ViewComponent } from './view/view.component';
import { ConfirmAppointmentComponent } from './confirm-appointment/confirm-appointment.component';

const routes=[
  {
    path: '',
    children:[
      {
        path:"",
        component: HomePage,
      },
      {
        path:"confirm-appointment",
        component: ConfirmAppointmentComponent,
      },
      {
        path:':service-provider',
        component: SearchComponent,
      }
    ]
  }

]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HomePage,
    SearchComponent,
    ViewComponent,
    ConfirmAppointmentComponent
  ],
  entryComponents:[ViewComponent]
})
export class HomePageModule {}
