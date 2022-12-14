var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container"); //variable to hold the repos in a div container
var repoSearchTerm = document.querySelector("#repo-search-term"); // variable to store the repo search term that was entered
var languageButtonsEl = document.querySelector("#language-buttons");



var formSubmitHandler = function(event) {
    event.preventDefault();

    //get value from input element
    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }

};



// Function to handle language button clicks
var buttonClickHandler = function(event) {
    // variable to store language data 
    var language = event.target.getAttribute("data-language");
    console.log();

    // call get Featured Repos function and pass value received from data-language
    if (language) {
        getFeaturedRepos(language);

        //clear old content - this will still come first as getFeaturedRepos is asynchronous
        repoContainerEl.textContent = "";
    }
};

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl).then(function(response) {
        //request was successful - check to see if there is a user as searched
        if (response.ok) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
    } else {
        alert("Error: GitHub User Not Found");
    }
    })
    .catch(function(error) {
        //notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub");
    });
};

// function to get featured Repos based on language type
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
   
   //format fetch response even if successful
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            //Method to extract JSON from response to parse response and log data
            response.json().then(function(data){
                console.log(data)
                // pass data.items and language paramter values into displayRepos function
                displayRepos(data.items, language);
            });
        } else {
            //add error handling for invalid response
            alert("Error:" + response.statusText);
        }
    });
};



var displayRepos = function(repos, searchTerm) {
    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    console.log(repos);
    console.log(searchTerm);

    //loop over repos
    for (var i=0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count >0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container 
        repoEl.appendChild(statusEl);

        //append container to the DOM
        repoContainerEl.appendChild(repoEl);    
    }
};





 userFormEl.addEventListener("submit", formSubmitHandler);

//click event listener to language buttons to call buttonClickHandler Function
languageButtonsEl.addEventListener("click", buttonClickHandler);