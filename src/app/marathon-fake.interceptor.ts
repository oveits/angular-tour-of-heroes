import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { timer } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class MarathonFakeInterceptor implements HttpInterceptor {

    constructor() { }

    private msec = 5000;

    setHealthyAfterDelay(id, msec){

        return timer(msec, id)
            .pipe(map((x) => {
            console.log(x);
            this.setHealthy(id);        
            })).subscribe();
    }
    setHealthy(id){
        let apps: any[] = JSON.parse(localStorage.getItem('apps')) || [];
        for (let i = 0; i < apps.length; i++) {
            let app = apps[i];
            if (app.id === id) {
                // delete app
                if( !id.includes("broken")){
                    app.tasksHealthy = app.instances;
                    apps[i] = app;
                    localStorage.setItem('apps', JSON.stringify(apps));
                }    
                break;
            }
        }
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let apps: any[] = JSON.parse(localStorage.getItem('apps')) || [];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/apps/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = apps.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let apps = filteredUsers[0];
                    let body = {
                        id: apps.id,
                        username: apps.username,
                        firstName: apps.firstName,
                        lastName: apps.lastName,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/apps') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                // if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: { "apps": apps } }));
                // } else {
                //     // return 401 not authorised if token is null or invalid
                //     return throwError({ error: { message: 'Unauthorised' } });
                // }
            }

            // get app by id
            if (request.url.match(/\/apps\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = apps.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ error: { message: 'Unauthorised' } });
                }
            }

            // register app
            if (request.url.endsWith('/apps') && request.method === 'POST') {
                // get new user object from post body
                let newApp = request.body;
                newApp.tasksHealthy=0;


                // validation
                let duplicateApp = apps.filter(app => { return app.id === newApp.id; }).length;
                if (duplicateApp) {
                    return throwError({ error: { message: 'App "' + newApp.id + '" is already taken' } });
                }


                // save new app
                //newApp.id = apps.length + 1;
                let pointer = apps.push(newApp);
                localStorage.setItem('apps', JSON.stringify(apps));

                this.setHealthyAfterDelay(newApp.id, this.msec);

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/apps\//) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                // if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/apps/');
                    // let id = parseInt(urlParts[urlParts.length - 1]);
                    let id = urlParts[urlParts.length - 1];
                    for (let i = 0; i < apps.length; i++) {
                        let app = apps[i];
                        if (app.id === id) {
                            // delete app
                            apps.splice(i, 1);
                            localStorage.setItem('apps', JSON.stringify(apps));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                // } else {
                //     // return 401 not authorised if token is null or invalid
                //     return throwError({ error: { message: 'Unauthorised' } });
                // }
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let marathonFakeProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MarathonFakeInterceptor,
    multi: true
};
