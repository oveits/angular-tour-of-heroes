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

    getRestItem(id: number): Observable<RestItem> {
      return this.getRestItems().pipe(
        map(restItems => restItems.find(restItem => restItem.id === id))
      );
    }
  
    save(restItem: RestItem) {
      if (restItem.id) {
        return this.put(restItem);
      }
      return this.post(restItem);
    }
  
    delete(restItem: RestItem) { 
      const url = `${this.restItemsUrl}/${restItem.id}`; 
      return this.http.delete<RestItem>(url, this.httpOptions).pipe(catchError(this.handleError));
    }
  
    // Add new RestItem
    private post(restItem: RestItem) {
      var restRequest = {
        "id": restItem.id,
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
          "HAPROXY_0_PATH": restItem.id,
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
      return this.http
        .post<RestItem>(this.restItemsUrl, restRequest, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  
    // Update existing RestItem
    private put(restItem: RestItem) {
      const url = `${this.restItemsUrl}/${restItem.id}`;
      var restRequest = {
        "id": restItem.id,
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
          "HAPROXY_0_PATH": restItem.id,
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
      return this.http.put<RestItem>(url, restRequest, this.httpOptions).pipe(catchError(this.handleError));
    }

    private handleError(res: HttpErrorResponse | any) {
      console.error(res.error || res.body.error);
      return observableThrowError(res.error || 'Server error');
    }
}   
