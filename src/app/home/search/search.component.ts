import { Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../main.service';
import { RegProviders, HealthProvider, Search } from '../../app.model';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { ViewComponent } from '../view/view.component';
import { Subscription, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})


export class SearchComponent implements OnInit {
// @ViewChild('searchForm') form:NgForm;
  loadedProviderId:string;
  title:string;
  skeltonLength=Array(7)
  registeredProvider:RegProviders[]=[];
  filteredOptions:RegProviders[]=[]
  allProviders:HealthProvider[];
  myProvider:HealthProvider;
  searchOpen:boolean=false;
  authSub:Subscription;
  isLoading:boolean=false;
  availableDays:string='';
  search:Search={
    name:'',
    gender:'',
    slot:[],
    speciality:''
  }
  // list dummy data

  myProviders:RegProviders[]=[
//     {
//     name:'praveen',
//     providerId:this.loadedProviderId,
//     qualification:'MBBS',
//     speciality:'Orientology',
//     experience:20,
//     language:['telugu','hindi','english'],
//     slots:[
//       {
//         availableDays:'sunday',
//         availableTimes:['7-8','8-9']
//       }
//     ],
//     address:'sjdlfjlsajfljs',
//     latitude:9809700,
//     longitude:080980,
//     photo:'',
//     gender:'Male',
//     phone:345345345,
//     email:'sdrfjdsjd@jflsjdfsjs.cds'
// },


]

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private mainServ:MainService,
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {
   
  }

  ionViewWillEnter(){
    // getting id from url
    this.activatedRoute.paramMap.subscribe(res=>{
      this.loadedProviderId=res.get('service-provider'); 
      this.getProvidersList(this.loadedProviderId);
    })
    // getting id from url

    // Getting Provider Group doctor , nurse etc
    this.mainServ.getProviders().subscribe(res=>{
      console.log(res);
      this.allProviders=res;
      this.myProvider=this.allProviders.find(el=>{
        return el._id==this.loadedProviderId;
      })
      console.log(this.myProvider)
      this.title=this.myProvider.providerName.toLowerCase()
      .replace("-"," ").split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')

    },err=>{
      this.mainServ.errHandler(err)
    })
    // Getting Provider Group doctor , nurrse etc

   
  }

  //  Get LIst of the Providers of the loadedProviderId Group
  getProvidersList(id){
    this.isLoading=true;
    this.mainServ.getProviderList(id).subscribe(res=>{
      console.log(res);
      this.registeredProvider=[...res];
      this.registeredProvider.forEach(el=>{
        el.photo=environment.url.concat(el.photo)
        console.log(el.photo)
      })
      console.log(this.registeredProvider);
    this.filteredOptions=this.registeredProvider;
      this.isLoading=false;
     
    },
    err=>{
      this.isLoading=false;
      this.mainServ.errHandler(err)
      // this.registeredProvider=[...this.myProviders]
    })
  }
  //  Get LIst of the Providers of the loadedProviderId Group
 
  // Search filters Open and Close
  onSearch(){
    this.searchOpen=!this.searchOpen;
  }

  submit(form:NgForm){
    // this.search.slot.length=0;
    // this.search.slot.push({
    //   availableDays:this.availableDays,
    //   availableTimes:[],
    // });
    // console.log(this.search)

    // if(this.search.name=='' && this.search.gender=='' && this.availableDays=='' 
    // && this.search.speciality==''){
      this.filteredOptions=this.registeredProvider;
    // }


    if(this.search.name!==""){
      const filterValue=this.search.name.toLowerCase().replace(/\s/g,'');;
      this.filteredOptions=this.filteredOptions.filter(el=>{
          return el.name.toLowerCase().replace(/\s/g,'').includes(filterValue)
      })
      console.log(this.filteredOptions)
    }

    if(this.search.gender!==""){
      const filterValue=this.search.gender.toLowerCase();
      this.filteredOptions=this.filteredOptions.filter(el=>{
          return el.gender.toLowerCase()==filterValue;
      })
      console.log(this.filteredOptions)
    }

    if(this.search.speciality!==""){
      const filterValue=this.search.speciality.toLowerCase().replace(/\s/g,'');;
      this.filteredOptions=this.filteredOptions.filter(el=>{
          return el.speciality.toLowerCase().replace(/\s/g,'').includes(filterValue)
      })
      console.log(this.filteredOptions)
    }

    if(this.availableDays!==""){
      const filterValue=this.availableDays.toLowerCase();
      console.log(filterValue)
      this.filteredOptions=this.filteredOptions.filter(el=>{
        // console.log(el);
        
       return !!(el.slots.find((myslot)=>{
          //  console.log(myslot)
            // if(myslot.availableDays.toLowerCase().includes(filterValue)){
            //   return el;
            // }
            return myslot.availableDays.toLowerCase().includes(filterValue)
           
          }))
      })
      console.log(this.filteredOptions)
      // let slotFilter:RegProviders[]=[]
      // this.filteredOptions.forEach(el=>{
      //    for(let i=0;i<el.slots.length;i++){
      //      if(el.slots[i].availableDays==this.availableDays){
      //       slotFilter.push(el);
      //      }
      //    }

      // })
      // this.filteredOptions=slotFilter;
    }
    



    // this.mainServ.searchFor(this.loadedProviderId,this.search)
    
  }

  
  // Search filters Open and Close


  // view details in a model
  viewDetails(loadedProviderDetails:RegProviders){
    this.modalCtrl.create({
      component:ViewComponent,
      componentProps:loadedProviderDetails,
      cssClass: 'modal',
    }).then(modalEl=>{
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resData=>{
      console.log(resData);
      if(resData.role=='confirm'){
        // this.mainServ.alertHandler('Request Sent','Request for Appointment is sent to doctor '+loadedProviderDetails.name+'Further Details will be informed after Confirmation.')
       
        console.log(loadedProviderDetails)
        this.mainServ.pickappointment.next(loadedProviderDetails);
        console.log(this.mainServ.pickappointment.value)
        // this.authSub=this.mainServ.userIsAuthorized.subscribe(res=>{
        //   if(res){
        //       this.router.navigateByUrl('/home/confirm-appointment')
        //   }else{
        //        this.router.navigateByUrl('/login');
        //   }
        // })
        this.router.navigateByUrl('/home/confirm-appointment')
          
      }
    })
  }
  // view details in a model

  doRefresh(event) {
    this.getProvidersList(this.loadedProviderId);
    if(this.isLoading=true){
      event.target.complete();
    }

  }
}
