import {Component, OnInit} from '@angular/core';
import {ApiService} from "./api.service";
import {filter, mergeMap, tap} from "rxjs";
import {Friend, Location, Marker, Name} from "./friend";
import Animation = google.maps.Animation;
import MapTypeId = google.maps.MapTypeId;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  private readonly _mapTypeId : google.maps.MapTypeId
  private readonly _friends   : Array<Friend>
  private _haveMarker : boolean
  private _marker     : Marker

  private _center: google.maps.LatLngLiteral
  constructor(private apiService: ApiService) {
    this._friends     = new Array<Friend>()
    this._marker      = {} as Marker
    this._center      = {lat: 0, lng: 0} as google.maps.LatLngLiteral
    this._haveMarker  = false
    this._mapTypeId   = MapTypeId.SATELLITE
  }

  ngOnInit(): void {
    const compareNameOfFriends = (a: Friend, b: Friend)=> a.name.first.localeCompare(b.name.first);
    this.apiService
      .allFriends()
      .pipe(mergeMap( (friends: Array<Friend>) => friends))
      .pipe(filter((friend: Friend):boolean => !(friend.location===null)))
      .pipe(filter((friend: Friend):boolean => !(friend.location===undefined)))
      .pipe(filter((friend: Friend):boolean => !(friend.location.longitude===null)))
      .pipe(filter((friend: Friend):boolean => !(friend.location.latitude===null)))
      .pipe(filter((friend: Friend):boolean => !(friend.location.longitude===undefined)))
      .pipe(filter((friend: Friend):boolean => !(friend.location.latitude===undefined)))
      .pipe(tap((friend:Friend) => this._friends.push(friend)))
      .pipe(tap((_: Friend) => this._friends.sort(compareNameOfFriends)))
      .pipe(tap((_: Friend) => this.checkDetail(this._friends[0]._id)))
      .subscribe()
  }

  get friends(): Array<Friend>{
    return this._friends
  }

  public checkDetail(_id: string): void{
    const friends: Array<Friend> = this._friends.filter((friend: Friend): boolean => friend._id === _id)
    if (friends.length>0){
      const friend          : Friend    = friends[0]
      const { latitude, longitude }    : Location  = friend.location
      const { first, last } : Name      = friend.name

      console.log(`location: ${latitude}, ${longitude}`)

      this._center = {lat: latitude, lng: longitude}

      this._marker = {
        position: {latitude: latitude, longitude: longitude},
        label   : {
          color : 'red',
          text  : `${first}, ${last}`
        },
        title   : `${first}, ${last}`,
        info    : `${first}, ${last}`,
        options : {
          animation: Animation.BOUNCE
        }
      }

      this._haveMarker = true


    }
  }

  get center(): google.maps.LatLngLiteral{
    return this._center
  }

  get marker(): Marker{
    return this._marker
  }

  get haveMarker(): boolean{
    return this._haveMarker
  }

  get mapTypeId(): google.maps.MapTypeId{
    return this._mapTypeId;
  }
}
