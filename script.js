$(document).ready(function () {
  $("#search-button").click(function (e) {
    e.preventDefault();
    var cityName = $("#city-name").val().trim();
    searchWeather(cityName);
  });

  // var listNum = [];
  // var x = 0;
  // console.log(listNum);

  // for (var i = 0; i < listNum.length; i++) {
  //   $("#listNum" + [i]).click(function () {
  //     console.log("This works");
  //     if ($("#listNum" + [i]) == $(`#listNum${x}`)) {
  //       console.log($(`#listNum${x}`));
  //       searchWeather($(`#listNum${x}`));
  //     }
  //     // var listCity = $("#listNum" + [i]).text();

  //   });
  // }

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item").text(text);
    $("#list").prepend(li);
  }
  // $("#list").click(function(e) {
  //   console.log("This works");
  //   var listCity = $("#list").text();
  //   console.log(listCity);
  //   searchWeather(listCity);
  // });

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
        var date = moment.unix(res.dt).format("dddd, MMM Do YYYY");

        if (history.indexOf(name) === -1) {
          history.push(name);
          window.localStorage.setItem("history", JSON.stringify(history));
          console.log(localStorage);
          makeRow(name);
        }

        var card = $("<div>").addClass("card m-1");
        var cardTitle = $("<h3>").addClass("card-title").text(`${res.name}, ${res.sys.country} (${date})`);
        var temperature = $("<div>").addClass("card-body").text(`Temperature: ${res.main.temp}°C`);
        var humidity = $("<div>").addClass("card-body").text(`Humidity: ${res.main.humidity}%`);
        var windSpeed = $("<div>").addClass("card-body").text(`Wind Speed: ${res.wind.speed} m/s`);
        var icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + res.weather[0].icon + ".png");
        // var list = $("<li>").addClass("list-group-item").text(`${res.name}`);
        // for (var i = 0; i < history.length; i++) {
        //   list = $("<li>").addClass("list-group-item").text(`${history[i]}`);
        // }
        // list.attr("id", `listNum${x}`);
        // x++;
        // listNum.push(res.name);
        // console.log(listNum);

        // var uvIndex = $("<div>").addClass("card-body").text(`UV Index: ${res.}`)
        var fiveDays = $("<h3>").text("");
        fiveDays.text("5-Day Forecast: ");
        $("#forecast").append(card);
        $("#forecast").append(cardTitle);
        $("#forecast").append(temperature);
        $("#forecast").append(humidity);
        $("#forecast").append(windSpeed);
        $("#forecast").append(fiveDays);
        
      },
      // error: function () {
      //   $("forecast").text("Error! No cities found by that name. Try again. ");
      // }
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
          var cardTitle = $("<h5>").addClass("card-title").text(moment.unix(res.daily[i].dt).format("dddd, MMM Do YYYY"));
          var temperature = $("<div>").addClass("card-text").text(`Temperature: ${res.daily[i].temp.day}°C`);
          var humidity = $("<div>").addClass("card-text").text(`Humidity: ${res.daily[i].humidity}%`);
          var icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + res.daily[i].weather[0].icon + ".png");
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
        $("#forecast .card-title").append(button);
      }
    })
  }
  var history = JSON.parse(localStorage.getItem("history")) || [];
  for (var i = 0; i < history.length; i++) {
      makeRow(history[i]);
      console.log(history);
    }

});
