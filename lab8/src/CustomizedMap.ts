import { Pinnable } from "./interface";

class CustomizedMap {
  private googleMap: google.maps.Map;

  constructor(divId: string) {
    this.googleMap = new google.maps.Map(document.getElementById(`${divId}`)!, {
      zoom: 12,
      center: {
        lat: 49.2400687,
        lng: -123.0402417,
      },
    });
  }

  public addMarker(entity: Pinnable) {
    const marker = new google.maps.Marker({
      map: this.googleMap,
      position: entity.location(),
    });

    const infoWindow = new google.maps.InfoWindow({
      content: entity.message(),
    });

    marker.addListener("click", () => {
      infoWindow.open(this.googleMap, marker);
    });
  }
}

export default CustomizedMap;
