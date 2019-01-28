// NODE MODULES NEEDED FOR MY APP
require("dotenv").config();
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs")
var spotify = new Spotify(keys.spotify);

// MY INPUTS IN NODE
var find = process.argv[2];
var search = process.argv.slice(3).join(' ');

// MOVIE API FUNCTION
function movieAPI(search) {  
    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl)
    .then(function(response){ 
        console.log("--------------------------");
        console.log("Title: " + response.data.Title);
        console.log("Release year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("--------------------------");
    });
}

// SPOTIFY API FUNCTION
function spotifyAPI(search) {
    
    spotify
      .search({ type: 'track', query: search, limit: 1 })
      .then(function(response) {
        for(let i = 0; i < 1; i++){
            console.log("--------------------------");
            console.log("Artist: " + response.tracks.items[i].album.artists[0].name);
            console.log("Song: " + response.tracks.items[i].name);
            console.log("Song Preview: " + response.tracks.items[i].preview_url);
            console.log("Album: " + response.tracks.items[i].album.name);
            console.log("--------------------------");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
}

// BANDS API FUNCTION
function bandsAPI(search){
    var bandsquery = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";

    axios.get(bandsquery)
    .then(function(response){ 
        // console.log(response.data);
        for(let i = 0; i < 1; i++){
            console.log("--------------------------");
            console.log(response.data[i].lineup);
            console.log("Venue Name: " + response.data[i].venue.name);
            console.log("Country: " + response.data[i].venue.country)
            console.log("City: " + response.data[i].venue.city)
            console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
            console.log("--------------------------");
        }
    });
}

// DO WHAT IS SAYS FUNCTION
function readtxt() {
    
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error){return console.log(error);
        }
        var fileSearch = data.split(",");
        find = fileSearch[0];
        search = fileSearch[1];
        start(find, search);
    })  
}

// SWITCH STATEMENT TO CHOOSE FROM MY API'S 
// WRAPPED IN A FUNCTION FOR READIND RANDOM TXT
function start(find, search) {
    
    switch (find) {
        case "concert-this":
        bandsAPI(search);
            break;
        case "spotify-this-song":
        spotifyAPI(search)
            break;
        case "movie-this":
        movieAPI(search)
            break;
        case "do-what-it-says":
        readtxt();
            break;
        default:
            break;
    }
}

start(find, search)