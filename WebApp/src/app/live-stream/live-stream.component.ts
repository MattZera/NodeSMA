import { Component, OnInit } from '@angular/core';
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss']
})
export class LiveStreamComponent implements OnInit {

  constructor(private socket: SocketService) {

  }

  ngOnInit() {
    this.socket.messages("connect").subscribe((data)=>console.log("On connect message fired"));
    this.socket.messages("error").subscribe((data)=>console.log(data));
  }

}
