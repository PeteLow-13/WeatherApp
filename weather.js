$(document).ready(function() {
let cities = JSON.parse(localStorage.getItem("cities")) || [];
const apiKey = "c1759e335cae47d4b635c175d1bbe0ba";

$("#search-button").on("click", function(){

  let searchedCity = $("#get-city").val();
  let editedCity = searchedCity.charAt(0).toUpperCase()+searchedCity.slice(1);
  getCityWeather(editedCity)
} );

localStorage.getItem("cities");
console.log(JSON.parse(localStorage.getItem("cities")));

function makeButtons(){
  $("#cities-list").html("")
    let filteredCities = [];
      cities.forEach((city)=> {
        if(!filteredCities.includes(city)){
          filteredCities.push(city);
        }
      } 
  );
  for(i = 0; i < filteredCities.length; i++){
  
    $("#cities-list").append(`<button class="cities" id="${filteredCities[i]}">${filteredCities[i]}</button><br>`);
    $(".cities").on("click", function(){
    var buttonAttr =  $(this).attr("id");
    getCityWeather(buttonAttr);
    })
  }
};
makeButtons();

function getCityWeather(city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey
    }).then(function(response){
      
      cities.unshift(city)
      localStorage.setItem("cities", JSON.stringify(cities));
      console.log(cities)
      
      let cityLatitude = response.coord.lat;
      let cityLongitude = response.coord.lon;
    
    $("#city").html(city);

    displayWeatherForecast(cityLatitude,cityLongitude);
    currentWeatherDisplay(cityLatitude,cityLongitude);
    makeButtons();
  }); 
};
getCityWeather(cities[0]);

function currentWeatherDisplay (latitude,longitude){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey
  }).then(function(response){
    const temp = (((response.current.temp - 273.15) * (9/5) + 32).toFixed(0));
    const humidity = response.current.humidity;
    const windSpeed = response.current.wind_speed;
    const currentWeather = response.current.weather[0].description;
    const uvIndex = response.current.uvi;
    const weatherIcon = response.daily[0].weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    
    $("#temp").html(temp);
    $("#humidity").html(humidity);
    $("#windspeed").html(windSpeed);
    $("#current-cond").html(currentWeather);
    $("#uv-index").html(uvIndex);
    $("#weather-icon").html("<img src="+iconURL+">");

    if (uvIndex < 3) {
      $("#uv-index").css("background-color", "green");
    } else if (uvIndex < 6) {
      $("#uv-index").css("background-color", "yellow");
    } else if (uvIndex < 8) {
      $("#uv-index").css("background-color", "orange");
    } else if (uvIndex < 11) {
      $("#uv-index").css("background-color", "red");
    } else {
      $("#uv-index").css("background-color", "white");
    }; 
  });
};

function displayWeatherForecast(latitude,longitude){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey 
  }).then(function(response){
    const forecastRow = $("#forecast-row");
    forecastRow.empty();

    for(var i = 1; i < 6; i++){ 
      const fDate = new Date(response.daily[i].dt * 1000) 
      const fTemp = (((response.daily[i].temp.max - 273.15) * (9/5) + 32).toFixed(0));
      const fLowTemp = (((response.daily[i].temp.min - 273.15) * (9/5) + 32).toFixed(0));
      const fHumidity = response.daily[i].humidity;
      const fIcon = response.daily[i].weather[0].icon;
      
      const data = document.createElement("td");
      
      const dateHeader = document.createElement("h3");
      dateHeader.innerHTML = fDate.toLocaleDateString()
      data.append(dateHeader)
      
      const icon = document.createElement("img");
      icon.setAttribute("src","https://openweathermap.org/img/wn/" + fIcon + "@2x.png")
      data.append(icon); 
      
      const tempSpan = document.createElement("div");
      tempSpan.innerHTML = `High Temp: ${fTemp} °`
      data.append(tempSpan);
      
      const lowTempSpan = document.createElement("div");
      lowTempSpan.innerHTML = `Low Temp: ${fLowTemp}°`
      data.append(lowTempSpan)
      
      const humiditySpan = document.createElement("div");
      humiditySpan.innerHTML = `Humidity ${fHumidity}%`;
      data.append(humiditySpan);
      
      forecastRow.append(data);
      
    }  
  });
};

function clearCities(event){
  event.preventDefault();
  cities = [];
  localStorage.clear();
  document.location.reload()
};

$("#clear-button").on("click", clearCities);
});


