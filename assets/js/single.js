var issueContainerEl = document.querySelector("#issues-container"); //Variable storing Issues/pull requests and linking to ID of issues-container
var limitWarningEl = document.querySelector("#limit-warning"); // Variable storing issue limit warning 
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function() {
     //assign query string to a variable
     var queryString =  document.location.search;
     var repoName = queryString.split("=")[1];

    // conditional statement to check for valid user input
    if(repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    else {
        //if no repo was given, return to homepage
        document.location.replace("./index.html");
    }
   
    //console.log(repoName);
    getRepoIssues(repoName);
    
    repoNameEl.textContent = repoName;

}


var getRepoIssues = function(repo) {
   

    // variable to hold search for repo issues
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                //pass response data to DOM function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("link")){
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });

    var displayWarning = function(repo) {
        // add text to warning container
        limitWarningEl.textContent = "To see more than 30 issues, visit";

        var linkEl = document.createElement("a");
        linkEl.textContent = "See More Issues on GitHub.com";
        linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
        linkEl.setAttribute("target", "_blank");


        //append to warning container
        limitWarningEl.appendChild(linkEl);

    };

}

// function to accept Issues parameter and turn into DOM element
var displayIssues = function(issues) {
    //check to see if there are no open issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    //create a link element to take users to that issue on GitHub
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    issueContainerEl.appendChild(issueEl);

};

//create span to hold issue title
var titelEl = document.createElement("span");
titelEl.textContent = issues[i].title;

//append to container
issueEl.appendChild(titleEl);

//create a type element
var typeEl = document.createElement("span");

//check if issue is an actual issue or a pull request
if (issues[i].pull_request) {
    typeEl.textContent = "(Pull request)";
} else {
    typeEl.textContent = "(Issue)";
}

// append to container
issueEl.appendChild(typeEl);

getRepoName();

//getRepoIssues();