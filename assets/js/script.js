// var APIKey = "ca3339aa147dcdad470993efa11f2132"; // default key
// var city;
// var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
const cityNameInput = document.querySelector("#city-name");
const searchForm = document.querySelector("#search-form");
const currentConditionsUl = document.querySelector("#current-weather #conditions");
const currentConditionsH3 = document.querySelector("#current-weather h3")
const previousSearches = document.querySelector("#previous-searches");

let searchValue = "";

const localCityArray = [];

const updateSearchHistory = () => {
    const previousSearch = JSON.parse(localStorage.getItem("searches"));

    if (previousSearch === null) {
        previousSearches.classList.add("hidden");
    }else {
        previousSearches.classList.remove("hidden");
        const existingButtons = document.querySelectorAll("#previous-searches button");

        if(existingButtons.length === 0) {
            for (let i = 0; i < previousSearch.length; i++) {
                const searchButton = document.createElement("button");
                searchButton.classList.add("btn");
                searchButton.dataset.city = previousSearch[i];
                searchButton.textContent = previousSearch[i];
                searchButton.addEventListener("click", (event) => {
                    callOpenWeather(event.target.dataset.city);
                })
                document.querySelector("#previous-searches .card-body").appendChild(searchButton);
            }
        }else {
            existingButtons.forEach(button => {
                for (let i = 0; i < previousSearch.length; i++)
                if (button.dataset.city.includes(previousSearch[i])) {
                    previousSearch.splice(i, i +1);
                }
            })
            for (let i = 0; i < previousSearch.length; i++) {
                const searchButton = document.createElement("button");
                searchButton.classList.add("btn");
                searchButton.dataset.city = previousSearch[i];
                searchButton.textContent = previousSearch[i];
                searchButton.addEventListener("click", (event) => {
                    callOpenWeather(event.target.dataset.city);
                })
                document.querySelector("#previous-searches .card-body").appendChild(searchButton);
            }
        }
    }    
}

const updateLocalStorage = (city) => {
    if (localCityArray.includes(city)) {
        return;
    }else {
        localCityArray.push(city);

        localStorage.setItem("searches", JSON.stringify(localCityArray));

        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
    const apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ca3339aa147dcdad470993efa11f2132";
    const apiUrlFuture =  "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=ca3339aa147dcdad470993efa11f2132";
    fetch(apiUrlCurrent)
    .then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(data);

                let uvIndex = "";

                const oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=0656324568a33303c80afd015f0c27f8"

                fetch(oneCallUrl)
                .then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            uvIndex = data;
                        })
                    }
                })

                console.log(uvIndex);

                const icon = ("<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>");
                currentConditionsH3.innerHTML = data.name + " (" + moment().format("MM/DD/YYY") + ")" + icon;
                const liArray = [];

                currentConditionsUl.innerHTML = "";

                for (let i =0; i <4; i++) {
                    liArray.push(document.createElement("li"));
                }

                liArray[0].innerHTML = "Temperature: " + data.main.temp + " &deg;F";
                liArray[1].textContent = "Humidity: " + data.main.humidity + "%";
                liArray[2].textContent = "Wind Speed: " + data.wind.speed + " MPH";
                liArray[3].textContent = "UV Index: " + uvIndex;

                liArray.forEach(li => {
                    currentConditionsUl.append(li);
                })

                updateLocalStorage(data.name);
            })
        }else {
            currentConditionsUl.innerHTML = "";
            currentConditionsH3.textContent = "Try again!";
            const errorText = document.createElement("li");
            errorText.textContent = "City not found.";
            currentConditionsUl.appendChild(errorText);
        }
    })
    fetch(apiUrlFuture)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            })
        }
    })
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    searchValue = cityNameInput.value.trim("");
    if (searchValue === "") {
        currentConditionsH3.textContent = "Please enter a city!";
    }else {
        callOpenWeather(searchValue);
        cityNameInput.value = "";
    }
});

updateSearchHistory();

//Default city to display
callOpenWeather("Toronto");


