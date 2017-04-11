import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CollapseModule } from 'ng2-bootstrap/collapse'

import { routing } from "./app.routing";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { SocketService } from "./services/socket.service";
import { LiveStreamComponent } from './live-stream/live-stream.component';
import { LaTimesComponent } from './la-times/la-times.component';
import { ChartsModule } from "ng2-charts/index";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnalysisComponent,
    LiveStreamComponent,
    LaTimesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    CollapseModule,
    ChartsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
