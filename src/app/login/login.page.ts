import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loadedUser;
  login={
    email:'',
    password:''
  }
  constructor(
    private mainServ:MainService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  loginUser(form:NgForm){
    console.log(this.login);
    this.mainServ.loginUser(this.login);
    this.mainServ.getLoginSubscribeSuccess().subscribe(res=>{
      // console.log(res);
      if(res){
        form.resetForm();
        console.log(this.mainServ.pickappointment.value,this.mainServ.appointment.value)
        if(this.mainServ.pickappointment.value==null && this.mainServ.appointment.value==null){
             this.router.navigateByUrl('/home');
        }else{
          this.router.navigateByUrl('/home/confirm-appointment');
        }
      }
    })
  }

  fbLogin(){
    console.log('Facebook Login...');
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
          
      }
      else {
          FB.login((loginResponse)=>{
            this.mainServ.fblogin();
          });
      }
  });
// }
   
  }
}
