import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CollapseModule } from 'ng2-bootstrap/collapse'

import { routing } from "./app.routing";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AnalysisComponent } from './analysis/analysis.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnalysisComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    CollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
