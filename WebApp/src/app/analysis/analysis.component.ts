import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  keyword: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params)=> this.keyword = params["keyword"]);
  }

}
