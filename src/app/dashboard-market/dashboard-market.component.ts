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
  selector: 'app-dashboard-market',
  templateUrl: './dashboard-market.component.html',
  styleUrls: ['./dashboard-market.component.css'],
})
export class DashboardMarketComponent implements OnInit, AfterViewInit {
  marketData: any; // Declare a property to hold the API data
  marketPriceChange: any; // Stores market price change
  marketPriceChangePercent: any; // Stores market price change percent
  marketCap: any; // stores market cap
  marketVolume: any; // stores market volume
  public chart: any; // Stores chart data
  marketDataChart: any; // Stores market chart API data
  marketDataChartPrices: any; // Stores market chart prices
  marketDataChartPricesRounded: any; // Stores rounded market chart prices
  marketDataChartTimes: any; // Stores market chart times
  marketDataChartTimesConverted: any; // Stores converted market chart times
  marketDataChartTimesConvertedHours: any; // stores converted market chart time hours
  marketDataChartTimesConvertedHoursandDays: any; // stores converted market chart time hours and days

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
        this.chart.data.labels = this?.marketDataChartTimesConvertedHours;
        break;
      case '5d':
        this.chart.data.labels = this?.marketDataChartTimesConverted;
        tooltipTitles = this.marketDataChartTimesConvertedHoursandDays;
        break;

      default:
        this.chart.data.labels = this.marketDataChartTimesConverted;
    }
    this.chart.data.datasets[0].data = this.marketDataChartPricesRounded;

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

  marketPricesData(rawPrices: any[]) {
    rawPrices
      .map((price: number | null) => {
        if (typeof price === 'number') {
          return price.toFixed(2); // Convert valid numbers to strings with two decimal places
        }
        return 'N/A'; // Handle non-numeric values
      })
      .filter((price: string) => price !== 'N/A'); // Remove non-numeric values
    return rawPrices;
  }

  marketTimesData(times: any[]) {
    const convertedTime = times.map((timeDate: number) =>
      new Date(timeDate * 1000).toLocaleDateString('en-US')
    );
    return convertedTime;
  }

  chartApiCallGeneral(range: string, interval: string) {
    const call = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts',
      params: {
        symbol: 'AAPL',
        interval: interval,
        range: range,
        region: 'US',
      },
      headers: {
        'X-RapidAPI-Key': '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };
    return call;
  }

  updateChart(range: string) {
    // Call the API with the selected time range (e.g., '3mo', '1yr')
    // Update the 'symbol', 'range', and other parameters accordingly based on the button clicked

    if (range == '5y' || range == 'max') {
      const interval = '1wk';
      const options = this.chartApiCallGeneral(range, interval);

      axios
        .request(options)
        .then((response) => {
          if (
            response.data &&
            response.data.chart &&
            response.data.chart.result.length > 0
          ) {
            this.marketDataChart = response.data;

            this.marketDataChartPrices =
              this.marketDataChart.chart.result[0].indicators.quote[0].close;

            const rawPrices = this.marketDataChartPrices;

            this.marketDataChartPricesRounded =
              this.marketPricesData(rawPrices);

            this.marketDataChartTimes =
              this.marketDataChart.chart.result[0].timestamp;

            this.marketDataChartTimesConverted = this.marketTimesData(
              this.marketDataChartTimes
            );

            // Recreate the chart with the updated data
            this.createChart();

            // Update the new chart with the data
            this.updateChartData(range);
          } else {
            console.error('Invalid API response data');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (range == '5d') {
      const interval = '15m';
      const options = this.chartApiCallGeneral(range, interval);

      axios
        .request(options)
        .then((response) => {
          this.marketDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.marketDataChartPrices =
            this.marketDataChart.chart.result[0].indicators.quote[0].close;

          const rawPrices = this.marketDataChartPrices;

          this.marketDataChartPricesRounded = this.marketPricesData(rawPrices);

          this.marketDataChartTimes =
            this.marketDataChart.chart.result[0].timestamp;

          this.marketDataChartTimesConverted = this.marketTimesData(
            this.marketDataChartTimes
          );

          this.marketDataChartTimesConvertedHoursandDays =
            this.marketDataChartTimes.map((timeDate: number) => {
              const dateDays = new Date(timeDate * 1000).toLocaleDateString(
                'en-US'
              );
              const date = new Date(timeDate * 1000);
              const hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
              const formattedTime = `${dateDays} ${hours}:${minutes}`;
              return formattedTime;
            });

          // Recreate the chart with the updated data
          this.createChart();

          // Update the new chart with the data
          this.updateChartData(range);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (range == '1d') {
      const interval = '5m';

      const options = this.chartApiCallGeneral(range, interval);

      axios
        .request(options)
        .then((response) => {
          this.marketDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.marketDataChartPrices =
            this.marketDataChart.chart.result[0].indicators.quote[0].close;

          const rawPrices = this.marketDataChartPrices;

          this.marketDataChartPricesRounded = this.marketPricesData(rawPrices);

          this.marketDataChartTimes =
            this.marketDataChart.chart.result[0].timestamp;

          this.marketDataChartTimesConverted = this.marketTimesData(
            this.marketDataChartTimes
          );

          this.marketDataChartTimesConvertedHours =
            this.marketDataChartTimes.map((timeDate: number) => {
              const date = new Date(timeDate * 1000);
              const hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
              const formattedTime = `${hours}:${minutes}`;
              return formattedTime;
            });
          // console.log(this.marketDataChartTimesConvertedHours);

          // Recreate the chart with the updated data
          this.createChart();

          // Update the new chart with the data
          this.updateChartData(range);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const interval = '1d';

      const options = this.chartApiCallGeneral(range, interval);

      axios
        .request(options)
        .then((response) => {
          this.marketDataChart = response.data;
          console.log(response.data);

          // Update other chart-related data (prices, times) here as you did in realTimeDataChart()

          this.marketDataChartPrices =
            this.marketDataChart.chart.result[0].indicators.quote[0].close;

          const rawPrices = this.marketDataChartPrices;

          this.marketDataChartPricesRounded = this.marketPricesData(rawPrices);

          this.marketDataChartTimes =
            this.marketDataChart.chart.result[0].timestamp;

          this.marketDataChartTimesConverted = this.marketTimesData(
            this.marketDataChartTimes
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

  abbreviateNumber(number: number) {
    if (number >= 1e12) {
      // Trillions
      return (number / 1e12).toFixed(2) + 'T';
    } else if (number >= 1e9) {
      // Billions
      return (number / 1e9).toFixed(2) + 'B';
    } else if (number >= 1e6) {
      // Millions
      return (number / 1e6).toFixed(2) + 'M';
    } else if (number >= 1e3) {
      // Thousands
      return (number / 1e3).toFixed(2) + 'K';
    } else {
      // Less than a thousand
      return number.toString();
    }
  }

  realTimeData(): void {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
      params: {
        region: 'US',
        symbols: 'AAPL',
      },
      headers: {
        'X-RapidAPI-Key': '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };

    axios
      .request(options)
      .then((response) => {
        this.marketData = response.data; // Store the API data in the component property
        console.log(response.data);

        this.marketPriceChange =
          this.marketData?.quoteResponse.result[0].regularMarketChange.toFixed(
            2
          );
        this.marketPriceChangePercent =
          this.marketData?.quoteResponse.result[0].regularMarketChangePercent.toFixed(
            2
          );
        this.marketCap = this.abbreviateNumber(
          this.marketData?.quoteResponse.result[0].marketCap
        );
        this.marketVolume = this.abbreviateNumber(
          this.marketData?.quoteResponse.result[0].regularMarketVolume
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  realTimeDataChart(): void {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts',
      params: {
        symbol: 'AAPL',
        interval: '1d',
        range: '3mo',
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
        this.marketDataChart = response.data;
        console.log(response.data);

        this.marketDataChartPrices =
          this.marketDataChart.chart.result[0].indicators.quote[0].close;
        this.marketDataChartPricesRounded = this.marketDataChartPrices.map(
          (price: number) => price.toFixed(2)
        );
        // console.log(this.marketDataChartPricesRounded);

        this.marketDataChartTimes =
          this.marketDataChart.chart.result[0].timestamp;
        // console.log(this.marketDataChartTimes);
        this.marketDataChartTimesConverted = this.marketDataChartTimes.map(
          (timeDate: number) =>
            new Date(timeDate * 1000).toLocaleDateString('en-US')
        );
        // console.log(this.marketDataChartTimesConverted);
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
        labels: this.marketDataChartTimesConverted,
        datasets: [
          {
            label: 'Price in USD $',
            data: this.marketDataChartPricesRounded,
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
