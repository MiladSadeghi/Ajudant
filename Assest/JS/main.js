const client = Intl.DateTimeFormat().resolvedOptions().timeZone,
currentWeatherImage = document.querySelector('#c-w-icon'),
nowTemp = document.querySelector('#now-temp'),
clientLocation = document.querySelector('#location'),
wind = document.querySelector('#wind'),
humidity = document.querySelector('#humidity'),
days = document.querySelector('#days')


document.addEventListener("DOMContentLoaded", (e) => {
  showWeatherAndTime(getAPIForWeatherAndTime());
});

async function getAPIForWeatherAndTime() {
  const API = `https://api.weatherapi.com/v1/forecast.json?key=46857ae4038f4fe5862172715211709&q=${client.substring(client.indexOf("/"))}&days=5&aqi=yes&alerts=yes#`,
    response = await fetch(API),
    result = await response.json()

  return result;
}

function showWeatherAndTime(result) {
  result.then((e) => {
    console.log(e);
    currentWeatherImage.src = 'https:' + e.current.condition.icon
    nowTemp.innerHTML = e.current.feelslike_c
    clientLocation.innerHTML = `${e.location.name} ${e.location.country}`
    wind.innerHTML = `Wind ${e.current.wind_kph} km/h`
    humidity.innerHTML = `Humidity ${e.current.humidity} %`
    e.forecast.forecastday.forEach((element, index) => {
      console.log(element);
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
