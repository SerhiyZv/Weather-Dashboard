
// Variables Declaration
const cityNameInput = document.querySelector("#city-name");
const searchForm = document.querySelector("#search-form");
const currentConditionsUl = document.querySelector("#current-forecast #conditions");
const currentConditionsH3 = document.querySelector("#current-forecast h3");
const previousSearches = document.querySelector("#previous-searches");
const previousSearchContainer = document.querySelector("#previous-searches .card-body");
const dailyCardContainer = document.querySelector("#daily-forecast");
const fiveDayHeader = document.querySelector("#five-day");

// declaration Local City Array
const localCityArray = [];

//Pull Data previous searches form Local Storage
let previousSearch = JSON.parse(localStorage.getItem("searches"));

//Revome any empty results stores in Local Storage
if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        } else {
            //Puss Local City array to previous search
            localCityArray.push(previousSearch[i]);
        }
    }
}

const updateSearchHistory = () => {
    //Get Items from local storage to previous results 
    previousSearch = JSON.parse(localStorage.getItem("searches"));

    //Declaration previous search buttons under the function
    const existingButtons = document.querySelectorAll("#previous-searches button");

    if (previousSearch !== null) {
        existingButtons.forEach(button => {
            //Verification that previous search buttons are exist and do not repeated
            for (let i = 0; i < previousSearch.length; i++)
            if (button.dataset.city.includes(previousSearch[i])) {
                previousSearch.splice(i, i + 1);
            }
        })

        for (let i = 0; i < previousSearch.length; i++) {
            const searchButton = document.createElement("button");
            searchButton.classList.add("m-2", "btn", "btn-secondary");
            //Set citu name into the button for the event listener
            searchButton.dataset.city = previousSearch[i];
            searchButton.textContent = previousSearch[i];
            searchButton.addEventListener("click", (event) => {
                // Reference city to Call API
                callOpenWeather(event.target.dataset.city);
            })
            previousSearchContainer.appendChild(searchButton); 
        }
    }
}  


const updateLocalStorage = (city) => {
    //Verification that searched city is not pushed into array if city is already searched
    if (localCityArray.includes(city)) {
        return;
    } else {
        localCityArray.push(city);

        //Store the results fo next user visits
        localStorage.setItem("searches", JSON.stringify(localCityArray));

        //Add new search to previous search buttons
        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
    // Declaration for  initial API call to get latitude and longitude of searches city
    const apiUrlCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=0656324568a33303c80afd015f0c27f8";
    
    //Fetch to get latitude and longitude
    fetch(apiUrlCoords)
    .then(function (response) {
        //Setting the messages if city is not found
        if (!response.ok) {
            currentConditionsUl.innerHTML = "";
            currentConditionsH3.textContent = "Try again!";
            const errorText = document.createElement("li");
            errorText.textContent = "City not found.";
            currentConditionsUl.appendChild(errorText);
            dailyCardContainer.innerHTML = "";
            //Adding hidden class if search result get error
            fiveDayHeader.classList.add("hidden");
        } else {
            // set API  into JSON object
            response.json()
        .then(function (data) {

            // Set CityName to Variable
            const cityName = data.name;

            //Declaration of URL for oneCall API from lat and lng of previous Call
            const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=0656324568a33303c80afd015f0c27f8`;
            
            // Fetch and get data for current and daily weather
            fetch(oneCallUrl)
            .then(function (response) {
                if (response.ok) {
                    //Convert data to JSON
                    response.json()
            .then(function (data) {
                //Icon for weather status
                const icon = ("<img src='https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png' alt='Weather icon'>");

                // Display city, weather icon and date
                currentConditionsH3.innerHTML = cityName + " (" + moment().format("MM/DD/YYYY") + ") " + icon;
        
                const liArray = [];

                //clear existing list from previous searches
                currentConditionsUl.innerHTML = "";

                //Four list items creation to display current weather
                for (let i = 0; i < 4; i++) {
                    const li = document.createElement("li");
                    li.classList.add("mb-2");
                    liArray.push(li);
                }

                //Display weather data for current date
                liArray[0].innerHTML = "Temperature: " + Math.floor(data.current.temp) + " &deg;C" ;
                liArray[1].textContent = "Humidity: " + data.current.humidity + "%";
                liArray[2].textContent = "Wind Speed: " + Math.floor(data.current.wind_speed) + " MPH";
                
                const uvi = Math.floor(data.current.uvi);

                // Display UVI index in the button
                if (uvi <= 2) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-primary uv">${uvi}</button>`;
                } else if (uvi > 2 && uvi <= 5) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-success uv">${uvi}</button>`;
                } else if (uvi > 5 && uvi <= 8) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-warning uv">${uvi}</button>`;
                } else {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-danger uv">${uvi}</button>`;
                }

                //add each updated list item to specified ul
                liArray.forEach(li => {
                    currentConditionsUl.append(li);
                })


                let dailyArray = [];

                //clear existing cards from previous searches
                dailyCardContainer.innerHTML = "";

                //Loop to create card for 5 days forecast
                for (let i = 0; i < 5; i++) {
                    const dailyCard = document.createElement("div");
                    //Create cards and populate forecast in it. 
                    dailyCard.innerHTML = `
                    <div class="p-2 m-2 card bg-primary text-white">
                        <h5>${moment().add(i + 1, "days").format("MM/DD/YYYY")}</h5>
                        <ul id="conditions">
                            <li><img src='https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png' alt="Weather icon" class="mx-auto"></li>
                            <li>Temp: ${Math.floor(data.daily[i].temp.day)} &deg;C</li>
                            <li>Humidity: ${data.daily[i].humidity}%</li>
                        </ul>
                    </div>`;
                    
                    //Push crd to DailyArray 
                    dailyArray.push(dailyCard);
                }

                // Removes .hidden class to now display in case previous search resulted in error
                fiveDayHeader.classList.remove("hidden");

                //Add cards and store in dailyArray to container
                dailyArray.forEach(card => {
                    dailyCardContainer.appendChild(card);
                })

                updateLocalStorage(cityName);
            })
        }
        })
    })
}
})   
}

// Adds event listener to search form
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Removes white space from both ends of search term
    let searchValue = cityNameInput.value.trim("");

    // Handler if user submits form with blank field
    if (searchValue === "") {
        currentConditionsH3.textContent = "Please enter a city!";
        currentConditionsUl.innerHTML = "";
        dailyCardContainer.innerHTML = "";
        // Hides 5-day forecast if API won't be called
        fiveDayHeader.classList.add("hidden");
    } else {
        // Calls API to fetch provided value
        callOpenWeather(searchValue);
        // Clears text in input
        cityNameInput.value = "";
    }
});

// Called at run time to populate search buttons for previous searches in localStorage
updateSearchHistory();

//Default city to display
callOpenWeather("Toronto");


