// import axios from 'axios';
// console.log('main.js loaded');
document.addEventListener('DOMContentLoaded', () => {
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
    // document.getElementById('companyResultSection').style.display = 'block';
}

function ErrorDisplay(show) {
    var errorSection = document.querySelector('.errorSection');
    var companyResultSection = document.getElementById('companyResultSection');

    if (show) {
        errorSection.style.display = 'flex';
        document.getElementById('companyResultSection').style.display = 'none';
    } else {
        errorSection.style.display = 'none';
        document.getElementById('companyResultSection').style.display = 'block';
    }
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



async function fetchCompanyData(ticker) {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/details?ticker=${ticker}`);
        const data = response.data;

        if (Object.keys(data).length === 0) {
            ErrorDisplay(true);
            document.getElementByClass('errorSection').style.display = 'block';
            document.getElementById('companyResultSection').style.display = 'none';
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
            <div class="news_Text">
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



async function fetchCompanyChart(ticker) {
    try {
        const response = await axios.get(`http://localhost:5000/graph?ticker=${ticker}`);
        const data = response.data;
        let chartData = [];
        let volumeData = [];

        for (let i = 0; i < data.resultsCount; i += 1) {
            chartData.push([data.results[i].t, data.results[i].c]);
        }
        for (let i = 0; i < data.resultsCount; i += 1) {
            volumeData.push([data.results[i].t, data.results[i].v]);
        }

        let todayDate = new Date().toJSON().slice(0, 10);

        (async() => {
                Highcharts.stockChart('chart_container', {
                    title: {
                        text: 'Stock Price ' + ticker + ' ' + todayDate
                    },
                    subtitle: {
                        text: '<a href="https://polygon.io/" target="_blank">Source: Polygon.io</a>',
                        useHTML: true
                    },
                    yAxis: [{
                        opposite: false,
                        title: {
                            text: 'Stock Price'
                        }
                    }, {
                        opposite: true,
                        title: {
                            text: 'Volume'
                        }
                    }],

                    plotOptions: {
                        column: {
                            pointWidth: 5,
                        }
                    },
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
                        selected: 5,
                        inputEnabled: false
                    },
                    series: [{
                        name: 'Stock Price',
                        type: 'area',
                        data: chartData,
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
                        },
                        threshold: null
                    }, {
                        name: 'Volume',
                        type: 'column',
                        data: volumeData,
                        yAxis: 1,
                        showInNavigator: false,
                        color: 'black'
                    }]
                });
            }

        )();
    } catch (err) {
        console.error(err);
    }
}