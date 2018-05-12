import { HttpClient, HttpErrorResponse, HttpInterceptor  } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MarathonApp } from './marathon-app';
import { AbstractRestItemService } from './abstract-rest-item.service';

@Injectable()
export class MarathonAppService extends AbstractRestItemService<MarathonApp> implements OnInit {

    // OV: leads to:
    // Can't resolve all parameters for MarathonAppService
    // constructor(http) {
    //   super(http);
    //   console.log("MarathonAppService constructor called")
    // }

    private url = 'http://94.130.187.229/service/marathon/v2/apps';

    constructor(http: HttpClient){
      super(http);
      this.setUrl(this.url);
    }


    // seems to be ignored:
    // ngOnInit(){
    //   super.setUrl(this.myUrl);
    // }

    // not needed, iv I only return super.getRestItems(); this is default
    // getRestItems(){
    //   //super.url = 'http://94.130.187.229/service/marathon/v2/apps';
    //   //this.setUrl('http://94.130.187.229/service/marathon/v2/apps');
    //   return super.getRestItems();
    // }

    // for "renaming" getRestItems to getMarathonApps:
    getMarathonApps(){
      return super.getRestItems();
    }

    getMarathonApp(id){
      return super.getRestItem(id);
    }

    // getRestItems() {
    //   super();
      // return this.http  
      //   .get<MarathonApp[]>(this.url)
      //   .pipe(map(data => data), catchError(this.handleError));
    // }


}   
