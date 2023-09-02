import { Injectable } from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';

@Injectable({
  providedIn: 'root',
})
export class ChartService {

  initializeChart(option: string, ...dataPoints: any) {
    try {
      var chart;

      if (dataPoints.length > 0) {
        chart = new CanvasJS.Chart('chartContainer', {
          title: {
            text: '',
          },
          animationEnabled: true,
          axisX: {
            interval: 4,
            intervalType: 'day',
            valueFormatString: 'M-DD-YY', // Format for x-axis labels
          },
          data: [
            {
              type: 'area',
              dataPoints: [...dataPoints],
            },
          ],
        });
      } else {
        const titlesMap: { [key: string]: string } = {
          'page-visit': 'No Page Visits Interaction',
          transactions: 'No Donation Transactions Data',
        };

        const title = titlesMap[option] || 'Default Title';

        chart = new CanvasJS.Chart('chartContainer', {
          title: {
            text: title,
            fontSize: 18,
            horizontalAlign: 'center',
          },
        });
      }

      chart.render();
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }
}
