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
    const apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ca3339aa147dcdad470993efa11f2132";
    const apiUrlFuture =  "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=ca3339aa147dcdad470993efa11f2132";
    fetch(apiUrlCurrent)
    .then(function (response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                updateLocalStorage(data.name);
            })
        }else {
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


