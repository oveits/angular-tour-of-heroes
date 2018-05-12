import { HttpClient, HttpErrorResponse, HttpInterceptor  } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RestItem } from './rest-item';

@Injectable()
export abstract class AbstractRestItemService<T> implements OnInit {
    private abstractUrl : string;

    constructor(private http: HttpClient) {}

    // seems to be ignored on abstract services:
    ngOnInit(){
      console.log("AbstractRestItemService ngOninit called");
    }

    setUrl(abstractUrl: string){
      this.abstractUrl = abstractUrl;
    }

    // Read all REST Items
    getAll() {
      return this.http  
        .get<RestItem[]>(this.abstractUrl)
        .pipe(map(data => data), catchError(this.handleError));
    }

    // Read REST Item
    get(id: string): Observable<RestItem> {
      return this.getAll().pipe(
        map(restItems => restItems.find(restItem => restItem.id === id))
      );
    }
  
    // Save REST Item, i.e. create it, if it does not exist or update it, if it exists
    save(restItem: RestItem) {
      if (restItem.id) {
        return this.put(restItem);
      }
      return this.post(restItem);
    }
  
    // Delete REST Item
    delete(restItem: RestItem) { 
      const abstractUrl = `${this.abstractUrl}/${restItem.id}`; 

      return this.http.delete<RestItem>(abstractUrl).pipe(catchError(this.handleError));;
    }
  
    // Add new REST Item
    protected post(restItem: RestItem) {
      return this.http
        .post<RestItem>(this.abstractUrl, restItem)
        .pipe(catchError(this.handleError));
    }
  
    // Update existing REST Item
    protected put(restItem: RestItem) {
      const abstractUrl = `${this.abstractUrl}/${restItem.id}`;

      return this.http.put<RestItem>(abstractUrl, restItem).pipe(catchError(this.handleError));
    }

    protected handleError(res: HttpErrorResponse | any) {
      console.error(res.error || res.body.error);
      return observableThrowError(res.error || 'Server error');
    }
}   
