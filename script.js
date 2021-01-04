$(document).ready(function () {
  // Event listener for Search Button
  $("#search-button").click(function (e) {
    e.preventDefault();
    var cityName = $("#city-name").val().trim().toLowerCase();
    searchWeather(cityName);
  });
  // Event listener for Clear Button
  $("#clear-button").click(function (e) {
    e.preventDefault();
    history = [];
    window.localStorage.setItem("history", JSON.stringify(history));
    $("#list .list-group-item").remove();
    $("#city-name").val("");
  })


  function makeRow(text) {

    var li = $("<li>").addClass("list-group-item").text(text).css('textTransform', 'capitalize');
    console.log(li);
    $("#list").prepend(li);
    li.click(function () {
      li.text(text.toLowerCase());
      searchWeather(li.text());
      li.text(text).css('textTransform', 'capitalize');
    });
  }

  function searchWeather(name) {
    console.log(name);
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&units=metric&appid=ce20f5df05d025639d383fb109679b47";
    $.ajax({
      method: "GET",
      url: queryURL,
      dataType: "json",
      success: function (res) {
        console.log(res);
        getForecast(res.coord.lat, res.coord.lon);
        getUV(res.coord.lat, res.coord.lon);
        $("#forecast").text("");
        $("#city-name").val("");
        $("#feedback").text("");
        if (history.indexOf(name) === -1) {
          history.push(name);
          window.localStorage.setItem("history", JSON.stringify(history));
          console.log(localStorage);
          makeRow(name);
        }
        var date = moment.unix(res.dt).format("MM/DD/YYYY");
        var card = $("<div>").addClass("card m-1");
        var cardTitle = $("<h3>").addClass("card-title").text(`${res.name}, ${res.sys.country} (${date}) `);
        var icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + res.weather[0].icon + ".png");
        var temperature = $("<div>").addClass("card-body").text(`Temperature: ${res.main.temp}°C`);
        var humidity = $("<div>").addClass("card-body").text(`Humidity: ${res.main.humidity}%`);
        var windSpeed = $("<div>").addClass("card-body").text(`Wind Speed: ${res.wind.speed} km/h`);
        var uvindex = $("<div>").addClass("card-body").text("UV Index: ").attr("id", "uv-index-div");
        var fiveDays = $("<h3>").text("");
        fiveDays.text("5-Day Forecast: ");
        $("#forecast").append(card);
        $("#forecast").append(cardTitle);
        cardTitle.append(icon);
        $("#forecast").append(temperature);
        $("#forecast").append(humidity);
        $("#forecast").append(windSpeed);
        $("#forecast").append(uvindex);
        $("#forecast").append(fiveDays);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        $("#feedback").text("City not found. Try again. ");
      }
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
        // For Loop to gather weather information for the next 5 days
        for (var i = 1; i < 6; i++) {
          console.log(res.daily[i]);
          // Clears anything before
          $(`#day${[i]}`).text("");
          $(`#day${[i]}`).addClass("days bg-primary");
          var cardTitle = $("<h5>").addClass("card-title").text(moment.unix(res.daily[i].dt).format("MM/DD/YYYY"));
          var icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + res.daily[i].weather[0].icon + ".png");
          var temperature = $("<div>").addClass("card-text").text(`Temperature: ${res.daily[i].temp.day}°C`);
          var humidity = $("<div>").addClass("card-text").text(`Humidity: ${res.daily[i].humidity}%`);
          $(`#day${[i]}`).append(cardTitle);
          $(`#day${[i]}`).append(icon);
          $(`#day${[i]}`).append(temperature);
          $(`#day${[i]}`).append(humidity);
        }
      },
    });
  }

  function getUV(lat, lon) {
    var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=metric&appid=ce20f5df05d025639d383fb109679b47`;
    $.ajax({
      method: "GET",
      url: url2,
      dataType: "json",
      success: function (res) {
        console.log(res.daily[0].uvi);
        var button = $("<button>").addClass("btn").text(res.daily[0].uvi);
        if (res.daily[0].uvi < 3) {
          button.addClass("btn-success");
        }
        else if (res.daily[0].uvi > 7) {
          button.addClass("btn-danger");
        }
        else {
          button.addClass("btn-warning");
        }
        $("#forecast #uv-index-div").append(button);
      }
    })
  }
  var history = JSON.parse(localStorage.getItem("history")) || [];
  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
    console.log(history);
  }
});
