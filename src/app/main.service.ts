import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LoadingController, AlertController, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject, EMPTY, BehaviorSubject, from, of } from 'rxjs';
import { HealthProvider, RegProviders, User, Signup, Appointment, FixAppointment } from './app.model';
import { catchError, shareReplay, retry, map, tap, take, switchMap } from 'rxjs/operators';
import { Plugins, AppState } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class MainService implements OnInit{

  private SubscribeSuccess=new Subject<boolean>();
  private LoginSubscribeSuccess=new Subject<boolean>();
  private _user=new BehaviorSubject<User>(null);
  pickappointment=new BehaviorSubject<RegProviders>(null)
  appointment=new BehaviorSubject<Appointment>(null)
  

  constructor(
    private http: HttpClient,
    private router:Router,


    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    public events:Events,
  ) { 

  }
  
  get userIsAuthorized(){
    return this._user.asObservable()
    .pipe(take(1),
      map(user=>{
        if(user){
        return !!user._id        
        }else {
          return false;
        }
      }
      )
      )
    .pipe(
      take(1),
      switchMap(isAuth=>{
        if(!isAuth){
          return this.autoLogin();
        }else{
          return of(isAuth);
        }
      }),
      tap(isAuth=>{
        if(!isAuth){
          // this.router.navigateByUrl('/login')
          return false;
        }

      })
    )
  }
  get userId(){
    return this._user.asObservable().pipe(map(user=>{
      if(user){
      return user._id;        
      }
      else {
        return null;
      }
    })
    )
  }

  // get token(){
  //   return this._user.asObservable().pipe(map(user=>{
  //     if(user){
  //     return user.token;        
  //     }else {
  //       return null;
  //     }
  //   })
  //   )
  // }
  
  ngOnInit(){
    this.SubscribeSuccess.next(false);
  }

  getSubscribeSuccess(){
    return this.SubscribeSuccess.asObservable();
  }
  getLoginSubscribeSuccess(){
    return this.LoginSubscribeSuccess.asObservable();
  }

  // getting selected doctor details
  get Provider(){
    return this.pickappointment.asObservable();
  }
  // getting selected doctor details


// Alert Handler
alertHandler(header,message){
  this.alertCtrl.create({
    header:header,
    message:message,
    buttons:['ok']
  }).then(ele=>{
    ele.present();
  })
}

// Alert Handler

//Error Handler 

errHandler(err){
  console.log(err);
  if(err.message.includes('Bad Request')){
      this.alertHandler('Error',"Please Enter Vaild Details")
  }
  else if(err.statusText.includes('Unknown Error') ){
    this.alertHandler('Error',"Problem with connectivity please try again later..")
}
 else{
      this.alertHandler('Error','Unexpected Error Occur..')
}
}
//Error Handler 

// Getting Providers to display available services
  getProviders(){
    return this.http.get<HealthProvider[]>(environment.url+'getProviders');
  }
// Getting Providers to display available services

// Getting Registered Providers in Search Page
getProviderList(id){
  return this.http.get<RegProviders[]>(environment.url+'getActorActive/'+id)
  .pipe(
    retry(5),catchError((err)=>{
      console.log(err)
      return EMPTY;
    }),
    shareReplay()
    )
}
// Getting Registered Providers in Search Page

// LoggedIn User Details
userDetails(id){
  return this.http.get<Signup>(environment.url+'getpatient/'+id);
}

// LoggedIn User Details

// Signing Up New User
  signUpUser(post){
    this.loadingCtrl.create({
      message:'Submitting Details Please Wait...'
    }).then(
      loader=>{
        loader.present();
        return this.http.post(environment.url+'savePatient',post)
        .subscribe(res=>{
          loader.dismiss();
          console.log(res);
          this.alertHandler('Success',"Sign-up Successful")
          this.router.navigateByUrl('/login');
          this.SubscribeSuccess.next(true)
        },
        err=>{
          loader.dismiss();
          this.errHandler(err);
        })
      })
      this.SubscribeSuccess.next(false);
  }
// Signing Up New User

// Storing Data using Plugin

private storeLoginData(userId:string,email:string){
  const data = JSON.stringify({ userId:userId, email:email});
  Plugins.Storage.set({key:'loginData',value: data});
}

// Storing Data using Plugin

// Logging In New User

loginUser(post){
  this.loadingCtrl.create({
    message:'Logging In Please Wait...'
  }).then(
    loader=>{
      loader.present();
      return this.http.post<RegProviders>(environment.url+'patientlogin',post)
      .subscribe(res=>{
        loader.dismiss();
        console.log(res);
        // this.alertHandler('Success',"Login Successful")
        this._user.next(new User(res._id,res.email));
        this.storeLoginData(res._id,res.email)
        this.router.navigateByUrl('/home');
        this.LoginSubscribeSuccess.next(true)
    this.events.publish('Auth:Changed',true);

      },
      err=>{
        loader.dismiss();
        this.errHandler(err);
      })
    })
    this.LoginSubscribeSuccess.next(false);

}
// Logging In New User

// AutoLogin for stored user details
autoLogin(){
return from (Plugins.Storage.get({key: 'loginData'})).pipe(
  map(storedData=>{
    if(!storedData || !storedData.value){
      return null;
    }
    const parsedData=JSON.parse(storedData.value) as {userId:string,email:string};
    // const expirationTime= new Date(parsedData.tokenExpirationDate);
    // if(expirationTime<= new Date()){
    //   return null;
    // }
    const user= new User(parsedData.userId,parsedData.email);
    return user;
}),
tap(user=>{
  if(user){
    this._user.next(user);
    this.LoginSubscribeSuccess.next(true)
    this.LoginSubscribeSuccess.next(false);
    
      /*Events are used because subscribing not updating the side menu due to ionic catching */
    this.events.publish('Auth:Changed',true);
      /*Events are used because subscribing not updating the side menu due to ionic catching */
  }
}),
map(user=>{
 

  return !!user //returns true when their is user otherwise false;
})
);
}

// LogOut
    logout(){
      this._user.next(null);
      Plugins.Storage.remove({key:'loginData'});
      this.userIsAuthorized;
      this.router.navigateByUrl('/home');
      this.events.publish('Auth:Changed',false);

    }
// LogOut

// change Password
changePwd(id,post){
  console.log(id,post);
  this.http.put<Signup>(environment.url+'updatepatientpassword/'+id, post).subscribe(res=>{
    console.log(res);
    if(res.status){
      if(res.status=="Password  mismatch"){
        this.alertHandler('Error','Please Enter a Valid Password..')
      }
    }else{
      this.SubscribeSuccess.next(true);
   }
  },
  err=>{
    console.log(err);
    this.SubscribeSuccess.next(true)

  })
  this.SubscribeSuccess.next(false)
}


forgotPwd(email:string){
  return this.http.get(environment.url+'forgotpassword/'+email)
}
// change Password

// search among doctors nurses etc

searchFor(id,post){
  console.log(id,post);
  return this.http.post(environment.url+'searchActor/'+id, post).subscribe(res=>{
    console.log(res);
  },
  err=>{
    this.errHandler(err);
  })
}
// search among doctors nurses etc

// Save Appointment
saveAppointment(post){
  this.http.post<FixAppointment>(environment.url+'saveAppointment',post).subscribe(res=>{
    console.log(res);
    if(res._id && res.patientId){
      this.SubscribeSuccess.next(true);
    }
  },
  err=>{
    this.errHandler(err);
  })
  this.SubscribeSuccess.next(false);
}
// Save Appointment

// get user appointments
getAppointments(id){
  return this.http.get<FixAppointment[]>(environment.url+'getPatientappointment/'+id);
}
// get user appointments

// Sharing App
shareApp(){
const { Share } = Plugins;
  Share.share({
    title: 'Share this app',
    text: 'Home Care Portal',
    url: 'https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en_IN',
    dialogTitle: 'Share with buddies'
  });
}

exitApp(){
  const { App } = Plugins;
  App.exitApp();
}
// Sharing App




}
