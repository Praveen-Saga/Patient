import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { HealthProvider, RegProviders } from 'src/app/app.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  loadedProviderData:RegProviders={
    name:this.navParams.data.name,
    providerId:this.navParams.data.providerId,
    qualification:this.navParams.data.qualification,
    speciality:this.navParams.data.speciality,
    experience:this.navParams.data.experience,
    language:this.navParams.data.language,
    slots:this.navParams.data.slots,
    address:this.navParams.data.address,
    latitude:this.navParams.data.latitude,
    longitude:this.navParams.data.longitude,
    photo:this.navParams.data.photo,
    gender:this.navParams.data.gender,
    phone:this.navParams.data.phone,
    email:this.navParams.data.email,
  };

  constructor(
    private modalCtrl:ModalController,
    private navParams:NavParams,
  ) { }

  ngOnInit() {
    console.log(this.navParams.data)
    console.log(this.loadedProviderData)
  }

  cancel(){
    this.modalCtrl.dismiss(null,'cancel');
  }

  bookAppointment(){
    this.modalCtrl.dismiss(this.loadedProviderData,'confirm');
  }
}