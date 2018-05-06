import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
//import { Observable, observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RestItem } from './rest-item';


@Injectable()
export class RestItemService {
    private restItemsUrl : string = "http://94.130.187.229/service/marathon/v2/apps";
    private token : string = "eyJhbGciOiJIUzI1NiIsImtpZCI6InNlY3JldCIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIzeUY1VE9TemRsSTQ1UTF4c3B4emVvR0JlOWZOeG05bSIsImVtYWlsIjoib2xpdmVyLnZlaXRzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE1MjU4MDcxNjAsImlhdCI6MTUyNTM3NTE2MCwiaXNzIjoiaHR0cHM6Ly9kY29zLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNjI1MzMxNzc0ODE4NzQ5MDc3NCIsInVpZCI6Im9saXZlci52ZWl0c0BnbWFpbC5jb20ifQ.ghi5W7id3MvGj92rNlP9LsZtTd91RIcZXosl_zxVvjo";
    private httpOptions: {
      headers: HttpHeaders
    };

    constructor(private http: HttpClient) {
      this.httpOptions = {
        //observe: 'body',
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'token=' + this.token
        })
      };
    }

    getRestItems() {
      return this.http
        .get<RestItem[]>(this.restItemsUrl, this.httpOptions)
        .pipe(
          map(data => data['apps']), catchError(this.handleError)
        );
    }

    /*
    getRestItems<RestItem>(){
      return this.http
        .get<RestItem[]>(this.restItemsUrl + "/", this.httpOptions);
    }
    */

    private handleError(res: HttpErrorResponse | any) {
      console.error(res.error || res.body.error);
      return observableThrowError(res.error || 'Server error');
    }
}   
