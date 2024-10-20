const formContainer = document.querySelector(".form-container")
const submitButton = formContainer.querySelector("button")



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
    const title = document.querySelector(".title").value
    const tags = document.querySelector(".tags").value.split("\n")
    const content = document.querySelector(".content").value;

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


submitButton.addEventListener("click", e => {
    console.log("I exist")
    //submitStoryCreation()
});