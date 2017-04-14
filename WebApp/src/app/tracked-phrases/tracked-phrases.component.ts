import {AfterContentChecked, AfterContentInit, Component, OnInit} from '@angular/core';
import {SocketService} from "../services/socket.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-tracked-phrases',
  templateUrl: './tracked-phrases.component.html',
  styleUrls: ['./tracked-phrases.component.scss']
})
export class TrackedPhrasesComponent implements OnInit, AfterContentChecked {

  trackedPhrases: Observable<Array<any>>;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.trackedPhrases = this.socket.messages('tracked_phrases').take(1);
  }

  ngAfterContentChecked(){
    this.socket.send('get_tracked_phrases');
  }

}
