const cityInput =document.querySelector('.city-input');
const searchBtn =document.querySelector('.search-btn');

const apiKey = '7bc5af6686a8b9f53be841e21fa20643';

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection =document.querySelector('.not-found');
const searchCitySection =document.querySelector('.search-city');

const countryTXT = document.querySelector('.country-txt');
const tempTXT =document.querySelector('.temp-txt');
const conditionTXT =document.querySelector('.condition-txt');

const humidityValueTXT =document.querySelector('.Humidity-value-txt');
const windValueTXT =document.querySelector('.wind-value-txt');
const weatherSummaryImg =document.querySelector('.weather-summary-img')

const currentDateTXT = document.querySelector('.current-date-txt');
const forcastItemsContainer = document.querySelector('.forcast-items-container');


searchBtn.addEventListener('click' , ()=>{
   if (cityInput.value.trim() != '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = ''
    cityInput.blur();
    }
})
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && cityInput.value.trim() !== '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl); 
    return response.json();

}
function getWeatherIcon(id) {
  if (id >= 200 && id <= 232) return 'thunderstorm.svg';   
  if (id >= 300 && id <= 321) return 'drizzle.svg';        
  if (id >= 500 && id <= 531) return 'rain.svg';           
  if (id >= 600 && id <= 622) return 'snow.svg';           
  if (id >= 701 && id <= 781) return 'atmosphere.svg';     
  if (id === 800) return 'clear.svg';                      
  else return 'clouds.svg';                                            
}
function getCurrentDate(){
    const currentDate =new Date();
    const options = {
        weekday : 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB' , options)
    console.log(currentDate);
}


 async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);
    if(weatherData.cod != 200)
    {
        showDisplaySection(notFoundSection);
        return
    }
    console.log(weatherData);
    const {
        name:country,
        main:{temp ,humidity},
        weather:[{ id,main}],
        wind:{ speed }
    } = weatherData 

    countryTXT.textContent = country; 
    tempTXT.textContent= Math.round(temp) + ' °C' ;
    conditionTXT.textContent = main
    humidityValueTXT.textContent = humidity + '%';
    windValueTXT.textContent = speed + 'M/s';
    currentDateTXT.textContent = getCurrentDate();


    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    
     await updateWeatherForcastsInfo(city)
    showDisplaySection(weatherInfoSection);
 }

async function updateWeatherForcastsInfo(city) {
    const forcastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const now = new Date();

    const egyptDate = new Date().toLocaleDateString('en-EG', { timeZone: 'Africa/Cairo' });
    console.log("Egypt Date Only:", egyptDate);

    forcastItemsContainer.innerHTML = ''

    forcastsData.list.forEach(forcastsWeather => {
        if (forcastsWeather.dt_txt.includes(timeTaken) &&  
         !forcastsWeather.dt_txt.includes(egyptDate)) {
            console.log("Match found:", forcastsWeather);
            updateForcastItems(forcastsWeather)
        }

        console.log(forcastsWeather);
    });
}
function updateForcastItems(weatherData){
    console.log(weatherData);
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forcastItem = `
        <div class="forcast-item">
            <h5 class="forcast-item-date regular-txt">${dateResult}</h5> 
            <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forcast-item-img">
            <h5 class="forcast-item-temp">${Math.round(temp)}</h5>
        </div>
    `;

    forcastItemsContainer.insertAdjacentHTML('beforeend', forcastItem);
}


 function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display = 'none');

  section.style.display = 'flex';
}
