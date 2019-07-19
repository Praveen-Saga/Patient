import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MainService } from '../main.service';

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
    private mainServ:MainService
  ) { }

  ngOnInit() {
  }

  loginUser(form:NgForm){
    console.log(this.login);
    this.mainServ.loginUser(this.login);
    this.mainServ.getSubscribeSuccess().subscribe(res=>{
      console.log(res);
      if(res){
        form.resetForm();
      }
    })
  }
}
