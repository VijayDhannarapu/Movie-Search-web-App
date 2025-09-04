let allWatchedMovies = JSON.parse(localStorage.getItem("allWatchedMovies"));
const movieNameTag = document.getElementById("movieName");  
const bgButton = document.getElementById("bgChangeBtn");
let movieName;

const ErrorMessage = document.getElementById("ErrorMessage");
const loderPage = document.getElementById("loder");
const apiKey = "-------- API KEY ----------";
const userSearch = document.getElementById("search");
const moviePoster = document.getElementById("Movieposter");


/* --------------- Change BackGround --------------- */

function bgChange() {
    document.body.classList.toggle("dark");
    if (bgButton.value === "day") {
        bgButton.value = "night";
        bgButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;

    }
    else {
        bgButton.value = "day";
        bgButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
}


/* --------------- Top Rated Movies  Function--------------- */
async function discover() {
    try {
        showMovies.innerHTML = "";
        const discoverApi = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;// top rated Api url
        const discoverData = await getData(discoverApi);
        updateMovieName("Top Rated Movies");
        checkMovie(discoverData) // It will check , is there top rated movies and display
    }
    catch (error) {
        loderPage.style.display = "none";
        ErrorMessage.style.display = "block";
    }

}

/* ---------------Check User Is searched or not--------------- */
userSearch.addEventListener("keypress", (keys) => {
    if (keys.key === 'Enter') {
        const showMovies = document.getElementById("showMovies");
        showMovies.innerHTML = "";
        getUserInput()
    }
})


/* --------------- Taking User Input Getting Values--------------- */
async function getUserInput() {
    try {
        movieName = userSearch.value;
        const apiurl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;
        loderPage.style.display = "flex";
        const data = await getData(apiurl);
        updateMovieName(`${userSearch.value} Movie`);
        checkMovie(data)
    }
    catch (error) {
        console.log(error);
        loderPage.style.display = "none";
        ErrorMessage.style.display = "block";
    }

}


/* ------------- Update User Searched Movie Name ---------------- */
function updateMovieName(mName){
    movieNameTag.textContent = `${mName}`;
}

/* --------------- Check Movies  --------------- */
function checkMovie(data) {
    loderPage.style.display = "none";
    if (data.results.length === 0) {
        userSearch.value = '';
        ErrorMessage.textContent = "Movie Not Found";
        ErrorMessage.style.display = "block";
    }
    else {
        ErrorMessage.style.display = "none";
    }

    getDetails(data)
}

/* --------------- Taking Movies and Giving Movie Data --------------- */
async function getData(apiurl) {
    const response = await fetch(apiurl);
    if (!response.ok) {
        window.alert("Not Found Please! check the Movie name");
        throw new Error("NetWork Issue , Please check your NetWork");
    }
    return response.json();
}


/* --------------- Showing ALl the Movies on page--------------- */
async function getDetails(data) {
    for (let i = 0; i < data.results.length; i++) {
        const eachMovie = {
            "movieId": data.results[i].id,
            "movieTitle": data.results[i].title,
            "rating": data.results[i].vote_average,
            "releaseDate": data.results[i].release_date,
            "posterPath": data.results[i].poster_path,
            "overview": data.results[i].overview,
            "isWatched": false,
            "movieIndex": i
        }

        checkMovie(eachMovie.movieId) /*  Checking Movie is added in Watched List , if it is added isWatched is true else false  */
        function checkMovie(id) {
            if (allWatchedMovies !== null) {
                for (let i = 0; i < allWatchedMovies.length; i++) {
                    if (allWatchedMovies[i]["movieId"] === id) {
                        eachMovie.isWatched = true
                    }
                }
            }
            uploadData(eachMovie) // Upload movie in html page 
        }
    }
}


/* --------------- upload data on html page --------------- */

function uploadData(eachMovie) {

    localStorage.setItem("eachmovie", JSON.stringify(eachMovie))

    const figure = document.createElement("figure") // creating figure element
    let figureCaption1 = document.createElement("figcaption") // create figureCaption element for Movie name
    let figureCaption2 = document.createElement("figcaption")  // create figureCaption element for  Rating
    const movieImage = document.createElement("img") // create image element

    figure.id = "fig" // figure id
    let ancor = document.createElement("a") // ancor tag
    ancor.href = `secondPage.html?movieId=${eachMovie.movieId}`; // add second page link
    movieImage.id = "posterImage" // image id
    figureCaption1.id = "MovieName" // id of figureCaption1
    figureCaption2.id = "Rating" // id of figureCaption2

    const imgUrl = `http://image.tmdb.org/t/p/w500/${eachMovie.posterPath}` // image api link
    movieImage.src = imgUrl
    figureCaption1.textContent = `Movie: ${eachMovie.movieTitle}`
    figureCaption2.textContent = `Rating: ${eachMovie.rating}`

    ancor.append(movieImage)
    figure.append(ancor)
    figure.append(figureCaption1)
    figure.append(figureCaption2)
    showMovies.appendChild(figure)

    figure.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.setItem("eachMovie", JSON.stringify(eachMovie))
        localStorage.setItem("theme", bgButton.value)
        localStorage.setItem("allWatchedMovies", JSON.stringify(allWatchedMovies))
        window.location.href = "secondPage.html";

    })
}


/* --------------- Window Load --------------- */
window.addEventListener("load", () => {
    
    displayMovies()
    //It is background Color
    const savedTheam = localStorage.getItem("theme")
    bgButton.value = savedTheam
    if (savedTheam === "night") {
        document.body.classList.add("dark")
    }
    else {
        document.body.classList.remove("dark")
    }

})

// If user search was empty it call the topRated movies else user searched movie
function displayMovies() {
    showMovies.innerHTML = ""
    if (userSearch.value === '') {
        discover()
    }
    else {
        getUserInput()
    }
}

/* --------------- Your Watched List Movies --------------- */
function yourWatchedMovies() {
    showMovies.innerHTML = ""
    if (allWatchedMovies === null || allWatchedMovies.length <= 0) {
        ErrorMessage.textContent = "No movies Found"
        ErrorMessage.style.display = "block"
    }
    else {
        allWatchedMovies.forEach(element => {
            uploadData(element)
        });
    }
}