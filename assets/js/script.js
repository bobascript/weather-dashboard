
var searchBtn = document.querySelector("#search");

var city = document.querySelector("#cityInput");

var cities = [];

var APIKey = "5ec86d504d095e40ca464472dca1c644";

// URLs

var coordinatesURL = "https://api.openweathermap.org/data/3.0/onecall?";
var cityURL = "https://api.openweathermap.org/data/2.5/weather?q="
var iconURLroot = "http://openweathermap.org/img/wn/"
var excludeParams = "current,minutely,hourly,alerts";

// Adds new cities to the browsers local storage
function saveCity(newCity) {
    cities.push(newCity); 
    localStorage.setItem("Searched",JSON.stringify(cities));
    var cityHistory; 
}

// Creates temperature, wind, and humidity elements
function fillInWeather (weatherDiv,temperature,windSpeed,humidityPctg) {
    var date = document.createElement("h2");
    var temps = document.createElement("h4");
    var wind = document.createElement("h4");
    var humidity = document.createElement("h4");
    temps.textContent = "Temp: " + temperature + " C";
    wind.textContent = "Wind: " + windSpeed + " m/s";
    humidity.textContent = "Humidity: " + humidityPctg + " %";
    temps.className = "weatherData";
    wind.className = "weatherData";
    humidity.className = "weatherData";
    weatherDiv.appendChild(temps);
    weatherDiv.appendChild(wind);
    weatherDiv.appendChild(humidity);
}

// Search
function searchCity(event) {
    var lon, lat;
    event.preventDefault();
    
    cityURL = cityURL + city.value + "&appid=" + APIKey + "&units=metric";
    
    fetch (cityURL)
    .then(function (response) {
       
        return response.json();
    })
    .then (function (data){
        var currentCity = document.querySelector("#searchedCity");
        var cityName = document.createElement("h2");
        var weatherIcon = document.createElement("img");
        var date = new Date((data.dt + data.timezone)* 1000);
        cityName.className = "city-search";
        cityName.textContent = data.name + " (" + date.toLocaleDateString() + ")";

        var iconURL = [];
        iconURL[0] = iconURLroot + data.weather[0].icon + "@2x.png";
        weatherIcon.setAttribute("src",iconURL[0]);
        cityName.appendChild(weatherIcon);
        currentCity.appendChild(cityName);
        var temps = data.main.temp;
        var wind = data.wind.speed;
        var humidity = data.main.humidity;    
        fillInWeather(currentCity,temps,wind,humidity);
        lon = data.coord.lon;
        lat = data.coord.lat;

        coordinatesURL += "lat=" + lat + "&lon=" + lon + "&exclude=" + excludeParams + "&appid=" + APIKey + "&units=metric";
        console.log("coordinatesURL: " + coordinatesURL);
        fetch(coordinatesURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var longRange = document.querySelector("#fiveDays");
                for (var i = 1; i<=5; i++) {
                    var futureDate = document.createElement("h3");
                    var dayWeather = document.createElement("div");
                    var weatherIcon = document.createElement("img");
                    dayWeather.className = "card border border-dark bg-secondary  ";
                    var date = new Date((data.daily[i].dt + data.timezone_offset) * 1000);
                    var temps = data.daily[i].temp.day;
                    var wind = data.daily[i].wind_speed;
                    var humidity = data.daily[i].humidity;
                    futureDate.textContent = date.toLocaleDateString();
                    futureDate.className = "date-search";
                    dayWeather.appendChild(futureDate);
                    iconURL[i] = iconURLroot + data.daily[i].weather[0].icon + "@2x.png";
                    console.log("iconURL: " + iconURL[i]);
                    weatherIcon.setAttribute("src", iconURL[i]);
                    weatherIcon.setAttribute("style", "width:3rem;height:3rem");
                    dayWeather.appendChild(weatherIcon);
                    fillInWeather(dayWeather, temps, wind, humidity);
                    longRange.appendChild(dayWeather);
                }
            });
    });

    // Verifies whether or not the last city that was searched is in local storage, adds it if not
    if (!cities.includes(city.value)) {
        saveCity(city.value);
    }

}
// Adds the event listener to the search button
searchBtn.addEventListener("click", searchCity);