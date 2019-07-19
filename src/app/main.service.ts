import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HealthProvider, RegProviders } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class MainService implements OnInit{

  private SubscribeSuccess=new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
  ) { 

  }

  ngOnInit(){
    this.SubscribeSuccess.next(false);
  }

  getSubscribeSuccess(){
    return this.SubscribeSuccess.asObservable();
  }

// Alert Handler
alertHandler(header,message){
  this.alertCtrl.create({
    header:header,
    message:message,
    buttons:['ok']
  }).then(ele=>{
    ele.present();
  })
}

// Alert Handler

//Error Handler 

errHandler(err){
  console.log(err);
  if(err.message.includes('Http failure response ')){
      this.alertHandler('Error',err.statusText+"\n Problem With Connectivity Please Try Again Later..")
  }
 else{
      this.alertHandler('Error','Unexpected Error Occur..')
}
}
//Error Handler 

// Getting Providers to display available services
  getProviders(){
    return this.http.get<HealthProvider[]>(environment.url+'getProviders');
  }
// Getting Providers to display available services


// Signing Up New User
  signUpUser(post){
    this.loadingCtrl.create({
      message:'Submitting Details Please Wait...'
    }).then(
      loader=>{
        loader.present();
        return this.http.post(environment.url+'savePatient',post)
        .subscribe(res=>{
          loader.dismiss();
          console.log(res);
          this.alertHandler('Success',"Sign-up Successful")
          this.router.navigateByUrl('/login');
          this.SubscribeSuccess.next(true)
        },
        err=>{
          loader.dismiss();
          this.errHandler(err);
        })
      })
      this.SubscribeSuccess.next(false);
  }
// Signing Up New User

// Logging In New User

loginUser(post){
  this.loadingCtrl.create({
    message:'Logging In Please Wait...'
  }).then(
    loader=>{
      loader.present();
      return this.http.post(environment.url+'patientlogin',post)
      .subscribe(res=>{
        loader.dismiss();
        console.log(res);
        this.alertHandler('Success',"Login Successful")
        this.router.navigateByUrl('/home');
        this.SubscribeSuccess.next(true)
      },
      err=>{
        loader.dismiss();
        this.errHandler(err);
      })
    })
    this.SubscribeSuccess.next(false);
}
// Logging In New User

// Getting Registered Providers in Search Page
getProviderList(id){
  return this.http.get<RegProviders[]>(environment.url+'getActor/'+id)
}
// Getting Registered Providers in Search Page

}
