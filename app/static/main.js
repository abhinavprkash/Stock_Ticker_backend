// import axios from 'axios';
// console.log('main.js loaded');
document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM loaded');
    // document.getElementById('searchButton').addEventListener('click', searchCompany);
    // // console.log('ticker_name', ticker_name);
    // addEventListener('submit', (e) => {
    //     console.log('Form submitted');
    // });
    document.getElementById('searchButton').addEventListener('click', async function(e) {
        e.preventDefault();
        searchCompany();
    });
    document.getElementById('closeButton').addEventListener('click', clear);
});

async function searchCompany() {
    let ticker = document.getElementById('ticker_name').value.trim();
    if (!ticker) {
        ErrorDisplay(true);
        return;
    }
    console.log(ticker);
    await fetchCompanyData(ticker);
    await fetchCompanySummary(ticker);
    await fetchCompanyNews(ticker);
    await fetchCompanyChart(ticker);
    document.getElementById('companyResultSection').style.display = 'block';

}

// function ErrorDisplay(show) {
//     var error = document.querySelector('.errorSection');
//     var company = document.querySelector('#company_info_tab');
//     show ? error.style.display = 'flex' : error.style.display = 'none';
//     show ? company.style.display = 'none' : company.style.display = 'block';
// }
function ErrorDisplay(show) {
    var errorSection = document.querySelector('.errorSection');
    var companyResultSection = document.getElementById('companyResultSection');

    show ? errorSection.style.display = 'flex' : errorSection.style.display = 'none';
    show ? companyResultSection.style.display = 'none' : companyResultSection.style.display = 'block';
}


function querySelectorFunction(id, content) {
    document.querySelector(`#${id}`).innerHTML = content;
}

function classNameFunction(id) {
    return document.getElementsByClassName(id);
}

function clear() {
    document.getElementById('ticker_name').textContent = '';
    ErrorDisplay(false);
    removeCompanyData();
}

function removeCompanyData() {
    let content, links, i = 0;
    content = classNameFunction('company_info_tab');
    while (i < content.length) {
        content[i].style.display = "none";
        i++;
    }
    links = classNameFunction('active1');
    i = 0;
    while (i < links.length) {
        links[i].className = links[i].className.replace(" active", "");
        i++;
    }
}

function showTab(event, tabName) {
    let i, content, links;
    content = classNameFunction('contentTab');
    i = 0;
    while (i < content.length) {
        content[i].style.display = "none";
        i++;
    }
    links = classNameFunction('active1');
    i = 0;
    while (i < links.length) {
        links[i].className = links[i].className.replace(" active", "");
        i++;
    }
    document.getElementById(tabName).style.display = "flex";
    event.currentTarget.className += " active";

}

function unixTocalenderConvert(time) {
    const unixTime = new Date(time * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedTime = unixTime.toLocaleDateString('en-US', options);
    return formattedTime;
}

function unixTocalenderConvertGraph(time) {
    const unixTime = new Date(time * 1000);
    let year = unixTime.getFullYear();
    let month = unixTime.getMonth() + 1;
    let date = unixTime.getDate();
    let newDate = '';
    newDate = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
    return newDate;
}


// function fetchCompanyData(ticker) {
//     axios.get(`http://localhost:5000/details?ticker=${ticker}`).then(response => {
//         const res = response.data;
//         Object.keys(res).length === 0 ? ErrorDisplay(true) : ErrorDisplay(false);

//         let data = res;
//         let image = `<br>`;
//         // if (data.logo && data.logo.length > 0) {
//         image = `<img src="${data.logo}" alt="Company Logo" id="company_logo" height="100" width="100">`;
//         // }
//         // console.log(image);
//         querySelectorFunction('company_logo', image);

//         querySelectorFunction('stock_ticker', data.ticker);
//         querySelectorFunction('company_name', data.name);
//         querySelectorFunction('stock_exchange_code', data.exchange);
//         querySelectorFunction('company_ipo_date', data.ipo);
//         querySelectorFunction('company_category', data.finnhubIndustry);

//         var information = document.getElementById('company_info_tab');
//         information.style.display = "block";
//         // console.log(data);
//     }).catch(err => {
//         // console.log(err);
//     });
// }

async function fetchCompanyData(ticker) {
    try {
        const response = await axios.get(`http://localhost:5000/details?ticker=${ticker}`);
        const data = response.data;

        if (Object.keys(data).length === 0) {
            ErrorDisplay(true);
            return;
        }

        ErrorDisplay(false);

        let imageTag = data.logo ? `<img src="${data.logo}" alt="Company Logo" id="company_logo" height="100" width="100">` : `<br>`;
        querySelectorFunction('company_logo', imageTag);
        querySelectorFunction('stock_ticker', data.ticker);
        querySelectorFunction('company_name', data.name);
        querySelectorFunction('stock_exchange_code', data.exchange);
        querySelectorFunction('company_ipo_date', data.ipo);
        querySelectorFunction('company_category', data.finnhubIndustry);

        document.getElementById('company_info_tab').style.display = "block";
    } catch (err) {
        console.error(err);
        ErrorDisplay(true);
    }
}


// function fetchCompanySummary(ticker) {
//     axios.get(`http://localhost:5000/summary?ticker=${ticker}`).then(response => {
//         const data = response.data.stockSummary;
//         console.log("Reading data from summary", data);
//         console.log(data);
//         let arrowForChange = '';

//         data.d < 0 ? arrowForChange = "../static/img/RedArrowDown.png" : arrowForChange = "../static/img/GreenArrowUp.png";

//         let arrowForPercentData = '';

//         data.dp < 0 ? arrowForPercentData = "../static/img/RedArrowDown.png" : arrowForPercentData = "../static/img/GreenArrowUp.png";
//         let changeData = `${data.d} <span><img src="${arrowForChange}" height = "12" width="12"></span>`;
//         let changePercentData = `${data.dp} <span><img src="${arrowForPercentData}" height = "12" width="12"></span>`;
//         let convertedTime = unixTocalenderConvert(data.t);
//         querySelectorFunction('stock_ticker_symbol', ticker);
//         querySelectorFunction('trading_day', convertedTime);
//         querySelectorFunction('previous_closing_price', data.pc);
//         querySelectorFunction('opening_price', data.o);
//         querySelectorFunction('high_price', data.h);
//         querySelectorFunction('low_price', data.l);
//         querySelectorFunction('change', changeData);
//         querySelectorFunction('change_percent', changePercentData);
//         // console.log(data);
//         console.log("Reading data from recom", response.data.recommendations[0]);
//         const data_rec = response.data.recommendations[0];
//         let strongBuy = "NA";
//         let buy = "NA";
//         let hold = "NA";
//         let sell = "NA";
//         let strongSell = "NA";
//         if (data_rec) {
//             strongBuy = data_rec.strongBuy;
//             buy = data_rec.buy;
//             hold = data_rec.hold;
//             sell = data_rec.sell;
//             strongSell = data_rec.strongSell;
//         }
//         console.log("strongBuy", strongBuy);
//         console.log("buy", buy);
//         console.log("hold", hold);
//         console.log("sell", sell);
//         console.log("strongSell", strongSell);
//         querySelectorFunction('strongBuy', strongBuy);
//         querySelectorFunction('buy', buy);
//         querySelectorFunction('hold', hold);
//         querySelectorFunction('sell', sell);
//         querySelectorFunction('strongSell', strongSell);

//     }).catch(err => {
//         console.log(err);
//     });
// }

async function fetchCompanySummary(ticker) {
    try {
        const response = await axios.get(`http://localhost:5000/summary?ticker=${ticker}`);
        const data = response.data.stockSummary;
        const arrowForChange = data.d < 0 ? "../static/img/RedArrowDown.png" : "../static/img/GreenArrowUp.png";
        const arrowForPercentData = data.dp < 0 ? "../static/img/RedArrowDown.png" : "../static/img/GreenArrowUp.png";
        const changeData = `${data.d} <span><img src="${arrowForChange}" height = "12" width="12"></span>`;
        const changePercentData = `${data.dp} <span><img src="${arrowForPercentData}" height = "12" width="12"></span>`;
        const ticker1 = ticker.toUpperCase();
        console.log("ticker1", ticker1);
        const convertedTime = unixTocalenderConvert(data.t);
        querySelectorFunction('stock_ticker_symbol', ticker1);
        querySelectorFunction('trading_day', convertedTime);
        querySelectorFunction('previous_closing_price', data.pc);
        querySelectorFunction('opening_price', data.o);
        querySelectorFunction('high_price', data.h);
        querySelectorFunction('low_price', data.l);
        querySelectorFunction('change', changeData);
        querySelectorFunction('change_percent', changePercentData);

        const data_rec = response.data.recommendations[0];
        let strongBuy = "NA";
        let buy = "NA";
        let hold = "NA";
        let sell = "NA";
        let strongSell = "NA";
        if (data_rec) {
            strongBuy = data_rec.strongBuy;
            buy = data_rec.buy;
            hold = data_rec.hold;
            sell = data_rec.sell;
            strongSell = data_rec.strongSell;
        }
        querySelectorFunction('strongBuy', strongBuy);
        querySelectorFunction('buy', buy);
        querySelectorFunction('hold', hold);
        querySelectorFunction('sell', sell);
        querySelectorFunction('strongSell', strongSell);
    } catch (err) {
        console.error(err);
    }
}

// function fetchCompanyNews(ticker) {
//     axios.get(`http://localhost:5000/news?ticker=${ticker}`).then(response => {

//         const res = response.data;
//         console.log("heelo", response.data);
//         let newsData = '';
//         let data = res;
//         var i = 0;
//         while (i < data.length) {
//             let Time = unixTocalenderConvert(data[i].datetime);
//             newsData += `<div class="news_box">
//             <div class="news_Image">
//                 <img src="${data[i].image}" alt="news Image" id="news_image" height="80" width="80">
//             </div>
//             <div class="newTexts">
//                 <div id = "headline">${data[i].headline}</div>
//                 <div id = "date">${Time}</div>
//                 <a href = "${data[i].url}" id = "url" target="__blank__">See Original Post</a>
//             </div>
//         </div>`;
//             i++;
//         }
//         querySelectorFunction('newsTab', newsData);
//     }).catch(err => {
//         console.log(err);
//     });
// }

async function fetchCompanyNews(ticker) {
    try {
        const response = await axios.get(`http://localhost:5000/news?ticker=${ticker}`);
        const data = response.data;
        let newsData = '';
        let i = 0;
        while (i < data.length) {
            const Time = unixTocalenderConvert(data[i].datetime);
            newsData += `<div class="news_box">
            <div class="news_Image">
                <img src="${data[i].image}" alt="news Image" id="news_image" height="80" width="80">
            </div>
            <div class="newTexts">
                <div id = "headline">${data[i].headline}</div>
                <div id = "date">${Time}</div>
                <a href = "${data[i].url}" id = "url" target="__blank__">See Original Post</a>
            </div>  
        </div>`;
            i++;
        }
        querySelectorFunction('newsTab', newsData);
    } catch (err) {
        console.error(err);
    }
}


// function fetchCompanyChart(ticker) {
//     axios.get(`http://localhost:5000/graph?ticker=${ticker}`).then(response => {
//         const data = response.data;
//         console.log("Reading data from chart", data);
//         let date = new Date().toISOString().split('T')[0];
//         let chartData = [];
//         let volumeData = [];
//         let stockData = data.stock_data;
//         let stockVolume = data.stock_volume;
//         for (let i = 0; i < stockData.length; i += 1) {
//             let tempVar1 = [];
//             let tempVar2 = [];
//             tempVar1.push(stockData[i][0] * 1000);
//             tempVar1.push(stockData[i][1]);
//             chartData.push(tempVar1);

//             tempVar2.push(stockVolume[i][0] * 1000);
//             tempVar2.push(stockVolume[i][1]);
//             volumeData.push(tempVar2);
//         }
//         console.log("chartData", chartData);
//         console.log("volumeData", volumeData);
//         Highcharts.stockChart('chart_container', {

//             rangeSelector: {

//                 buttons: [{
//                     type: 'day',
//                     count: 7,
//                     text: '7d'
//                 }, {
//                     type: 'day',
//                     count: 15,
//                     text: '15d'
//                 }, {
//                     type: 'month',
//                     count: 1,
//                     text: '1m'
//                 }, {
//                     type: 'month',
//                     count: 3,
//                     text: '3m'
//                 }, {
//                     type: 'month',
//                     count: 6,
//                     text: '6m'
//                 }],
//                 selected: 1,
//                 inputEnabled: false,
//             },

//             title: {
//                 text: `Stock Price ${ticker}` + ' ' + date
//             },

//             subtitle: {
//                 text: '<a href="https://polygon.io/" target="__blank__">Source: Polygon.io</a>',
//                 useHTML: true
//             },

//             yAxis: [{
//                     title: {
//                         text: 'Stock Price'
//                     },
//                     opposite: false
//                 },
//                 {
//                     labels: {
//                         align: 'left'
//                     },
//                     title: {
//                         text: 'Volume'
//                     },
//                     opposite: true,
//                 }
//             ],
//             plotOptions: {
//                 column: {
//                     pointWidth: 5,
//                 }
//             },

//             series: [{
//                     name: 'Stock',
//                     data: chartData,
//                     type: 'area',
//                     yAxis: 0,
//                     showInNavigator: true,
//                     threshold: null,
//                     tooltip: {
//                         valueDecimals: 2
//                     },
//                     fillColor: {
//                         linearGradient: {
//                             x1: 0,
//                             y1: 0,
//                             x2: 0,
//                             y2: 1
//                         },
//                         stops: [
//                             [0, Highcharts.getOptions().colors[0]],
//                             [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
//                         ]
//                     }
//                 },
//                 {
//                     type: 'column',
//                     name: 'Volume',
//                     data: volumeData,
//                     yAxis: 1,
//                     showInNavigator: false,
//                     color: 'black'
//                 }
//             ]
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// }

async function fetchCompanyChart(ticker) {
    try {
        const response = await axios.get(`http://localhost:5000/graph?ticker=${ticker}`);
        const data = response.data;
        let date = new Date().toISOString().split('T')[0];
        let chartData = [];
        let volumeData = [];
        let stockData = data.stock_data;
        let stockVolume = data.stock_volume;
        for (let i = 0; i < stockData.length; i += 1) {
            let tempVar1 = [];
            let tempVar2 = [];
            tempVar1.push(stockData[i][0] * 1000);
            tempVar1.push(stockData[i][1]);
            chartData.push(tempVar1);

            tempVar2.push(stockVolume[i][0] * 1000);
            tempVar2.push(stockVolume[i][1]);
            volumeData.push(tempVar2);
        }
        Highcharts.stockChart('chart_container', {

            rangeSelector: {

                buttons: [{
                    type: 'day',
                    count: 7,
                    text: '7d'
                }, {
                    type: 'day',
                    count: 15,
                    text: '15d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }],
                selected: 1,
                inputEnabled: false,
            },

            title: {
                text: `Stock Price ${ticker}` + ' ' + date
            },

            subtitle: {
                text: '<a href="https://polygon.io/" target="__blank__">Source: Polygon.io</a>',
                useHTML: true
            },

            yAxis: [{
                    title: {
                        text: 'Stock Price'
                    },
                    opposite: false
                },
                {
                    labels: {
                        align: 'left'
                    },
                    title: {
                        text: 'Volume'
                    },
                    opposite: true,
                }
            ],
            plotOptions: {
                column: {
                    pointWidth: 5,
                }
            },

            series: [{
                    name: 'Stock',
                    data: chartData,
                    type: 'area',
                    yAxis: 0,
                    showInNavigator: true,
                    threshold: null,
                    tooltip: {
                        valueDecimals: 2
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }
                },
                {
                    type: 'column',
                    name: 'Volume',
                    data: volumeData,
                    yAxis: 1,
                    showInNavigator: false,
                    color: 'black'
                }
            ]
        });
    } catch (err) {
        console.error(err);
    }
}