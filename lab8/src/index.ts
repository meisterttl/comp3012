import { faker } from "@faker-js/faker";
import CustomizedMap from "./CustomizedMap";
import Student from "./Student";
import Internship from "./Internship";

const student = new Student(
  faker.person.firstName("female"),
  faker.person.lastName("female"),
  49.2798596,
  -123.1133532
);

const fakeBusinessLocation = faker.location.nearbyGPSCoordinate({
  origin: [49.2837956, -123.1210429],
  radius: 5,
  isMetric: true,
});
const intership = new Internship(
  faker.company.name(),
  fakeBusinessLocation[0],
  fakeBusinessLocation[1]
);

function initMap(): void {
  const map = new CustomizedMap("map");
  map.addMarker(student);
  map.addMarker(intership);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

window.initMap = initMap;
export {};
