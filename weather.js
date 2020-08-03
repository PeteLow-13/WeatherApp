$(document).ready(function() {
const apiKey = "c1759e335cae47d4b635c175d1bbe0ba";
const localStorageKey = "cities"; 

$("#search-button").on("click", function(){

  var searchedCity = $("#get-city").val();
  getCityWeather(searchedCity)
  console.log(searchedCity)
} )

function getCityWeather(city) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey
    }).then(function(response){
      var cities = [];
      var value = localStorage.getItem(localStorageKey);
      if(value){
        cities = JSON.parse(value)
      }
      cities.unshift(city)
      localStorage.setItem(localStorageKey, JSON.stringify(cities));
      console.log(cities)

    var temp = (((response.main.temp - 273.15) * (9/5) + 32).toFixed(0));
    var weatherIcon = response.weather[0].icon;
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var currentWeather = response.weather[0].description;
    var cityLatitude = response.coord.lat;
    var cityLongitude = response.coord.lon;
    
    $("#city").html(city);
    $("#temp").html(temp);
    $("#humidity").html(humidity);
    $("#windspeed").html(windSpeed);
    $("#current-cond").html(currentWeather);
    $("#icon").html(weatherIcon);

    displayWeatherForecast(cityLatitude,cityLongitude);
  }) 
}
function displayWeatherForecast(latitude,longitude){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey 
  }).then(function(response){
    var forecastRow = $("#forecast-row");
    forecastRow.empty();

    for(var i = 1; i < 6; i++){ 
      var fDate = new Date(response.daily[i].dt * 1000) 
      var fTemp = (((response.daily[i].temp.max - 273.15) * (9/5) + 32).toFixed(0));
      var fHumidity = response.daily[i].humidity;
      var fCurrentWeather = response.daily[i].weather[0].description;
      var fIcon = response.daily[i].weather[0].icon;
      var fUVI = response.daily[i].uvi;
      var fWindSpeed = response.daily[i].wind_speed;

      var data = document.createElement("td");
      
      var dateHeader = document.createElement("h3")
      dateHeader.innerHTML = fDate.toLocaleDateString()
      data.append(dateHeader)
      
      var icon = document.createElement("img")
      icon.setAttribute("src","http://openweathermap.org/img/wn/" + fIcon + "@2x.png")
      data.append(icon); 
      
      var tempSpan = document.createElement("div")
      tempSpan.innerHTML = "Temp: " + fTemp;
      data.append(tempSpan);
      
      var humiditySpan = document.createElement("div");
      humiditySpan.innerHTML = "Humidity: " + fHumidity + "%";
      data.append(humiditySpan);
      
      

      forecastRow.append(data);
      
    }

    
  })
  

}

})

// https://api.openweathermap.org/data/2.5/onecall?lat=47.61&lon=-122.33&appid=c1759e335cae47d4b635c175d1bbe0ba

