import { Component, OnInit } from '@angular/core';
import { ResetPwd } from 'src/app/app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  existingRoute:string;

  resetPwd:ResetPwd={
    email:null,
    oldpassword:null,
    newpassword:null,
    confirmpassword:null,
    otp:null,
  }
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(res=>{
        this.existingRoute=res.get('resetPwd')
        console.log(this.existingRoute);
      if(this.existingRoute && this.existingRoute!=='')
      {

      }
    })
  }

  onResetPwd(form:NgForm){
    console.log(this.resetPwd)
    if(this.existingRoute=='forgot-password'){
      console.log('New Password Set Successfully');
    }
    else{
      console.log('Password Changed Successfully')
    }
  }
}
