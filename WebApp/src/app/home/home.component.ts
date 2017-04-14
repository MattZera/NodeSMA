import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {Observable} from "rxjs/Observable";
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private router: Router, private socket: SocketService) { }

  tweets: Observable<Array<any>>;

  ngOnInit() {
    this.tweets = this.socket.messages('tweet').take(3).toArray();
  }

  go(keyword: string){
    this.router.navigate(['/analysis', keyword]);
  }

}
