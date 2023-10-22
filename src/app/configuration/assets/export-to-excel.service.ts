import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExportToExcelService {

  constructor() { }

  exportToExcel(dom: any, data: any[], name : string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(dom);

    const maxCols = Math.max(...data.map((row) => Object.keys(row).length));
    const maxRows = data.length;

    ws['!ref'] = XLSX.utils.encode_range({
      s: { c: 0, r: 0 }, // Start at A1
      e: { c: maxCols - 1, r: maxRows }, // End at the last cell of data
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const dataAsArray = data.map((item) => Object.values(item));

    const dataSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataAsArray);
    XLSX.utils.book_append_sheet(wb, dataSheet, 'DataSheet');

    XLSX.writeFile(wb, `${name}.xlsx`);
  }
}
