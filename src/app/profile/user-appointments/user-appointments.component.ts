import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';
import { Subscription } from 'rxjs';
import { FixAppointment } from 'src/app/app.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss'],
})
export class UserAppointmentsComponent implements OnInit {
authSub:Subscription;
userId:string;
isAuth:boolean=false;
isLoading:boolean=false;
skeltonLength=Array(7)
userAppointments:FixAppointment[]=[]
  constructor(
    private mainServ:MainService,
    private router:Router,
  ) { }
 
  ngOnInit() {
  //  this.nextDay(5);
  }

  ionViewDidEnter(){
    this.authSub=this.mainServ.userIsAuthorized.subscribe(res=>{
      console.log(res);
      this.isAuth=res;
      if(res){
        this.mainServ.userId.subscribe(res=>{
          this.userId=res;
          if(res!==null){
           this.getMyAppointments(res)
          }
        })
      }else{
        this.router.navigateByUrl('/login')
      }
    })
  }

  getMyAppointments(id){
    this.isLoading=true;
    this.mainServ.getAppointments(id).subscribe(res=>{
      console.log(res);
      this.userAppointments=res;
      this.isLoading=false;
    },err=>{
      this.mainServ.errHandler(err);
      this.isLoading=false;
    })
  }

  doRefresh(event) {
    this.getMyAppointments(this.userId);
    if(this.isLoading=true){
      event.target.complete();
    }

  }

  getColor( status: string){
    console.log(status);
    switch (status){
      case 'pending': return'#def5fa' ;
      case 'confirmed': return '#ffffcc';
      case 'completed': return '#daffcc';
      case 'canceled': return '#ffe2e0';
    }
  }

}
