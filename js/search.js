const searchContainer = document.querySelector(".search-container");
const searchResultsContainer = document.querySelector(".search-results")


function fetchData(url, method, body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
}


function search() {
    const name = searchContainer.querySelector(".name").value;
    const tags = searchContainer.querySelector(".tags").value.split("\n");

    fetchData("/search", "POST", { name: name, tags: tags })
        .then(data => {
            if (data.status) {
                alert("done successfuly")
                displaySearchResults(data.result)
                
            }else{
                alert("error: "+data.message)
            }

        });
}

function displaySearchResults(results) {

    let i = 0

    results.forEach(result => {
        const resultDiv = document.createElement("div")
        resultDiv.classList.add("result")

        const resultTitle = document.createElement("h2")
        resultTitle.textContent = result.name
        


        const resultTags = document.createElement("h5")
        resultTags.textContent = "Tags: "+result.tags.join(" ")
        
        const resultPreview = document.createElement("p")
        resultPreview.textContent = result.content.slice(0, 20)
    
        const resultButton = document.createElement("button")
        resultButton.textContent = "View"
        resultButton.classList.add("view-button")
        resultButton.classList.add(i)
        
        resultButton.addEventListener("click", e => {
            fetchData("/view", "POST", { id: resultButton.classList[1]})
                .then(data => {
                    console.log(data)

                });
        })
        

        resultDiv.appendChild(resultTitle)
        resultDiv.appendChild(resultTags)
        resultDiv.appendChild(resultPreview)
        resultDiv.appendChild(resultButton)
        searchResultsContainer.appendChild(resultDiv)
        
        i++;
    })
}

console.log("I exist");
