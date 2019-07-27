import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, Events, AlertController } from '@ionic/angular';
import { MainService } from './main.service';
import { Plugins, Capacitor} from '@capacitor/core'
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Signup } from './app.model';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit,OnDestroy{
  isAuth:boolean;
  isLoading:boolean=false;
  authSub:Subscription;
  loadedUserDetails:Signup;
  constructor(
    private platform: Platform,
    public events:Events,
    private alertCtrl:AlertController,

    private mainServ:MainService
  ) {
    this.initializeApp();
    /*Events are used because subscribing not updating the side menu due to ionic catching */
      this.events.subscribe('Auth:Changed',(isAuth)=>{
        console.log(isAuth,'form Events')
        this.isAuth=isAuth; 
        if(this.isAuth){
          this.getUserDetails();
       }
      })

    
  }

  ngOnInit(){
    this.getAuthStatus();
    
   
    // this.mainServ.getSubscribeSuccess()
    // .pipe(take(1))
    // .subscribe(res=>{
    //   if(res){
    //     console.log(res)
    //     this.getAuthStatus();
    //   }
    // })
   
  }
  ionViewDidEnter(){
    // this.mainServ.getSubscribeSuccess().pipe(take(1)).subscribe(res=>{
    //   if(res){
    //     console.log(res)
    //     this.getAuthStatus();
    //   }
    // })
  }


  getAuthStatus(){
    this.authSub=this.mainServ.userIsAuthorized.pipe(take(1)).subscribe(res=>{
      this.isAuth=res;
      console.log(this.isAuth);
    })
  }

  getUserDetails(){
    this.isLoading=true;
    this.mainServ.userId.subscribe(id=>{
      console.log(id);
      if(id!==null){
        this.mainServ.userDetails(id).subscribe(res=>{
          console.log(res);
          this.loadedUserDetails=res;
          console.log(this.loadedUserDetails)
           this.isLoading=false;

        },
        err=>{
          // this.mainServ.errHandler(err);
          console.log(err);
          this.isLoading=false;

        })
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
    });
  }

  // Share App
  shareApp(){
    this.mainServ.shareApp();
  }
  // Share App

  // exitApp
  exitApp(){
    this.alertCtrl.create({
      header:'Are you sure?',
      message:'Do you want to exit the app',
      buttons:[
        {
          text:'Cancel',
          role:'cancel'
        },
        {
          text:'Exit',
          handler:()=>{
            this.mainServ.exitApp();
          }
        }
      ]
    }).then(alertEl=>{
      alertEl.present();
    })
  }

  // exitApp
// Logout
  logout(){
    this.mainServ.logout();
  }
// Logout
ionViewDidLeave(){
  this.authSub.unsubscribe();
}
ngOnDestroy(){
 
}

doRefresh(event) {
  this.getUserDetails();
  if(this.isLoading=true){
    event.target.complete();
  }
}
}
