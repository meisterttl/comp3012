import { Pinnable } from "./interface";

class Internship implements Pinnable {
  name: string;
  latitude: number;
  longitude: number;

  constructor(name: string, latitude: number, longitude: number) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public message() {
    return `Welcome to ${this.name}'s Internship!`;
  }

  public location() {
    return {
      lat: this.latitude,
      lng: this.longitude,
    };
  }
}

export default Internship;
