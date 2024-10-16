const searchContainer = document.querySelector(".search-container");


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
                console.log(data.result)
            }else{
                alert("error: "+data.message)
            }

        });
}

console.log("I exist");
