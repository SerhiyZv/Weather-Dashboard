var APIKey = "ca3339aa147dcdad470993efa11f2132"; // default key
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
const citySearchInput = document.querySelector("#searchcity");
const searchForm = document.querySelector("#search");
const previousSearches = document.querySelector("#previous-searches");

const localCityArray = [];

let previousSearch = JSON.parse(localStorage.getItem("searches"));

if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        }else {
            localCityArray.push(previousSearch[i]);
        }
    }
}
