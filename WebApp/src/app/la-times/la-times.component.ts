import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs/Rx";
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'app-la-times',
  templateUrl: './la-times.component.html',
  styleUrls: ['./la-times.component.scss']
})
export class LaTimesComponent implements OnInit, OnDestroy {

  timesData: any;
  subscription: Subscription;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.subscription = this.socket.messages('times_data').subscribe(data=>{
      console.log(data[0]);
      this.timesData=data[0];
    });
    this.socket.send('get_times');
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
