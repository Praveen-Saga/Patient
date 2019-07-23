import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MainService } from './main.service';
import { Plugins, Capacitor} from '@capacitor/core'
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit,OnDestroy{
  isAuth:boolean;
  authSub:Subscription;
  constructor(
    private platform: Platform,
    public events:Events,

    private mainServ:MainService
  ) {
    this.initializeApp();
    /*Events are used because subscribing not updating the side menu due to ionic catching */
      this.events.subscribe('Auth:Changed',(isAuth)=>{
        console.log(isAuth,'form Events')
        this.isAuth=isAuth; 
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

}
