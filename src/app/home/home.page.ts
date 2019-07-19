import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { HealthProvider } from '../app.model';
import { interval } from 'rxjs';
import { takeUntil, retryWhen, count } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  serviceProviders:HealthProvider[]=[];
  icons:string[]=[
    'https://www.iconbunny.com/icons/media/catalog/product/cache/2/thumbnail/600x/1b89f2fc96fc819c2a7e15c7e545e8a9/2/1/2131.10-doctor-icon-iconbunny.jpg',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABFFBMVEX///8zMzPiy6MSqIvv2asTfFT8Q0khISG3t7cApYb8Nj0AooMTeVAAd0zhyJ52xbOPzsD07eCGt6T+1tf+t7n8KDH8MTkqKioqKy4eHh7q0qj8UFX34LAmKCwoKCju16bs7Oz8XGEQEBAcICf9e378PUMWHCVRTUXx3bX+vsAXFxdoaGgShF/T09PMupQ+s5oSlXRpYlTm0q+f1chAQEDc8OtWuqSAdmL69u/F5t7R6+WyoYP8ChqWlpbCwsJKSkoAAACBgYGlpaVaWlptbW2Og2u0to96nnbJwJigroZekmvh4eEzhF1LjGSFy7rs9/Vnv6uOjo7AsI1jXFB6cV8ACBNoYVNXUUivy76UtZuYwbH369WjHblBAAAH8klEQVR4nO2aC1MTSRCA3QfCugh4emSzZmOOvQNBIWJCMEZBVHyhhJfKyf//H7ebzWP2MTNN3DC9uf6qrKJMhuqP7ume2eTWLYIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCILAyPrDvwIerquOY3I8WP4nYPmB6jgmx4M7twPukGGBmX7D9chwKjvN/Vd/BvQEA8Xw51f3VceUL/eXbydYJsOCQYbF539gePthSCQX/ThlhhHTPA8jZGeazZsMZiJIDDffvL3RcMamVtrjvCIxfF0tv5tUUHlyVJ494LwkuR82Na26X5tQWPmxWdY0jfPa+t89OJ3maCNYWdJqEwosL/ZWgjA3xmoZr6taqFg9yjumXNkM86BVX4+ztqlFlGo5B5UnR+UoyOY4a1cGhuOsviFq1X6QG2NU2tvBYq20n39oObFfGsR4MHdd9va1IdxmrJqD2WGMpdlrozFszKl2yWRvRcuNMsaGWivnJ4iz2zwpyQOHM4vviJpnjYaUa6qNkjTlQV+L0nvVRgnezsqDvh4ryG6LVXnIEY4DfGMJ101qDppC7/ACqjjOwWhyAIMOTqyu7gPfimonzkFnoddxK4VM4jvoLAxSaIKTON4lbCLUNoAx+2e6blYOPejfQ7XYEOiocM7dwNA0oYbjPSuYBPvyYHv4W3poWOkA67SE5RZVAx7YvEO3Z2hW1oB/Et4jrZsGOgybuh4ZmlursBVYuukBrJOung0Noc1mFslNGHbojmo0MoTWKZKhD5sVzlokGBmaC8A6VS3XYw90oPG2dNYQ2E9XaqrtQkCNxu+4MUOzcgHZijgm4ing5uQfDgQHhqa5BjifzvI+xrpRAA9ovIuh4MjQ1eSKOI6m8hON83MkODI0dXmdVk9V24XIBdd0PcuwsiXtNjjObbJtGBdkDAGKpSeq7UIkp1LvXOcZmpUFT7wXcTysERv6P1y+oVnRm+LNiOJjKKEhMyayDAO2RZWKI4eCI42jnSUFU4bB6YZfqTj2oSCB23pKMGUYVOoaN404jt68q4XXTCcwyzBMo8PZjTimRfaDNsdL7UCuoVlxd1czSxXHmSbrAux4FxkFyjUMR+OPrFLFcQVOP2lzVi+2OH48w9DxZzqPZRR3i+T90PN2+X58wyiPCUcc98Oj2B3fcw5FfiLD0PHCj/WcWdVyEaN96PhrHd7+gxiGo+NQGyUSxzgcXhAdz9k9cyV+MsPA0TzbHiSyiuTT/KjV+OfS9IEMe4nsRIcAHI2mvxE9kB7MMHCMLlZItmG0EX2gIMzQNENDLNsweha1OgHDMornUCHht0rzNjzzERVp7/DtAwWBhpWOh+TYHRF0U/8sX8NDD8nj4IhaWfM6+RruOjieYAw4rTqcy9K4hmuI+kxIbcPZztXQ9BB9T6HHQbWZa5Vu+WUUV8MRtbK/JbcDG1Y6PrIUBu30ewdWpjDDbWxfTQxonudoaPqIZuGAzTf5VWml8121ThansHkBMjxHNSmGvM/NcAFhjYbUQAc3UJGqVuFxbyEfw0c11SZcnudi+OhKtQcfSBIBOVStIQKQRHkK76m2EPFCnkSp4WPVEmKupIrSFL5Q7SBBWqcyQcRtJkJap8Wu0RBZP5UYqg4fgmQrFnsTRogVhYKoBwWDUHEaBMWKUyEoVCz6HhzA76g8v8fFEgzmos5x5AmqDngMnmcrZvrhP8lkci8zjdOSwIirhbTjFOzAGFepPKb8ijQjMrmX2I8JwWJuwATx6wbr5+oLhc9gj0zD6LtF02jouuz3pqbRMA4ZFgQyLD5kWHzIsPiQYTHZubz89UcfvqCu/zt406/Lyx3VQYPpNlrP7jJ84/q5H9n33bVPGl3VwQNo123LMJ7NzwyZ/8L5lob7+e4M87ZnhmXZrbZqAQltwzZ6PGUVP2Yquh8SgiGWXX+pWkJAt9X3CxWZ6O9+zlL8NJ8W7Dkuqvbg0g7rc8gMq/ghQ5F9w/xTZqVlIG06S7bBYscMPqUEv/IEw7Uod+NiXDAIk63CmYSi+419NSEYrG2o1kmTEow31JmvccEvbJeZSS1FqNhICyYU2bHofozl18pYayNrqS+zBLljMTEIs9dauKZ/ZowGZyy6H+blgobVUi3FcpxVZ5Ei69Ifi58yJn1WnSJqqF1OGkLY/dYfizMgwQDVXiMWuSkMii3m8yk5CEWCePqpKIWpsRgbhMlJn6Cu2mxAQ5DCpOLXL8JJn1iJZWLUxXHGx2IMyULrWLVahLhIRYqydVh6TVtcpCFPMxWlfxnDxjH1RZ10qJj24036mCGOkdiSRxofi/I5McDCMS8ggilFRtBKwBriuO4DitRIjkVGsL6YoDX6hdaJarkeMMP4PWM0CDOaCZNDHKdvmCCryB5l7PQzGcYQx6mGczcUKLJHGXEOcUyLW22o4mAssv8nyqGF5pkbXDE96fk5RPVQEVyoGZO+tZSgf4Kw6khKNGLHgHVUK32USY7D/kC0cbRRhhYsjTbkKGNguv2OyHyeOCZWHdEWHLFTz8nRspdUu/BoAHejGLuFMoF9luzfdcT9+WFA99j6DccCfAYc0F0yxkxk4Ic8f0Pares7WrZRiO8pDOg26vY1yjXQOy5K+kZ0GycWwNKybLu1hLl7CtlpLNYDg2xPK5QzThrFS16C7k67sdgKCjGO0Vpcar8s0s6T0+3uBLwM/nWnS4wgCIIgCIIgCIIgCIIgCIIgboT/AN9TCLiJhB5qAAAAAElFTkSuQmCC',
    'https://cdn2.iconfinder.com/data/icons/medicine-pt-12/100/123_-_pharmacy_clinic_hospital_drug_store_medical-512.png',
    'https://s3.envato.com/files/75038420/2.Transport%20icons.png',
    'https://www.shareicon.net/download/2015/11/22/675845_dentist.svg',
    // 'https://icon2.kisspng.com/20180702/wst/kisspng-occupational-therapist-physiotherapist-physical-th-physiotherapist-5b39a898598b62.8202718115305053683668.jpg'
]

  constructor(
    private mainServ:MainService
  ) {}

  ngOnInit(){
    
  }

  ionViewWillEnter(){
    this.mainServ.getProviders().pipe(retryWhen(_ => {
      return interval(10000)
    })).subscribe(res=>{
      console.log(res);
      this.serviceProviders=res
      for(let i=0;i<this.serviceProviders.length;i++){
        this.serviceProviders[i].icon=this.icons[i]
        this.serviceProviders[i].providerName=res[i].providerName.toLowerCase()
        .replace("-"," ").split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
      }
      console.log(this.serviceProviders)
    },
    err=>{
      console.log(err);
    })
  }
}
