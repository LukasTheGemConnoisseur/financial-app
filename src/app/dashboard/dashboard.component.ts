import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import axios from 'axios';
import Chart from 'chart.js/auto';

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
  stocksDataChartTimesConvertedDays: any; // stores converted stock chart time days
  stocksDataChartTimesConvertedHours: any; // stores converted stock chart time hours
  stocksDataChartTimesConvertedHoursandDays: any; // stores converted stock chart time hours and days

  ngOnInit(): void {
    this.realTimeData();

    this.realTimeDataChart();
  }
  ngAfterViewInit(): void {}

  updateChartData(range: string) {
    // Update the chart's data and options
    let tooltipTitles = [0];
    switch (range) {
      case '1d':
        this.chart.data.labels = this?.stocksDataChartTimesConvertedHours;
        break;
      case '5d':
        this.chart.data.labels = this?.stocksDataChartTimesConvertedDays;
        tooltipTitles = this.stocksDataChartTimesConvertedHoursandDays;
        break;

      default:
        this.chart.data.labels = this.stocksDataChartTimesConverted;
    }
    this.chart.data.datasets[0].data = this.stocksDataChartPricesRounded;

    this.chart.options = {
      aspectRatio: 2.5,
      tooltips: {
        callbacks: {
          title: function (tooltipItems: any[]) {
            const index = tooltipItems[0].index;
            const title = tooltipTitles[index];
            return title;
          },
        },
      },
      scales: {
        xAxis: {
          ticks: {
            maxTicksLimit: 6,
          },
        },
        y: {
          ticks: {
            callback: function (value: number, index: number, ticks: number[]) {
              return '$' + value;
            },
          },
        },
      },
    };

    // Update the chart
    this.chart.update();
  }

  updateChart(range: string) {
    // Call the API with the selected time range (e.g., '1mo', '3mo', '1yr')
    // Update the 'symbol', 'range', and other parameters accordingly based on the button clicked

    if (range == '2y' || range == '5y' || range == '10y' || range == 'max') {
      const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
        params: {
          interval: '1wk',
          symbol: 'TSLA',
          range: range, // Use the selected time range here
          region: 'US',
          includePrePost: 'false',
          useYfid: 'true',
          includeAdjustedClose: 'true',
          events: 'capitalGain,div,split',
        },
        headers: {
          'X-RapidAPI-Key':
            '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        },
      };

      axios
        .request(options)
        .then((response) => {
          this.stocksDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.stocksDataChartPrices =
            this.stocksDataChart.chart.result[0].indicators.adjclose[0].adjclose;
          this.stocksDataChartPricesRounded = this.stocksDataChartPrices.map(
            (price: number) => price.toFixed(2)
          );

          this.stocksDataChartTimes =
            this.stocksDataChart.chart.result[0].timestamp;
          this.stocksDataChartTimesConverted = this.stocksDataChartTimes.map(
            (timeDate: number) =>
              new Date(timeDate * 1000).toLocaleDateString('en-US')
          );

          // Recreate the chart with the updated data
          this.createChart();

          // Update the new chart with the data
          this.updateChartData(range);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (range == '5d') {
      const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
        params: {
          interval: '30m',
          symbol: 'TSLA',
          range: range, // Use the selected time range here
          region: 'US',
          includePrePost: 'false',
          useYfid: 'true',
          includeAdjustedClose: 'true',
          events: 'capitalGain,div,split',
        },
        headers: {
          'X-RapidAPI-Key':
            '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        },
      };

      axios
        .request(options)
        .then((response) => {
          this.stocksDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.stocksDataChartPrices =
            this.stocksDataChart.chart.result[0].indicators.quote[0].close;
          this.stocksDataChartPricesRounded = this.stocksDataChartPrices.map(
            (price: number) => price.toFixed(2)
          );

          this.stocksDataChartTimes =
            this.stocksDataChart.chart.result[0].timestamp;
          // console.log(this.stocksDataChartTimes);
          this.stocksDataChartTimesConverted = this.stocksDataChartTimes.map(
            (timeDate: number) =>
              new Date(timeDate * 1000).toLocaleString('en-US')
          );
          this.stocksDataChartTimesConvertedDays =
            this.stocksDataChartTimes.map((timeDate: number) =>
              new Date(timeDate * 1000).toLocaleDateString('en-US')
            );
          // console.log(this.stocksDataChartTimesConvertedDays);

          this.stocksDataChartTimesConvertedHoursandDays =
            this.stocksDataChartTimes.map((timeDate: number) => {
              const dateDays = new Date(timeDate * 1000).toLocaleDateString(
                'en-US'
              );
              const date = new Date(timeDate * 1000);
              const hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
              const formattedTime = `${dateDays} ${hours}:${minutes}`;
              return formattedTime;
            });
          // console.log(this.stocksDataChartTimesConvertedHoursandDays);

          // Recreate the chart with the updated data
          this.createChart();

          // Update the new chart with the data
          this.updateChartData(range);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (range == '1d') {
      const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
        params: {
          interval: '5m',
          symbol: 'TSLA',
          range: range, // Use the selected time range here
          region: 'US',
          includePrePost: 'false',
          useYfid: 'true',
          includeAdjustedClose: 'true',
          events: 'capitalGain,div,split',
        },
        headers: {
          'X-RapidAPI-Key':
            '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        },
      };

      axios
        .request(options)
        .then((response) => {
          this.stocksDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.stocksDataChartPrices =
            this.stocksDataChart.chart.result[0].indicators.quote[0].close;
          this.stocksDataChartPricesRounded = this.stocksDataChartPrices.map(
            (price: number) => price.toFixed(2)
          );

          this.stocksDataChartTimes =
            this.stocksDataChart.chart.result[0].timestamp;
          // console.log(this.stocksDataChartTimes);
          this.stocksDataChartTimesConverted = this.stocksDataChartTimes.map(
            (timeDate: number) =>
              new Date(timeDate * 1000).toLocaleString('en-US')
          );
          // console.log(this.stocksDataChartTimesConverted);

          this.stocksDataChartTimesConvertedHours =
            this.stocksDataChartTimes.map((timeDate: number) => {
              const date = new Date(timeDate * 1000);
              const hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
              const formattedTime = `${hours}:${minutes}`;
              return formattedTime;
            });
          // console.log(this.stocksDataChartTimesConvertedHours);

          // Recreate the chart with the updated data
          this.createChart();

          // Update the new chart with the data
          this.updateChartData(range);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart',
        params: {
          interval: '1d',
          symbol: 'TSLA',
          range: range, // Use the selected time range here
          region: 'US',
          includePrePost: 'false',
          useYfid: 'true',
          includeAdjustedClose: 'true',
          events: 'capitalGain,div,split',
        },
        headers: {
          'X-RapidAPI-Key':
            '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        },
      };

      axios
        .request(options)
        .then((response) => {
          this.stocksDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.stocksDataChartPrices =
            this.stocksDataChart.chart.result[0].indicators.adjclose[0].adjclose;
          this.stocksDataChartPricesRounded = this.stocksDataChartPrices.map(
            (price: number) => price.toFixed(2)
          );

          this.stocksDataChartTimes =
            this.stocksDataChart.chart.result[0].timestamp;
          this.stocksDataChartTimesConverted = this.stocksDataChartTimes.map(
            (timeDate: number) =>
              new Date(timeDate * 1000).toLocaleDateString('en-US')
          );

          // Recreate the chart with the updated data
          this.createChart();

          // Update the new chart with the data
          this.updateChartData(range);
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
        range: '1mo',
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
        // console.log(this.stocksDataChartPricesRounded);

        this.stocksDataChartTimes =
          this.stocksDataChart.chart.result[0].timestamp;
        // console.log(this.stocksDataChartTimes);
        this.stocksDataChartTimesConverted = this.stocksDataChartTimes.map(
          (timeDate: number) =>
            new Date(timeDate * 1000).toLocaleDateString('en-US')
        );
        // console.log(this.stocksDataChartTimesConverted);
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
            label: 'Price in USD $',
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
              maxTicksLimit: 6,
            },
          },
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return '$' + value;
              },
            },
          },
        },
      },
    });
  }
}
