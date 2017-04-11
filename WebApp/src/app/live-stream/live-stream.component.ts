import {Component, OnInit, OnDestroy} from '@angular/core';
import {SocketService} from "../services/socket.service";
import {Observable, Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss']
})
export class LiveStreamComponent implements OnInit, OnDestroy{

  tweets: Observable<Array<any>>;

  constructor(private socket: SocketService) {
  }

  ngOnInit() {
    this.tweets = this.socket.messages('tweet')
      .sample(Observable.interval(2000))
      .scan((array: Array<any>,tweet: string)=>{
        array.unshift(tweet);
        if( array.length > 500) array.pop();
          return array
      }, []);
  }

  ngOnDestroy(){

  }

}
