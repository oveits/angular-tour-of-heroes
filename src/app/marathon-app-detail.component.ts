import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MarathonApp } from './marathon-app';
import { MarathonAppService } from './marathon-app.service';

@Component({
  selector: 'my-marathon-app-detail',
  templateUrl: './marathon-app-detail.component.html',
  styleUrls: ['./marathon-app-detail.component.css']
})
export class MarathonAppDetailComponent implements OnInit {
  @Input() marathonApp: MarathonApp;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private marathonAppService: MarathonAppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = params['id'];
        this.navigated = true;
        this.marathonAppService.get(id).subscribe(restItem => {
          this.marathonApp = this.marathonApp;
//          this.marathonApp.name = marathonApp.id;
        });
      } else {
        this.navigated = false;
        this.marathonApp = new MarathonApp();
      }
    });
  }

  save(): void {
    this.marathonAppService.save(this.marathonApp).subscribe(marathonApp => {
      this.marathonApp = marathonApp; // saved marathonApp, w/ id if new
      this.goBack(marathonApp);
    }, error => (this.error = error)); // TODO: Display error message
  }

  goBack(savedMarathonApp: MarathonApp = null): void {
    this.close.emit(savedMarathonApp);
    if (this.navigated) {
      window.history.back();
    }
  }
}
