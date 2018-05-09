import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
//import 'rxjs/add/operator/do';
import { map } from 'rxjs/operators';

/*  noop interceptor */
/*
@Injectable()
export class MyHttpApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request);
  }
}
*/

/*
@Injectable()
export class MyHttpApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
        .handle(request)
        .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
            console.log('processing response', ev);
        }
        });
  }
}
*/

/*
problem with "do"
export class MyHttpApiInterceptor implements HttpInterceptor {  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
  
        console.log("Before sending data")  
        console.log(req);  
        return next.handle(req)  
            //.retry(3)  
            .do(resp => {  
                if (resp instanceof HttpResponse) {  
                   console.log('Response is ::');  
                    console.log(resp.body)  
                }  
                return resp;  
            }).catch(err => {  
                console.log(err);  
                if (err instanceof HttpResponse)  
 {  
                    console.log(err.status);  
                    console.log(err.body);  
                }  
  
                return Observable.of(err);  
            });  
  
    }  
}  
*/

// trying with answer https://stackoverflow.com/questions/45566944/angular-4-3-httpclient-intercept-response
// intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req).map(event => {
//         if (event instanceof HttpResponse && shouldBeIntercepted(event)) {
//             event = event.clone({ body: resolveReferences(event.body) })
//         }         
//         return event;
//     });
// }

// here, I had the error "ERROR in src/app/my-http-api.interceptor.ts(91,33): error TS2339: Property 'map' does not exist on type 'Observable<HttpEvent<any>>'."
// I have resolved it with a hint found on 

@Injectable()
export class MyHttpApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    return next.handle(request).pipe(map(event =>{
        if (event instanceof HttpResponse) {
            console.log("Response");
            console.log(event);
            console.log(event.body);
            event = event.clone({ body: event.body['apps'].map(item => {
                return {
                    name: item.id.replace(/^\//g, ''),
                    id: item.id,
                    instances: item.instances,
                    healthyness: item.tasksHealthy/item.instances
                };
            }) });
        }         
        return event;
    }))
  }
}