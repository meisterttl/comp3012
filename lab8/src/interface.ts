export interface Pinnable {
  location: () => {
    lat: number;
    lng: number;
  };
  message: () => string;
}
