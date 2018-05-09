import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestItem } from './rest-item';
import { RestItemService } from './rest-item.service';

@Component({
  selector: 'my-rest-items',
  templateUrl: './rest-items.component.html',
  styleUrls: ['./rest-items.component.css']
})
export class RestItemsComponent implements OnInit {
  restItems: RestItem[];
  selectedRestItem: RestItem;
  addingRestItem = false;
  error: any;
  showNgFor = false;

  constructor(private router: Router, private restItemService: RestItemService) {}

  getRestItems(): void {
    this.restItemService
      .getRestItems()
      .subscribe(
        restItems => {
          this.restItems = restItems;
          for(let item of restItems){
            // remove leading slash:
            item.name = item.id.replace(/^\//g, '');
          }
          console.log(this.restItems);
        }
        ,
        error => (this.error = error)
      )
  }

  
  addRestItem(): void {
    this.addingRestItem = true;
    this.selectedRestItem = null;
  }

  close(savedRestItem: RestItem): void {
    this.addingRestItem = false;
    if (savedRestItem) {
      this.getRestItems();
    }
  }

  deleteRestItem(restItem: RestItem, event: any): void {
    event.stopPropagation();
    this.restItemService.delete(restItem).subscribe(res => {
      this.restItems = this.restItems.filter(h => h !== restItem);
      if (this.selectedRestItem === restItem) {
        this.selectedRestItem = null;
      }
    }, error => (this.error = error));
  }

  ngOnInit(): void {
    this.getRestItems();
  }

  
  onSelect(restItem: RestItem): void {
    this.selectedRestItem = restItem;
    this.addingRestItem = false;
  }

  gotoDetail(): void {
    this.router.navigate(['/services', this.selectedRestItem.id]);
  }
  /*
  */
}
