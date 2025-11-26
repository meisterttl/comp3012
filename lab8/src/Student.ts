import { Pinnable } from "./interface";

class Student implements Pinnable {
  firstName: string;
  lastName: string;
  latitude: number;
  longitude: number;

  constructor(
    firstName: string,
    lastName: string,
    latitude: number,
    longitude: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public message() {
    return `${this.firstName} ${this.lastName}`;
  }

  public location() {
    return {
      lat: this.latitude,
      lng: this.longitude,
    };
  }
}

export default Student;
