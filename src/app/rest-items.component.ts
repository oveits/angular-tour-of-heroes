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
          console.log(this.restItems);
        }
          ,
        error => (this.error = error)
      )
  }

  /*
  addHero(): void {
    this.addingHero = true;
    this.selectedHero = null;
  }

  close(savedHero: Hero): void {
    this.addingHero = false;
    if (savedHero) {
      this.getHeroes();
    }
  }

  deleteHero(hero: Hero, event: any): void {
    event.stopPropagation();
    this.heroService.delete(hero).subscribe(res => {
      this.heroes = this.heroes.filter(h => h !== hero);
      if (this.selectedHero === hero) {
        this.selectedHero = null;
      }
    }, error => (this.error = error));
  }
*/
  ngOnInit(): void {
    this.getRestItems();
  }

  /*
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.addingHero = false;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
  */
}
