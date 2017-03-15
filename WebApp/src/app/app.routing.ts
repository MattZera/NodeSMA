import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ModuleWithProviders} from "@angular/core";
import {AnalysisComponent} from "./analysis/analysis.component";

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent},
  { path: 'analysis/:keyword', component: AnalysisComponent},
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
