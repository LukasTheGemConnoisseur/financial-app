import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {}

const stocksContainer = document.querySelector('#firstStock');

import axios from 'axios';

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

const realTimeData = async function () {
  try {
    const response = await axios.request(options);
    console.log(stocksContainer); //showing up as null?
    console.log(response.data);
    console.log(response.data.quoteType.symbol);
    const html = `<div class="stocks_data">
      <h3 class="quoteType.symbol">${response.data.quoteType.symbol}</h3>
    </div>`;

    // stocksContainer.insertAdjacentHTML('beforeend', html);
  } catch (error) {
    console.error(error);
  }
};
realTimeData();
