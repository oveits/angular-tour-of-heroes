import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { MarathonApp } from './marathon-app';
import { MarathonAppService } from './marathon-app.service';
import { RestItem } from './rest-item';
import { interval } from "rxjs";
import { timer } from "rxjs";
// import { map } from "rxjs/operators";
// import { Observable } from "rxjs";
import { Subscription } from "rxjs";

@Component({
  selector: 'marathon-apps',
  templateUrl: './marathon-apps.component.html',
  styleUrls: ['./marathon-apps.component.css']
})
export class MarathonAppsComponent implements OnInit, OnDestroy {
  marathonApps: MarathonApp[];
  selectedMarathonApp: MarathonApp;
  addingMarathonApp = false;
  error: any;
  showNgFor = false;
  exposedUrl: String = '/marathonapps';
  project: String = null;
  msecMin: number = 1000;
  msecMax: number = 30000;
  backoffFactor = 1.5;
  // msec: number = 5000;
  // private nextRefreshSub : Subscription;
  private allSubscriptions : Subscription[] = new Array<Subscription>();
  private intervalRefreshSub : Subscription;


  constructor(private router: Router, 
    private marathonAppService: MarathonAppService,
    private route: ActivatedRoute) {}

  getMarathonApps(myProject: String = null): void {
    this.marathonAppService
      .getAll()
      .subscribe(
        marathonApps => {
          this.marathonApps = marathonApps as MarathonApp[];
          if(myProject) {
            this.project = myProject;
            this.marathonApps = this.marathonApps.filter(app => app.project === myProject)
          }
          console.log(this.marathonApps);
        }
        ,
        error => {
          console.log(error);
          this.error = error;
        }
      )
  }
  
  addMarathonApp(): void {
    this.addingMarathonApp = true;
    this.selectedMarathonApp = null;
    this.refresh(this.msecMin);
  }

  close(savedMarathonApp: MarathonApp): void {
    this.addingMarathonApp = false;
    if (savedMarathonApp) {
      this.getMarathonApps(this.project);
    }
  }

  deleteMarathonApp(marathonApp: MarathonApp, event: any): void {
    event.stopPropagation();
    this.marathonAppService.delete(marathonApp).subscribe(res => {
      this.marathonApps = this.marathonApps.filter(h => h !== marathonApp);
      if (this.selectedMarathonApp === marathonApp) {
        this.selectedMarathonApp = null;
      }

      // not really needed:
      //this.refresh(this.msecMin);
    }, error => (this.error = error));
  }

  ngOnInit(): void {

    this.route.params.forEach((params: Params) => {
      if (params['project'] !== undefined) {
        this.project = params['project'];
        this.getMarathonApps(this.project);
      } else {
        this.getMarathonApps();
      }
    });  

    // const myNumbers = Observable.interval(1000);
    // myNumbers.subscribe((number:Number) => {
    //   console.log(number);
    // });

    // // works fine:
    // const secondsCounter = interval(1000);
    // // Subscribe to begin publishing values
    // secondsCounter.subscribe(n =>
    // console.log(`It's been ${n} seconds since subscribing!`));

    // works fine; implements static interval:
/*
     this.intervalRefreshSub = interval(this.msec)
      .subscribe(res => {
        this.getMarathonApps(this.project);
      }); 
*/

    // // is not called, because subscribe is missing?
    // interval(1000).pipe(
    //   map((x) => { // your code 
    //     console.log(x);
    //   })
    // );

    // playing around with backoff via timer (seems to create more than one parallel timer)
    // this.nextRefreshSub = this.refresh(this.msecMin);
    this.refresh(this.msecMin);
  }

 
    // does not work correctly (creates more than one parallel timer):
    refresh(msec) : void {
      // cancel old refresh timers:
      this.allSubscriptions.map(sub => sub.unsubscribe());
      // garbage collection: only active subscriptions are kept:
      this.allSubscriptions = this.allSubscriptions.filter((sub) => {sub.closed === false});

      this.allSubscriptions.push( 
        timer(msec)
          .subscribe(res => {
            this.getMarathonApps(this.project);
            console.log(`refreshing msec = ${msec}`);

            let msecNew = msec
            if( ! this.addingMarathonApp ) {
              msecNew = msec * this.backoffFactor;
            }
            
            if(msecNew > this.msecMax) {
              msecNew = this.msecMax;
            }

            console.log(`msecNew = ${msecNew}`);
    
            this.refresh(msecNew);
          }));
  } 
 


  ngOnDestroy(){
    // if(typeof(this.intervalRefreshSub) !== undefined) {
    //   this.intervalRefreshSub.unsubscribe();
    // }
    // cancel old refresh timers:
    this.allSubscriptions.map(sub => sub.unsubscribe());
    // garbage collection: only active subscriptions are kept:
    this.allSubscriptions = this.allSubscriptions.filter((sub) => {sub.closed === false});
  }

  onSelect(marathonApp: MarathonApp): void {
    this.selectedMarathonApp = marathonApp;
    this.addingMarathonApp = false;
    this.router.navigate([this.exposedUrl, this.selectedMarathonApp.id]);
  }

  gotoDetail(): void {
    this.router.navigate([this.exposedUrl, this.selectedMarathonApp.id]);
  }
}
