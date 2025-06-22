/* ------------ Background Color -------------- */
function theam() {
    const theme = localStorage.getItem("theme")
    if (theme == "night") {
        document.body.classList.add("dark");
    }
    else {
        document.body.classList.remove("dark");
    }
}

const eachMovie = JSON.parse(localStorage.getItem("eachMovie"));
console.log(eachMovie)
const apiKey = "5f891aebce4e73591c440b433f3041eb";

const Movieposter = document.getElementById("Movieposter");
const publicRating = document.getElementById("publicRating");
const castImages = document.getElementById("castImages");
const overview = document.getElementById("overview");
const director = document.getElementById("director");
const producer = document.getElementById("producer");
const music = document.getElementById("music");
const watchedMovie = document.getElementById("watchedMovie");
const loderPage = document.getElementById("loder");

const topMovieName = document.getElementById("topMovieName");
topMovieName.textContent = `${eachMovie.movieTitle}`;

/* ------------- Movie Details Function ------------- */

async function getMovieDetails() {
    try {
        loderPage.style.display = "flex";
        const castDetails = await getCast(eachMovie.movieId)
        ErrorMessage.style.display = "none";
        uploadCast(castDetails);
        uploadDetails(castDetails);
        uploadImages();
        ratingAndOverview();
        markWatched();
        duration();
        watchVideo();
    }
    catch (error) {
        ErrorMessage.style.display = "block";
        console.log(error);
    }


}
async function getCast(Movieid) {
    const cridteCast = `https://api.themoviedb.org/3/movie/${Movieid}/credits?api_key=${apiKey}`;
    const response = await fetch(cridteCast);
    if (!response.ok) {
        throw new Error("NetWork Issue");
    }
    return response.json()
}


/* ------------- Cast Images ------------- */
function uploadCast(castDetails) {
    castImages.innerHTML = "";
    loderPage.style.display = "none";
    for (let i = 0; i < castDetails.cast.length; i++) {
        let imgUrl;
        if (castDetails.cast[i].profile_path === null) {
            imgUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXyq66RINPZ5mByRQDyYd7INUOstVTR23ROQ&s`
        }
        else {
            imgUrl = `http://image.tmdb.org/t/p/w500/${castDetails.cast[i].profile_path}`
        }

        castImages.innerHTML += `
                <figure class = "fadeUp">
                    <img src="${imgUrl}" alt="" >
                    <figcaption>${castDetails.cast[i].original_name}</figcaption>
               </figure> `
    }
}

/* --------------- Uplode Director, Producer,  Music Composer Names ---------------*/
function uploadDetails(castDetails) {
    for (let i = 0; i < castDetails.crew.length; i++) {
        if (castDetails.crew[i].job === "Director") {
            director.innerHTML = `Director <br> <span>${castDetails.crew[i].original_name} </span> `
        }
        if (castDetails.crew[i].job === "Producer") {
            producer.innerHTML = `Producer <br> <span>${castDetails.crew[i].original_name}</span>  `
        }
        if (castDetails.crew[i].job === "Original Music Composer") {
            music.innerHTML = `Music  <br> <span>${castDetails.crew[i].original_name}</span> `
        }
    }
}

/* ------------- Movie Poster ------------- */
function uploadImages() {
    const imgUrl = `http://image.tmdb.org/t/p/w500/${eachMovie.posterPath}`
    Movieposter.src = imgUrl;
    Movieposter.alt = eachMovie.movieTitle;
}


/* ------------- Movie mark as watched  ------------- */
let allWatchedMovies = []
let savedMovies = JSON.parse(localStorage.getItem("allWatchedMovies"))
if (savedMovies !== null) {

    savedMovies.forEach(event => {
        allWatchedMovies.push(event)
    });
}

/* -------------Update Rating and Overview------------- */
function ratingAndOverview() {
    publicRating.innerHTML = `Rating <br> <span> ${eachMovie.rating}/10</span>`
    overview.textContent = eachMovie.overview
}

/* ------------- mark as Watched  ------------- */
function markWatched() {
    const checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.value = "unChecked"
    watchedMovie.innerHTML = `Mark as Watched <br>`
    watchedMovie.appendChild(checkBox)

    if (eachMovie.isWatched === true) {
        checkBox.checked = true
        checkBox.value = "checked"
    }

    checkBox.onclick = () => {
        if (checkBox.value === "unChecked") {
            checkBox.value = "checked"
            addToWatchList(eachMovie)
        }
        else {
            checkBox.value = "unChecked"
            removeWatchList(eachMovie)
        }
    }

}

/* ------------ Add to Watch Llist ------------ */
function addToWatchList(eachMovie) {
    allWatchedMovies.push(eachMovie)
    eachMovie.isWatched = true
    updateLocalStorage()

}
/* ------------ Remove from Watch Llist ------------ */
function removeWatchList(eachMovie) {
    allWatchedMovies = allWatchedMovies.filter((event) => {
        return event.movieId !== eachMovie.movieId
    })
    eachMovie.isWatched = false
    updateLocalStorage()
}

/* ------------ Update Local Storage For watch list movies ------------ */
function updateLocalStorage() {
    // console.log(allWatchedMovies)
    localStorage.setItem("allWatchedMovies", JSON.stringify(allWatchedMovies))

}

/* ------------- Movie Duration ------------- */
async function duration() {
    const timeduration = `https://api.themoviedb.org/3/movie/${eachMovie.movieId}?api_key=${apiKey}`
    const durationData = await getDurationDetails(timeduration);
    const Timeduration = document.getElementById("timeduration");
    const totalTime = durationData.runtime;
    const hrs = (totalTime / 60).toFixed(0);
    const min = (totalTime % 60).toFixed(0);
    Timeduration.innerHTML = `Time Duration <br> <span>${hrs}h ${min}m</span>`;
}

/* ------------- GetDuration ------------- */
async function getDurationDetails(timeduration) {
    const response = await fetch(timeduration);
    return response.json()
}


/* ------------- youtubr video ------------- */
async function watchVideo() {
    try {
        const data = await getData()
        console.log(data.results);
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].type === "Trailer" && data.results[i].site === "YouTube") {
                console.log(i);
                console.log(data.results[i]['id']);
                const video = document.getElementById("Movievideo");
                video.src = `https://www.youtube.com/embed/${data.results[i].key}?rel=0&modestbranding=1&&showinfo=0`
                break
            }
        }
    }
    catch (error) {
        console.error("Error");
    }

}


async function getData() {
    const movieVideoUrl = `https://api.themoviedb.org/3/movie/${eachMovie.movieId}/videos?api_key=${apiKey}`;
    const response = await fetch(movieVideoUrl);
    if (!response.ok) {
        throw new Error("Movie Not Found")
    }

    return response.json()
}

window.addEventListener("load", () => {
    theam()
    getMovieDetails()
})