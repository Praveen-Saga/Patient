import { Component, OnInit } from '@angular/core';
import { Signup } from '../../app.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  signup:Signup={
    name:'',
    age:null,
    gender:'',
    address:'',
    email:'',
    phone:null,
    password:'',
    confirmpassword:''
  }
  constructor(
    private router:Router,
    private mainServ: MainService
  ) { }

  ngOnInit() {}

  signupUser(form:NgForm){
    console.log(this.signup);
    this.mainServ.signUpUser(this.signup)
    this.mainServ.getSubscribeSuccess().subscribe(res=>{
      console.log(res);
      if(res){
        form.resetForm();
      }
    })
  }

}
