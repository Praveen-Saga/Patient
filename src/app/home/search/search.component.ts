import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../../main.service';
import { RegProviders } from '../../app.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  loadedProviderId:string;
  title:string;
  registeredProvider:RegProviders[]=[];

  constructor(
    private activatedRoute:ActivatedRoute,
    private mainServ:MainService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(res=>{
      this.loadedProviderId=res.get('service-provider'); 
      this.getProvidersList(this.loadedProviderId);
    })
  }

  getProvidersList(id){
    this.mainServ.getProviderList(id).subscribe(res=>{
      console.log(res);
      this.registeredProvider=res;
    },
    err=>{
      console.log(err);
    })
  }
 

}
