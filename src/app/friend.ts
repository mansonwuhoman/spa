export interface Friend{
  _id       : string,
  name      : Name,
  email     : string,
  picture   : string,
  location  : Location
}

export interface Name{
  last  : string,
  first : string
}

export interface Location{
  latitude : number,
  longitude : number
}

export interface Marker{
  position: Location,
  label   : {
    color : string,
    text  : string
  },
  info    : string
  title   : string,
  options : {
    animation : google.maps.Animation
  }
}
