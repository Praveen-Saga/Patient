import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';
import { Subscription } from 'rxjs';
import { Signup, RegProviders, Availability } from 'src/app/app.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss'],
})
export class ConfirmAppointmentComponent implements OnInit {

  isAuth:boolean;
  authSub:Subscription;
  loadedUserDetails:Signup={
    name:'',
    age:null,
    gender:'',
    address:'',
    email:'',
    phone:null,
    password:'',
    confirmpassword:''
  }

  slot={
    day:'',
    time:''
  }

  selectedDayTimes:any[]=[];

  loadedActorDetails:RegProviders={
    providerId: '',
    _id:'',
    name: '',
    qualification: '',
    speciality: '',
    experience: null,
    language: [],
    slots: [],
    address: '',
    latitude: null,
    longitude: null,
    photo: '',
    gender: '',
    phone: null,
    email: '',
  }
  constructor(
    private router: Router,
    
    private mainServ:MainService,
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){
    // this.authSub=this.mainServ.userIsAuthorized.subscribe(res=>{
    //   this.isAuth=res;
    //   console.log(this.isAuth);
    //   if(this.isAuth){
    //     this.mainServ.userId.subscribe(id=>{
    //       console.log(id);
    //       if(id!==null){
    //         this.mainServ.userDetails(id).subscribe(res=>{
    //           console.log(res);
    //           this.loadedUserDetails=res;
    //           console.log(this.loadedUserDetails)
    //         },
    //         err=>{
    //           this.mainServ.errHandler(err);
    //         })
    //       }
          // else{
          //   this.router.navigateByUrl('/login')
          // }
        // })
    //   }else{
    //     console.log('Not Authorized...')
    //     this.router.navigateByUrl('/login')
    //   }
    // })


    this.mainServ.Provider.subscribe(res=>{
      console.log(res);
      if(res==null){
        this.router.navigateByUrl('/home');
      }else{
        this.loadedActorDetails=res;
      }
    })


    if(this.mainServ.appointment.getValue()!==null){
      this.submit();
    }
  }

  setTime(day: string){
    this.selectedDayTimes=this.loadedActorDetails.slots.filter(days=>days.availableDays==day)
    console.log(this.selectedDayTimes);
  }

  submit(){
    this.mainServ.appointment.next(this.slot)
    console.log(this.mainServ.appointment.getValue())
     this.authSub=this.mainServ.userIsAuthorized.subscribe(res=>{
          if(res){
            this.mainServ.userId.subscribe(res=>{
              console.log(res);
              const fixAppointment={
                userId:res,
                providerId:this.loadedActorDetails._id,
                pickedSlot:this.mainServ.appointment.getValue(),
              }
              console.log(fixAppointment)
            })
            this.mainServ.appointment.next(null);
            this.mainServ.pickappointment.next(null);
            this.mainServ.alertHandler('Request Sent','Request for Appointment is sent for'+this.loadedActorDetails.name+'\nFurther Details will be informed after Confirmation.');
            this.router.navigateByUrl('/home');
          }else{
               this.router.navigateByUrl('/login');
          }
        })
 
    
  }
 
}
