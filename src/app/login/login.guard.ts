import { Injectable } from '@angular/core';
import {  CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take,tap, switchMap } from 'rxjs/operators';
import { MainService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad  {
  constructor( 
    private mainServ:MainService,
    private router:Router
    ){}
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean{
 
    return this.mainServ.userIsAuthorized.pipe(
      take(1),
      switchMap(isAuth=>{
        if(!isAuth){
          return this.mainServ.autoLogin();
        }else{
          return of(isAuth);
        }
      }),
      tap(isAuth=>{
        if(!isAuth){
          this.router.navigateByUrl('/login')
        }
      })
    )
  }
}
