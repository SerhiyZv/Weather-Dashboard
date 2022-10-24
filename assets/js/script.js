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

const previousSearch = JSON.parse(localStorage.getItem("searches"));

if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        }else {
            localCityArray.push(previousSearch[i]);
        }
    }
}

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
    console.log(localCityArray);

    if (localCityArray.includes(city)) {
        return;
    }else {
        localCityArray.push(city);

        localStorage.setItem("searches", JSON.stringify(localCityArray));

        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
    const apiUrlCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ca3339aa147dcdad470993efa11f2132";
    
    
    fetch(apiUrlCoords)
    .then(function (response) {
        if(!response.ok) {
            currentConditionsUl.innerHTML = "";
            currentConditionsH3.textContent = "Try again!";
            const errorText = document.createElement("li");
            errorText.textContent = "City not found.";
            currentConditionsUl.appendChild(errorText);
            throw Error(response.statusText);
        } else {
            response.json()
        .then(function (data) {
            console.log(data)

            const cityName = data.name;

            const oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=ca3339aa147dcdad470993efa11f2132";
            fetch(oneCallUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json()
                    .then(function (data){
                        console.log(data);

                        const icon = ("<img src='http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png'>");
                        currentConditionsH3.innerHTML = cityName + " (" + moment().format("MM/DD/YYYY") + ") " + icon;
        
                const liArray = [];

                currentConditionsUl.innerHTML = ""

                for (let i =0; i < 4; i++) {
                    liArray.push(document.createElement("li"));
                }

                liArray[0].innerHTML = "Temperature: " + data.current.temp + " &deg;F";
                liArray[1].textContent = "Humidity: " + data.current.humidity + "%";
                liArray[2].textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
                liArray[3].textContent = "UV Index: " + data.current.uvi;

                liArray.forEach(li => {
                    currentConditionsUl.append(li);
                })

                updateLocalStorage(cityName);
            })
        }
    })
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


