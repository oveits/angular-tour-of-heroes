import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class MyHttpApiInterceptor implements HttpInterceptor {
    private authToken : string = "eyJhbGciOiJIUzI1NiIsImtpZCI6InNlY3JldCIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIzeUY1VE9TemRsSTQ1UTF4c3B4emVvR0JlOWZOeG05bSIsImVtYWlsIjoib2xpdmVyLnZlaXRzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE1MjYzMjE3MzQsImlhdCI6MTUyNTg4OTczNCwiaXNzIjoiaHR0cHM6Ly9kY29zLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNjI1MzMxNzc0ODE4NzQ5MDc3NCIsInVpZCI6Im9saXZlci52ZWl0c0BnbWFpbC5jb20ifQ.AXhgW8EHiQiyPff0JWr6Urzxy6Jj9MZ8euL-P3BXmok";

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const authToken = this.authToken; // TODO: const authToken = this.auth.getAuthorizationToken();
        const authReq = request.clone({
            headers: request.headers.set('Authorization', authToken)
          });

          request = request.clone({
            headers: request.headers.set('Authorization', 'token=' + authToken)
          });
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json')
          });
    
        return next.handle(request).pipe(map(event =>{
            if (event instanceof HttpResponse) {
                console.log("Response Interceptor");
                console.log(event);
                event = event.clone({ body: event.body['apps'].map(item => {
                    return {
                        name: item.id.replace(/^\//g, ''),
                        id: item.id,
                        instances: item.instances,
                        healthyness: item.tasksHealthy/item.instances
                    };
                })});
            }        
            return event;
        }))
  }

  createRequestBody(item){
      return {
        "id": "/" + item.name,
        "backoffFactor": 1.15,
        "backoffSeconds": 1,
        "container": {
          "portMappings": [
            {
              "containerPort": 80,
              "hostPort": 0,
              "labels": {
              },
              "protocol": "tcp",
              "servicePort": 80
            }
          ],
          "type": "DOCKER",
          "volumes": [],
          "docker": {
            "image": "nginxdemos/hello",
            "forcePullImage": false,
            "privileged": false,
            "parameters": []
          }
        },
        "cpus": 0.1,
        "disk": 0,
        "healthChecks": [
          {
            "gracePeriodSeconds": 15,
            "ignoreHttp1xx": false,
            "intervalSeconds": 3,
            "maxConsecutiveFailures": 2,
            "portIndex": 0,
            "timeoutSeconds": 2,
            "delaySeconds": 15,
            "protocol": "HTTP",
            "path": "/"
          }
        ],
        "instances": 1,
        "labels": {
          "HAPROXY_DEPLOYMENT_GROUP": "nginx-hostname",
          "HAPROXY_0_REDIRECT_TO_HTTPS": "false",
          "HAPROXY_GROUP": "external",
          "HAPROXY_DEPLOYMENT_ALT_PORT": "80",
          "HAPROXY_0_PATH": "/" + item.name,
          "HAPROXY_0_VHOST": "195.201.17.1"
        },
        "maxLaunchDelaySeconds": 3600,
        "mem": 100,
        "gpus": 0,
        "networks": [
          {
            "mode": "container/bridge"
          }
        ],
        "requirePorts": false,
        "upgradeStrategy": {
          "maximumOverCapacity": 1,
          "minimumHealthCapacity": 1
        },
        "killSelection": "YOUNGEST_FIRST",
        "unreachableStrategy": {
          "inactiveAfterSeconds": 0,
          "expungeAfterSeconds": 0
        },
        "fetch": [],
        "constraints": []
      };
  }
}