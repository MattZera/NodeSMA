import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs/Rx";
import {SocketService} from "../services/socket.service";


@Component({
  selector: 'app-la-times',
  templateUrl: './la-times.component.html',
  styleUrls: ['./la-times.component.scss']
})
export class LaTimesComponent implements OnInit, OnDestroy {

  timesData: Array<any>;
  subscription: Subscription;

  barChartData: any;
  barChartLabels: Array<any>;
  chartType: any;
  barChartOptions: any;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.chartType = 'bar';
    this.barChartOptions = {
      scaleBeginAtZero: false,
      responsive: false,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Sentimental Polarity of News'
      }
    };


    this.subscription = this.socket.messages('times_data').subscribe(tdata=>{
      let labels: Array<any> = [];
      let dataSet: Array<any> = [];

      for (let data of tdata ){
        labels.push(data.date);
        dataSet.push(data.polarity);
      }

      this.barChartLabels = labels;
      this.barChartData = {data:dataSet};

      this.timesData=tdata;
    });
    this.socket.send('get_times');
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
