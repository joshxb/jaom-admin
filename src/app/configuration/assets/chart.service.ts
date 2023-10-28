import { Injectable } from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';

@Injectable({
  providedIn: 'root',
})
export class ChartService {

  initializeChart(type: ChartType = ChartType.Area, option: string, ...dataPoints: any) {
    try {
      var chart;
      let xAxisTitle = "Date"; // Default x-axis title
      let yAxisTitle = ""; // Default y-axis title

      if (dataPoints.length > 0) {
        if (option === "server-info") {
          xAxisTitle = "Tables";
          yAxisTitle = "Data Size";
        }

        chart = new CanvasJS.Chart(type === ChartType.Area ? 'chartContainer' : 'serverChartContainer', {
          title: {
            text: option === "server-info" ? "Storage Engine" : "",
            fontSize: 18,
          },
          animationEnabled: true,
          axisX: {
            interval: type === ChartType.Area ? 4 : 1,
            intervalType: 'day',
            valueFormatString: 'M-DD-YY',
            title: xAxisTitle,
          },
          axisY: {
            title: yAxisTitle,
          },
          data: [
            {
              type: type,
              dataPoints: [...dataPoints],
            },
          ],
        });
      } else {
        const titlesMap: { [key: string]: string } = {
          'page-visit': 'No Page Visits Interaction',
          'transactions': 'No Donation Transactions Data',
          'server-info': 'No Server Info Data',
        };

        const title = titlesMap[option] || 'Default Title';

        chart = new CanvasJS.Chart(type === ChartType.Area ? 'chartContainer' : 'serverChartContainer', {
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

enum ChartType {
  Area = 'area',
  Bar = 'bar',
}

export default ChartType;
