const api = "api_key=468cc7702ff6014aa05af67c2f45f690";
const req = "https://api.themoviedb.org/3";
const api_url = req + '/discover/movie?sort_by=popularity.desc&' + api;
const img_url = "https://image.tmdb.org/t/p/w500";
const search_url = req + '/search/movie?' + api;
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");


let movies = [];
if (localStorage.getItem("movies")) {
    movies = JSON.parse(localStorage.getItem("movies"));
    showMovie(movies);
} else {
    getMovie(api_url);
}


function getMovie(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        movies = data.results;
        localStorage.setItem("movies", JSON.stringify(movies));
        showMovie(movies);
        
    });
}


function showMovie(data) {
    main.innerHTML = "";
    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id , release_date } = movie;
        const movie1 = document.createElement('div');
        movie1.classList.add('movie');
        movie1.innerHTML = `
    <img src="${img_url + poster_path}" alt="${title}">
    <div class="movie-info">
        <h3>${title}</h3>
        <span class="rat">Rating:${vote_average}</span>
        
    </div>
    <div class="overveiw">
    <div class="date"><h5>Released Date: ${release_date}</h5></div> 
    <h3>Overveiw</h3>
${overview}
<div className="button">
<button class="trailer" id="${id}" > Watch Trailer</button>
</div>

    </div>
     `
        main.appendChild(movie1);
        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie);
        })
    });
}

const overlayContent=document.getElementById('overlay-content');
function openNav(movie) {
    let id = movie.id;
    fetch(req + '/movie/' + id + '/videos?' + api).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if (videoData) {
            document.getElementById("myNav").style.width = "100%";
            if(videoData.results.length>0)
            {
                var embed=[];
                videoData.results.forEach(video=>{
                    let {name ,key , site} = video;
                    if(site=='YouTube')
                    {     
                        embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        `)
                    }
                })
                overlayContent.innerHTML=embed.join('')
            }
            else
            {
                   overlayContent.innerHTML=`<h3 class="no-result">No Results Found </h3>`
            }
        }
    })

}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function getcolor(vote) {
    if (vote >= 8) {
        return 'green'
    }
    else if (vote >= 5) {
        return 'orange'
    }
    else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovie(search_url + '&query=' + searchTerm);
    }
});

