import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RestItem } from './rest-item';
import { RestItemService } from './rest-item.service';

@Component({
  selector: 'my-rest-item-detail',
  templateUrl: './rest-item-detail.component.html',
  styleUrls: ['./rest-item-detail.component.css']
})
export class RestItemDetailComponent implements OnInit {
  @Input() restItem: RestItem;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private restItemService: RestItemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = +params['id'];
        this.navigated = true;
        this.restItemService.getRestItem(id).subscribe(restItem => (this.restItem = restItem));
      } else {
        this.navigated = false;
        this.restItem = new RestItem();
      }
    });
  }

  save(): void {
    this.restItemService.save(this.restItem).subscribe(restItem => {
      this.restItem = restItem; // saved restItem, w/ id if new
      this.goBack(restItem);
    }, error => (this.error = error)); // TODO: Display error message
  }

  goBack(savedRestItem: RestItem = null): void {
    this.close.emit(savedRestItem);
    if (this.navigated) {
      window.history.back();
    }
  }
}
