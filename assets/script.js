var city = ""; 
var cityArray = [];
var currentDate = moment().format('MM/DD/YYYY');
var searchBtn = $(".searchBtn");
var APIKey = "bdf756b4f0f7eef1616eb378786101f4";

function getCurrentWeather (city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + ".png";
        $("#currentCity").html(response.name + "(" + currentDate + ")" + "<img src=" + iconurl + ">");

        $("#currentTemperature").text("Temperature: " + response.main.temperature + "°F");

        $("#currentWind").text("Wind: " + response.wind.speed + "MPH");

        $("#currentHumidity").text("Humidity: " + response.main.Humidity+ "%");

        getUVIndex(response.coord.lon, response.coord.lat);
    })

};

function getUVIndex(ln,lt) {
   var uvqUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
   $.ajax({
       url: uvqUrl,
       method: "GET",
   }).then(function (response) {
       $(currentUV).html("UV Index: " + response.value);
   });
};


function getForecast(city) {
    var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID" + APIKey;
    console.log(forcastUrl, city);
    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (response) {

        for (let i = 0; i < 5; i++){
            var weatherIcon = response.list[i].weather[0].icon;
            iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
            $("#date-" + (i+1)).html(moment().add(1, 'days').format('MM/DD/YYYY') + "<img src=" + iconurl + ">");
            $("#wind-" + (i+1)).text("Wind: " + response.list[i].wind.speed + "MPH");
            $("#humidity-" + (i+1)).text("Humidity: " + response.list[i].main.humidity + "%");
            $("#temp-" + (i+1)).text("Temp: " + response.list[i].main.temp+ "°F");
        };
    });
};

cityArray = JSON.parse(localStorage.getItem("city")) ?? [];
console.log(cityArray);

cityArray.forEach(loadCityButton);

function loadCityButton (city) {
    var cityButton = $("<button>");
    CityButton.text(city);
    $(".saved-cities").prepend(cityButton);
    cityButton.on("click", function (event){
        event.preventDefault();
        getCurrentWeather(city);
        getForecast(city);
    });
};

// saving it to the localStorage
function saveCity (city) {
    cityArray.push(city)
    localStorage.setItem("city", JSON.stringify(cityArray));
    var value = localStorage.getItem("city");
    $(".saved-cities").text("")
    cityArray.forEach(loadCityButton);
};


searchBtn.on("click", function (event){
    city = $("#searched-city").val().trim();
    event.preventDefault();
    getCurrentWeather(city);
    getForecast(city);
    saveCity(city);
});