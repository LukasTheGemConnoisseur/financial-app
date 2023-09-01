import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { response } from 'express';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stocksData: any; // Declare a property to hold the API data
  public chart: any; // Stores chart data
  stocksDataChart: any; // Stores stock chart API data
  stocksDataChartPrices: any; // Stores stock chart prices
  stocksDataChartPricesRounded: any; // Stores rounded stock chart prices
  stocksDataChartTimes: any; // Stores stock chart times
  stocksDataChartTimesConverted: any; // Stores converted stock chart times

  ngOnInit(): void {
    this.realTimeData();

    this.realTimeDataChart();
  }
  ngAfterViewInit(): void {
    this.createChart();
  }

  realTimeData(): void {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary',
      params: {
        symbol: 'TSLA',
        region: 'US',
      },
      headers: {
        'X-RapidAPI-Key': '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };

    axios
      .request(options)
      .then((response) => {
        this.stocksData = response.data; // Store the API data in the component property
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  realTimeDataChart(): void {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
      params: {
        interval: '1d',
        symbol: 'TSLA',
        range: '6mo',
        region: 'US',
        includePrePost: 'false',
        useYfid: 'true',
        includeAdjustedClose: 'true',
        events: 'capitalGain,div,split',
      },
      headers: {
        'X-RapidAPI-Key': '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };

    axios
      .request(options)
      .then((response) => {
        this.stocksDataChart = response.data;
        console.log(response.data);

        this.stocksDataChartPrices =
          this.stocksDataChart.chart.result[0].indicators.adjclose[0].adjclose;
        this.stocksDataChartPricesRounded = this.stocksDataChartPrices.map(
          (price: number) => price.toFixed(2)
        );
        console.log(this.stocksDataChartPricesRounded);

        this.stocksDataChartTimes =
          this.stocksDataChart.chart.result[0].timestamp;
        console.log(this.stocksDataChartTimes);
        this.stocksDataChartTimesConverted = this.stocksDataChartTimes.map(
          (timeDate: number) =>
            new Date(timeDate * 1000).toLocaleDateString('en-US')
        );
        console.log(this.stocksDataChartTimesConverted);
        this.createChart();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // Destroys the existing chart if it exists
    }

    this.chart = new Chart('MyChart', {
      type: 'line', //this denotes the type of chart

      data: {
        // values on X-Axis
        labels: this.stocksDataChartTimesConverted,
        datasets: [
          {
            label: 'Price',
            data: this.stocksDataChartPricesRounded,
            pointBackgroundColor: 'orange',
            borderColor: 'orange', // Border color of the line
            fill: true,
            backgroundColor: 'rgba(13, 110, 253, 0.5)', // Background color underneath the line
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          xAxis: {
            ticks: {
              maxTicksLimit: 3,
            },
          },
        },
      },
    });
  }
}
