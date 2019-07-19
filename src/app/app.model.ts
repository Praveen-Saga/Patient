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
    language: string;
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
