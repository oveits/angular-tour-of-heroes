import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { MarathonInterceptor } from './marathon.interceptor';
import { MarathonAppInterceptor } from './marathon-app.interceptor';
import { ProjectInterceptor } from './project.interceptor';


import { HttpClientInMemoryWebApiModule, InMemoryDbService } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeroService } from './hero.service';
import { DashboardComponent } from './dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroSearchComponent } from './hero-search.component';

// import { RestItemService } from './rest-item.service';
// import { RestItemsComponent } from './rest-items.component';
// import { RestItemDetailComponent } from './rest-item-detail.component';

import { MarathonAppService } from './marathon-app.service';
import { MarathonAppsComponent } from './marathon-apps.component';
import { MarathonAppDetailComponent } from './marathon-app-detail.component';
import { MarathonAppInputComponent } from './marathon-app-input.component';

import { ProjectService } from './project.service';
import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectInputComponent } from './project-input.component';

// import { marathonFakeProvider } from './marathon-fake.interceptor';
import { MarathonFakeInterceptor } from './marathon-fake.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      delay: 300,
      passThruUnknownUrl: true
    })
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroSearchComponent,
    HeroesComponent,
    HeroDetailComponent,
    // RestItemsComponent,
    // RestItemDetailComponent,
    MarathonAppsComponent,
    MarathonAppDetailComponent,
    MarathonAppInputComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    ProjectInputComponent,
  ],
  providers: [
    HeroService,
    // RestItemService,
    MarathonAppService,
    ProjectService,
    { provide: HTTP_INTERCEPTORS, useClass: MarathonInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MarathonAppInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ProjectInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MarathonFakeInterceptor, multi: true },
    // marathonFakeProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
