import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {SocketService} from "../services/socket.service";
import {Observable} from "rxjs/Observable";



@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private socket: SocketService) { }

  keyword: string;
  tweets: Observable<Array<any>>;


  ngOnInit() {
    this.route.params.subscribe(
      (params: Params)=> {
        this.keyword = params["keyword"]

        this.tweets = this.socket.messages('tweet')
          .filter(tweet=>tweet.sma_keywords.indexOf(this.keyword) != -1)
          // .sample(Observable.interval(2000))
          .scan((array: Array<any>,tweet: string)=>{
            array.unshift(tweet);
            if( array.length > 500) array.pop();
            return array
          }, []);

        this.socket.messages('search_result').take(1).subscribe(data=> console.log(data));
        this.socket.send('search', this.keyword);
      }
    );

  }

}
