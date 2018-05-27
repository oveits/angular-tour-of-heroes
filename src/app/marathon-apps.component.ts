import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { MarathonApp } from './marathon-app';
import { MarathonAppService } from './marathon-app.service';
import { RestItem } from './rest-item';

@Component({
  selector: 'marathon-apps',
  templateUrl: './marathon-apps.component.html',
  styleUrls: ['./marathon-apps.component.css']
})
export class MarathonAppsComponent implements OnInit {
  marathonApps: MarathonApp[];
  selectedMarathonApp: MarathonApp;
  addingMarathonApp = false;
  error: any;
  showNgFor = false;
  exposedUrl: String = '/marathonapps';
  project: String = null;

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
    }, error => (this.error = error));
  }

  ngOnInit(): void {
    // not needed, sind the Url is set in the Service, and is not part of the MarathonApp class:
    //this.marathonAppService.setUrl((new MarathonApp).url);
    this.route.params.forEach((params: Params) => {
      if (params['project'] !== undefined) {
        this.project = params['project'];
        this.getMarathonApps(this.project);
      } else {
        this.getMarathonApps();
      }
    });
    
  }
  
  onSelect(marathonApp: MarathonApp): void {
    this.selectedMarathonApp = marathonApp;
    this.addingMarathonApp = false;
  }

  gotoDetail(): void {
    this.router.navigate([this.exposedUrl, this.selectedMarathonApp.id]);
  }
}
