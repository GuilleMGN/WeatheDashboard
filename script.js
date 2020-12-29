$(document).ready(function () {
  $("#search-button").click(function (e) {
    e.preventDefault();
    var cityName = $("#city-name").val().trim();
    console.log(cityName);
    searchWeather(cityName);
  });

  function searchWeather(name) {
    console.log(name);
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      name +
      "&units=metric&appid=ce20f5df05d025639d383fb109679b47";
    $.ajax({
      method: "GET",
      url: queryURL,
      dataType: "json",
      success: function (res) {
        console.log(res);
        // $("#forecast").remove();
        getForecast(res.coord.lat, res.coord.lon);
        $("#forecast").text("");
        var date = moment().format("dddd, MMM Do YYYY");
        var card = $("<div>").addClass("card m-1");
        var temperature = $("<div>").addClass("card-body").text(`Temperature: ${res.main.temp}°C`);
        var humidity = $("<div>").addClass("card-body").text(`Humidity: ${res.main.humidity}%`);
        var cardTitle = $("<h3>").addClass("card-title").text(`${res.name}, ${res.sys.country} (${date})`);
        temperature.prepend(cardTitle);
        humidity.prepend(temperature);
        card.append(humidity);
        $("#forecast").append(card);
        // $("#forecast").append(card.append(cardBody.prepend(cardTitle)));
        // $()
      },
    });
  }

  function getForecast(lat, lon) {
    var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=metric&appid=ce20f5df05d025639d383fb109679b47`;
    $.ajax({
      method: "GET",
      url: url2,
      dataType: "json",
      success: function (res) {
        console.log(res);
        for (var i = 1; i < 6; i++) {
          console.log(res.daily[i]);
        }
      },
    });
  }
});
