import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';

// import { RestItemsComponent } from './rest-items.component';
// import { RestItemDetailComponent } from './rest-item-detail.component';

import { MarathonAppsComponent } from './marathon-apps.component';
import { MarathonAppDetailComponent } from './marathon-app-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'marathonapps/:id', component: MarathonAppDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'marathonapps', component: MarathonAppsComponent },
  // { path: 'services', component: RestItemsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
