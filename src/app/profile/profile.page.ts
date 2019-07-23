import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../main.service';
import { Subscription } from 'rxjs';
import { Signup } from '../app.model';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit,OnDestroy {
  authSub: Subscription;
  isAuth: boolean=false;
  userId: string;
  loadedUserDetails:Signup;
  constructor(
    private events:Events,
    private mainServ:MainService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.events.subscribe('Auth:Changed',(isAuth)=>{
    //   console.log(isAuth,'form Events')
    //   this.isAuth=isAuth; 
    // })
  }

  ionViewWillEnter(){
    this.authSub=this.mainServ.userIsAuthorized.subscribe(res=>{
      this.isAuth=res;
      console.log(this.isAuth);
      if(this.isAuth){
        this.mainServ.userId.subscribe(id=>{
          console.log(id);
          if(id!==null){
            this.mainServ.userDetails(id).subscribe(res=>{
              console.log(res);
              this.loadedUserDetails=res;
              console.log(this.loadedUserDetails)
            },
            err=>{
              this.mainServ.errHandler(err);
            })
          }
          // else{
          //   this.router.navigateByUrl('/login')
          // }
        })
      }
    })
  }
 

  shareApp(){
    this.mainServ.shareApp();
  }

  logout(){
    this.mainServ.logout();
  }

  ionViewDidLeave(){
    this.authSub.unsubscribe();
  }
  ngOnDestroy(){
  }

}
