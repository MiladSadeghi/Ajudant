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
cardCoins = document.querySelector('.card-coins'),
reminderContent = document.querySelector('#reminder-content'),
reminderEvent = document.querySelector('.reminder-event'),
reminderInput = document.querySelector('.reminder-input'),
linkContent = document.querySelector('#link-content'),
linkTips = document.querySelector('#link-tips')

document.addEventListener("DOMContentLoaded", (e) => {
  showWeather(getAPIWeather());
  showNews(getAPINews())
  showCoins(getAPICoins())
  eventListeners()
  loadFromLocalStorage()

  if(getFromLocalStorage('reminder').length !== 0) {
    reminderContent.innerHTML = `
      <h2 class="fs-5 fw-bold text-white">${getFromLocalStorage('reminder')[1]}</h2>
    `
  }
});

function eventListeners() {
  document.querySelector('#reminder-add').addEventListener('click', ()=> {
    reminderEvent.style.display = 'block';
    document.querySelector('#search').setAttribute('event', 'reminder');
    reminderInput.placeholder = 'e.g. buy pill';
  })

  document.querySelector('#link-add ').addEventListener('click', ()=> {
    reminderEvent.style.display = 'block';
    document.querySelector('#search').setAttribute('event', 'link');
    reminderInput.placeholder = 'e.g. https://google.com';
  })

  document.querySelector('#search').addEventListener('click', (e)=> {
    showMiddle(e.target.getAttribute('event'))
  }, true)

  document.querySelector('#close').addEventListener('click', () => {
    reminderEvent.style.display = 'none'
  }) 
}

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
async function getTitle(url) {
  const fetchAPI = await fetch(`https://textance.herokuapp.com/rest/title/${url}`,{method: "GET", headers: {'Content-Type': 'text/plain'}})
  const result = await fetchAPI.text()
  return result
}

function showWeather(result) {
  result.then((e) => {
    currentWeatherImage.src = 'https:' + e.current.condition.icon
    nowTemp.innerHTML = e.current.feelslike_c
    clientLocation.innerHTML = `${e.location.name} ${e.location.country}`
    wind.innerHTML = `Wind ${e.current.wind_kph} km/h`
    humidity.innerHTML = `Humidity ${e.current.humidity} %`
    e.forecast.forecastday.forEach(element => {
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
    e.forEach(element => {
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

function showMiddle(result) {
  if (reminderInput.value.length > 0) {
    switch (result) {
      case 'reminder':
          localStorage.setItem('reminder', JSON.stringify([1, reminderInput.value]))
          reminderContent.innerHTML = `
            <h2 class="fs-5 fw-bold text-white">${reminderInput.value}</h2>
          `
          reminderEvent.style.display = 'none'
          document.querySelector('.card-reminder-content h3').style.display = 'none'
        break;
      case 'link':
        let i = 0;
        reminderInput.placeholder = 'e.g. https://google.com'
          getTitle(reminderInput.value).then(e => {
            if(linkContent.childElementCount <= 3) {
              addtoLocalStorage('link', [e ,reminderInput.value])
              linkContent.innerHTML += `
              <div class="px-4 my-2 d-flex justify-content-between link-link">
                <a title="${e}" class="text-white text-decoration-underline" href="${reminderInput.value}">${e}</a>
                <span><i class="link-remove bi bi-dash-lg"></i></span>
              </div>
              `
            }
            removeLink()
          });
        reminderEvent.style.display = 'none'
        document.querySelector('.card-link-content h3').style.display = 'none'
      break;
    }
  }
}

function removeLink() {
  document.querySelectorAll('.link-link').forEach(e => {
    e.addEventListener('click', e => {
      if (e.target.classList.contains('link-remove')) {
        removeFromLS('link', e.target.parentElement.parentElement.children[0].href)
        e.target.parentElement.parentElement.remove()
        if(linkContent.childElementCount === 1) {document.querySelector('.card-link-content h3').style.display = 'block'}
      }
    })
  })
}

function addtoLocalStorage(key,value) {
  let getLocal = getFromLocalStorage(key)
  getLocal.push(value)
  localStorage.setItem(key, JSON.stringify(getLocal))
}

function getFromLocalStorage(key) {
  let keyList;
  if (localStorage.getItem(key)) {
    keyList = JSON.parse(localStorage.getItem(key))
  } else {
    keyList = []
  }
  return keyList
}

function removeFromLS(key, link) {
  let getFromLS = getFromLocalStorage(key)
  for (let i = 0; i <= getFromLS.length; i++) {
    if(getFromLS[i][1] == link) {
      getFromLS.splice(i, 1)
      break
    }
  }
  if(getFromLS.length === 0) {localStorage.removeItem(key)} else {
    localStorage.setItem(key, JSON.stringify(getFromLS))
  }
}

function loadFromLocalStorage() {
  let keyList = getFromLocalStorage('link')
  if(keyList.length !== 0) {document.querySelector('.card-link-content h3').style.display = 'none'}
  keyList.forEach(function(key) {
    linkContent.innerHTML += `
      <div class="px-4 my-2 d-flex justify-content-between link-link">
        <a title="${key[0]}" class="text-white text-decoration-underline" href="${key[1]}">${key[0]}</a>
        <span><i class="link-remove bi bi-dash-lg"></i></span>
      </div>
    `
  });
  removeLink()
}