import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class DateService {
  getMonths() {
    const monthNames = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    return monthNames;
  }

  generateYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const yearRange = currentYear - startYear + 1;
    return Array.from({ length: yearRange }, (_, index) => startYear + index);
  }
}
