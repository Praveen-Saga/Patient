export interface Login{
    _id?:string;
    email:string;
    password: string;
    token?:string;
}

export interface Signup{
    _id?:string;
    name:string;
    age:number;
    gender:string;
    address:string;
    email:string;
    phone:number;
    password:string;
    confirmpassword:string;
    token?:string;
    status?:string;
}

export interface ResetPwd{
    email?:string;
    oldpassword?:string;
    newpassword:string;
    confirmpassword:string;
    otp?:string;
}

export interface HealthProvider{
    _id:string;
    status?: 'active' | 'inactive'  
    providerName:string;
    icon?:string;
}

export interface RegProviders{
    providerId: string;
    _id?:string;
    status?: 'active' | 'inactive'
    name: string;
    qualification: string;
    speciality: string;
    experience: number;
    language: string[];
    slots: Availability[];
    address: string;
    latitude: number;
    longitude: number;
    photo: string;
    gender: string;
    phone: number;
    email: string;
  }

  
  export interface Availability{
    availableDays: string;
    availableTimes: string[];
  }


  export interface Search{
      name:string;
      gender:string;
      speciality:string;
    //   availableDays:string;
    slot?:Availability[];
  }

export class User{
    constructor(
        public _id:string,
        public email:string,
        // private _token?:string,
        // private tokenExpirationDate?: Date
         ){}

    // get token(){
    //     // if(!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()){
    //     //     return null;
    //     // }
    //     //  currently commented because token expiration is not avaliable
    //     return this._token;
    // }
}

export class Appointment{
    constructor(
        // public userId:string,
        // public providerId:string,
        // public pickedSlot:{
        public    day:string,
        public    date:string,
        public   time:string,
        
        // }
    ){}
}

export interface FixAppointment{
        _id:string,
        patientId:string,
        status:'pending'|'confirmed'|'completed'| 'canceled'
        patientname:string,
        address:string,
        doctorname:string,
        doctorId:string,
        pickedslots:Appointment[],
}

export enum days{
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}