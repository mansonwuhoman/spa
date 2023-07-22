import {Component, OnInit} from '@angular/core';
import { ApiService } from "./api.service";
import { mergeMap} from "rxjs";
import { Friend } from "./friend";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  private readonly _friends: Array<Friend>
  constructor(private apiService: ApiService) {
    this._friends = new Array<Friend>()
  }

  ngOnInit(): void {
    this.apiService
      .allFriends()
      .pipe(mergeMap((friends: Array<Friend>) => friends))
      .subscribe((friend:Friend) => this._friends.push(friend));
  }

  get friends(): Array<Friend>{
    return this._friends;
  }



}
