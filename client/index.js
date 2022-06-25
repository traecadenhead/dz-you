const API_URL = "http://ec2-3-80-94-54.compute-1.amazonaws.com:3001/connect";

connectionTypes = {
    coffee: {
        index: "0",
        title: "Get Coffee"
    },
    involved: {
        index: "1",
        title: "Get Involved"
    }
}

checklistKeys = [
    "graduatedHighSchool",
    "collegeStudent",
    "inSorority",
    "graduatedCollege"
];

function setConnect(type) {
    document.getElementById("connectionType").selectedIndex = connectionTypes[type].index
    document.getElementById("connectForm").scrollIntoView({behavior: "smooth"});
}

function connect(e) {
    e.preventDefault();
    const form = document.getElementById("connectForm");
    const formData = new FormData(form);

    const options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonifyForm(formData))                  
    };

    fetch(API_URL, options).then(response => response.json())
    .then(() => { 
        alert("Awesome! We'll reach out to you soon! Thanks!");
        // TODO: clear form
    })
    .catch(err => {
        alert("Oh no, something went wrong!");
    });
    return false;
}

function jsonifyForm(formData) {
    const json = new Object();
    for (const key of formData.keys()) {
        json[key] = formData.get(key);
    }
    for (const key of checklistKeys) {
        if (formData.get(key) == "on") {
            json[key] = true;
        } else {
            json[key] = false;
        }
    }
    return json;
}