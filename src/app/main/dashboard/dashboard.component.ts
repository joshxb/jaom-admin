import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { Base, Redirects } from 'src/app/configuration/configuration.component';
import { AdminService } from 'src/app/configuration/services/admin.service';
import { AuthService } from 'src/app/configuration/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  imageUrls = new imageUrls();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private adminService: AdminService
  ) {}
  base = new Base();
  private baseUrl = this.base.baseUrl;
  public data: any;

  ngOnInit(): void {
   
  }

  ngAfterViewInit() {
    const scb = this.elementRef.nativeElement.querySelector(
      '#sidebarCollapseBtn'
    );
    this.renderer.listen(scb, 'click', () => {
      const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');
      if (sidebar) {
        if (sidebar.classList.contains('active')) {
          this.renderer.removeClass(sidebar, 'active');
        } else {
          this.renderer.addClass(sidebar, 'active');
        }
      }
    });
  }

  chartOptions = {
    title: {
      text: '',
    },
    animationEnabled: true,
    axisX: {
      interval: 10,
      intervalType: 'day',
      valueFormatString: 'D MMM',
      labelFontColor: 'rgb(0,75,141)',
      minimum: new Date(2012, 6, 10),
    },
    axisY: {
      title: '',
      interlacedColor: '#EBF2FA',
      tickColor: 'azure',
      titleFontColor: '#4f81bc',
      valueFormatString: '#M,,.',
    },
    data: [
      {
        name: 'views',
        type: 'area',
        markerSize: 8,
        dataPoints: [
          {
            x: new Date(2012, 6, 15),
            y: 0,
            indexLabel: 'Initial',
            indexLabelFontColor: 'orangered',
            markerColor: 'orangered',
          },
          { x: new Date(2012, 6, 18), y: 2000000 },
          { x: new Date(2012, 6, 23), y: 6000000 },
          { x: new Date(2012, 7, 1), y: 10000000, indexLabel: '10M' },
          { x: new Date(2012, 7, 11), y: 21000000 },
          { x: new Date(2012, 7, 23), y: 50000000 },
          { x: new Date(2012, 7, 31), y: 75000000 },
          { x: new Date(2012, 8, 4), y: 100000000, indexLabel: '100M' },
          { x: new Date(2012, 8, 10), y: 125000000 },
          { x: new Date(2012, 8, 13), y: 150000000 },
          { x: new Date(2012, 8, 16), y: 175000000 },
          { x: new Date(2012, 8, 18), y: 200000000, indexLabel: '200M' },
          { x: new Date(2012, 8, 21), y: 225000000 },
          { x: new Date(2012, 8, 24), y: 250000000 },
          { x: new Date(2012, 8, 26), y: 275000000 },
          { x: new Date(2012, 8, 28), y: 302000000, indexLabel: '300M' },
        ],
      },
    ],
  };
}
