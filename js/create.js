const formContainer = document.querySelector(".form-container")


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

function submitStoryCreation() {
    const title = formContainer.getElementById("title").value
    const tags = formContainer.getElementById("tags").textContent.split("\n")
    const content = formContainer.getElementById("content").textContent;

    const book = {title: title, tags: tags, content: content}
    fetchData("/create", "POST", book)
        .then(data => {
            if (data.status) {
                alert("done successfuly")
                displaySearchResults(data.result)
                
            }else{
                alert("error: "+data.message)
            }

        });

}