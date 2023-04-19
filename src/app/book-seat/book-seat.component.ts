import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DbService } from './db/db.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-book-seat',
  templateUrl: './book-seat.component.html',
  styleUrls: ['./book-seat.component.scss']
})
export class BookSeatComponent {
  bookingForm!: FormGroup;
  public data$!: Observable<any>;
  public sevenSeater = [1, 2, 3, 4, 5, 6, 7];
  public threeSeater = [1, 2, 3];
  public message = "";
  total: number = 0;
  booked: number = 0;
  rem: number = 0;
  bookings :any = [];

  constructor(
    private _fb: FormBuilder, private dbSrv: DbService
  ){
    this.createForm();
    this.data$ = this.dbSrv.data.pipe(tap(d => (this.rem = d.rem)));
  }
  createForm() {
    this.bookingForm = this._fb.group({
      seatsToBook: new FormControl<number|null>(null),
      userName: new FormControl<string|null>(null),
    });
  }

  getSeatNum(n: number, row: number): number {
    return (row - 1) * 7 + n;
  }

  checkBook(n: number, row: number, bs: number[]): boolean {
    const seat = this.getSeatNum(n, row);
    return bs.some(bs => bs === seat);
  }

  book() {
    let { seatsToBook, userName} = this.bookingForm.value;
    if (this.rem < seatsToBook) {
      alert(this.rem == 0 ? 'Coach full' :`Only ${this.rem} seats available, reduce num of seats`)
      return;
    }
    const {bookedSeats, rem} = this.dbSrv.bookSeats(seatsToBook);
    this.rem = rem;
    this.bookings.unshift({
      userName:userName,
      time: Date.now(),
      seats: bookedSeats
    });
    this.bookingForm.reset();
  }
}
