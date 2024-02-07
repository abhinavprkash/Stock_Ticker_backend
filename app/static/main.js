import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    document.getElementById('searchButton').addEventListener('click', searchCompany);
    document.getElementById('ticker_name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCompany();
        }
    });
    document.getElementById('closeButton').addEventListener('click', onCrossClick);
});

function searchCompany() {
    let ticker = document.getElementById('ticker_name').value;
    if (!ticker) {
        ErrorDisplay(true);
        return;
    }
    console.log(ticker);
    fetchCompanyData(ticker);
    // fetchCompanySummary(ticker);
    // fetchCompanyNews(ticker);
    // fetchCompanyChart(ticker);
}

function ErrorDisplay(show) {
    const errorContainer = document.getElementById('error_container');
    errorContainer.style.display = show ? 'flex' : 'none';
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
    links = classNameFunction('tablinks');
    i = 0;
    while (i < links.length) {
        links[i].className = links[i].className.replace(" active", "");
        i++;
    }
}

function showTab(event, tabName) {
    let i, content, links;
    content = classNameFunction('companyTab');
    i = 0;
    while (i < content.length) {
        content[i].style.display = "none";
        i++;
    }
    links = classNameFunction('tablinks');
    i = 0;
    while (i < links.length) {
        links[i].className = links[i].className.replace(" active", "");
        i++;
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";

}


function fetchCompanyData(ticker) {
    axios.get(`http://localhost:5000/stock_search?company_name=${companyName}`).then((response => response.json())).then(res => {
        Object.keys(res).length === 0 ? displayError(true) : displayError(false);

        let data = res;
        let image = `<br>`;
        if (data.logo.length > 0) {
            image = `<img src="${data.logo}" alt="Company Logo" id="company_logo" height="100" width="100">`;
        }
        querySelectorFunction('#company_logo', image);
        querySelectorFunction('stock_ticker', data.ticker);
        querySelectorFunction('company_name', data.name);
        querySelectorFunction('stock_exchange_code', data.exchange);
        querySelectorFunction('company_ipo_date', data.ipo);
        querySelectorFunction('company_category', data.finnhubIndustry);

        var information = document.getElementById('company_info');
        information.style.display = "block";
    }).catch(err => {
        console.log(err);
    });
}