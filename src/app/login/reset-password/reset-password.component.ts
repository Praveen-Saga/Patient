import { Component, OnInit } from '@angular/core';
import { ResetPwd } from 'src/app/app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MainService } from 'src/app/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  existingRoute:string;
  loadedUser:string;
  userSub:Subscription;
  resetPwd:ResetPwd={
    email:null,
    oldpassword:null,
    newpassword:null,
    confirmpassword:null,
    otp:null,
  }
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private mainServ:MainService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(res=>{
        this.existingRoute=res.get('resetPwd')
        console.log(this.existingRoute);
      if(!this.existingRoute)
      { 
        // console.log('problem in parammap')
        this.router.navigateByUrl('/login');
      }
    })

    this.userSub=this.mainServ.userIsAuthorized.subscribe(res=>{
      console.log(res);
      if(res){
        this.mainServ.userId.subscribe(res=>{
          console.log(res)
            this.loadedUser=res;
        })
      }else{
        console.log('Not Authorized...!')
        // this.router.navigateByUrl('/login');
      }
    }) 
  }

  onResetPwd(form:NgForm){
    console.log(this.resetPwd)
    if(this.existingRoute=='forgot-password'){
      console.log('New Password Set Successfully');
    }
    if(this.existingRoute=='change-password'){
      if(this.loadedUser && this.loadedUser!==''){
        this.mainServ.changePwd(this.loadedUser,{
          password:this.resetPwd.oldpassword,
          newpassword:this.resetPwd.newpassword
        })
        this.mainServ.getSubscribeSuccess().subscribe(res=>{
          console.log(res);
          if(res){
            form.resetForm();
            this.mainServ.alertHandler('Success','Password Changed Successfully')
            // this.mainServ.logout();
            // this.router.navigateByUrl('/profile');
          }
        })
      }
    }
  }
}
