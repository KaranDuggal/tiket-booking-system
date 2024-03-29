import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dataStore: DATASTORE = {
    seatChart: [
      { row: 1, booked: 0, max: 7, start: 1, booked_seats: [] },
      { row: 2, booked: 0, max: 7, start: 8, booked_seats: [] },
      { row: 3, booked: 0, max: 7, start: 15, booked_seats: [] },
      { row: 4, booked: 0, max: 7, start: 22, booked_seats: [] },
      { row: 5, booked: 0, max: 7, start: 29, booked_seats: [] },
      { row: 6, booked: 0, max: 7, start: 36, booked_seats: [] },
      { row: 7, booked: 0, max: 7, start: 43, booked_seats: [] },
      { row: 8, booked: 0, max: 7, start: 50, booked_seats: [] },
      { row: 9, booked: 0, max: 7, start: 57, booked_seats: [] },
      { row: 10, booked: 0, max: 7, start: 64, booked_seats: [] },
      { row: 11, booked: 0, max: 7, start: 71, booked_seats: [] },
      { row: 12, booked: 0, max: 3, start: 78, booked_seats: [] }
    ],
    total: 80,
    booked: 0,
    rem: 80
  };
  private _data = new BehaviorSubject<DATASTORE>(this.dataStore);

  constructor() { }

  get data() {
    return this._data.asObservable();
  }
  bookSeats(seatsToBook:number) {
    let rem = seatsToBook;
    let bookedSeats = [];
    main: for (let row of this.dataStore.seatChart) {
      if (rem === 0) break main;
      const rowBookings = Math.min(row.max - row.booked, rem);
      rem -= rowBookings;
      row.booked += rowBookings;
      const bs = row.booked_seats;
      let count = 0;
      inner: for (let i = row.start; i <= row.start + row.max; i++) {
        if (count === rowBookings) break inner;
        const alreadyBooked = bs.some(n => n === i);
        if (!alreadyBooked) {
          count++;
          bs.push(i);
          bookedSeats.push(i);
        }
      }
    }
    this.dataStore.booked += seatsToBook;
    this.dataStore.rem -= seatsToBook;
    return {bookedSeats:bookedSeats, rem:this.dataStore.rem};
  }
}

type SEAT_ROW = {
  row: number;
  booked: number;
  max: number;
  start: number;
  booked_seats: number[];
};

type DATASTORE = {
  seatChart: SEAT_ROW[];
  total: number;
  booked: number;
  rem: number;
};
