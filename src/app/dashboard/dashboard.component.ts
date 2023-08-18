import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stocksData: any; // Declare a property to hold the API data

  ngOnInit(): void {
    this.realTimeData(); 
  }

  realTimeData(): void {
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary',
      params: {
        symbol: 'AMRN',
        region: 'US',
      },
      headers: {
        'X-RapidAPI-Key': '362ec0421cmshfba1d04496e3fbbp12c938jsn16f3092359ee',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    };

    axios.request(options)
      .then(response => {
        this.stocksData = response.data; // Store the API data in the component property
        console.log(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  }
}
