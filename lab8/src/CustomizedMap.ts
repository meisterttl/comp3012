import { Pinnable } from "./interface";

class CustomizedMap {
  private googleMap: google.maps.Map;

  constructor(
    divId: string,
    options: {
      zoom: number;
      center: {
        lat: number;
        lng: number;
      };
    }
  ) {
    this.googleMap = new google.maps.Map(
      document.getElementById(`${divId}`)!,
      options
    );
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
