const client = Intl.DateTimeFormat().resolvedOptions().timeZone,
currentWeatherImage = document.querySelector('#c-w-icon'),
nowTemp = document.querySelector('#now-temp'),
clientLocation = document.querySelector('#location'),
wind = document.querySelector('#wind'),
humidity = document.querySelector('#humidity'),
days = document.querySelector('#days'),
nowTime = new Date(),
time = document.querySelector('#time').innerHTML = `${nowTime.getHours()}:${nowTime.getMinutes()}`,
newsImage = document.querySelector('#news-image'),
newsTitle = document.querySelector('#news-title'),
newsLink = document.querySelector('#news-link'),
cardCoins = document.querySelector('.card-coins')

document.addEventListener("DOMContentLoaded", (e) => {
  showWeather(getAPIWeather());
  showNews(getAPINews())
  showCoins(getAPICoins())
});

async function getAPIWeather() {
  const API = `https://api.weatherapi.com/v1/forecast.json?key=46857ae4038f4fe5862172715211709&q=${client.substring(client.indexOf("/"))}&days=5&aqi=yes&alerts=yes#`,
    response = await fetch(API),
    result = await response.json()
  return result;
}
async function getAPINews() {
  const API = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=iHHz7cXFCauPssGKSsmrNGArxffKRY76`,
    response = await fetch(API),
    result = await response.json()
  return result;
}
async function getAPICoins() {
  const API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false`,
    response = await fetch(API),
    result = await response.json()
  return result;
}

function showWeather(result) {
  result.then((e) => {
    currentWeatherImage.src = 'https:' + e.current.condition.icon
    nowTemp.innerHTML = e.current.feelslike_c
    clientLocation.innerHTML = `${e.location.name} ${e.location.country}`
    wind.innerHTML = `Wind ${e.current.wind_kph} km/h`
    humidity.innerHTML = `Humidity ${e.current.humidity} %`
    e.forecast.forecastday.forEach((element, index) => {
      days.innerHTML += `
      <div class="col-4 d-flex align-items-center justify-content-center">
        <div class="image-weath">
          <img src="https:${element.day.condition.icon}">
        </div>
        <div class="content-weath d-flex flex-column">
          <span class="max fs-5 fw-bold">${element.day.maxtemp_c}</span>
          <span class="min fs-5 fw-bold mt-2">${element.day.mintemp_c}</span>
        </div>
      </div>
      `
    })
  });
}

function showNews(result) {
  let randomArticle = Math.floor(Math.random() * 10)
  result.then(e => {
    newsImage.src = 'https://nyt.com/' + e.response.docs[randomArticle].multimedia[2].url
    newsTitle.innerText = e.response.docs[randomArticle].headline.main
    newsLink.href = e.response.docs[randomArticle].web_url
  })
}

function showCoins(result) {
  result.then(e => {
    e.forEach((element, index) => {
      console.log(element.market_cap_rank);
      cardCoins.innerHTML += `
        <div class="coins d-flex w-50 align-items-center justify-content-evenly" data-bs-placement="bottom" data-bs-container="body" title="${element.market_cap_rank}- ${element.name}">
          <img src="${element.image.replace('large','small')}">
          <p class=" fw-bold fs-5 ${(Math.sign(element.price_change_percentage_24h) === -1)? 'red':'green'}">${element.price_change_percentage_24h.toFixed(4)}%</p>
        </div>
      `
    });
    const coinsTooltip = document.querySelectorAll('.coins')
    coinsTooltip.forEach(element => {
      new bootstrap.Tooltip(element)
    });
  })
}