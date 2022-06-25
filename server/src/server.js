const parser = require("body-parser")
const express = require("express")
const { google } = require("googleapis")
const private_key = require("../config/google_auth.json")
const columns = require("../config/columns.json")
const config = require("../config/config.json")

const app = express();

app.use(parser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/connect", function(req, res){
    // configure a JWT auth client
    const jwt_client = new google.auth.JWT(
        private_key.client_email,
        null,
        private_key.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
    );

    //authenticate request
    jwt_client.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            throw new Error("broken on auth");
        } else {
            save(jwt_client, req.body);
            return res.json({success: true});
        }
    });
});

function save(jwt_client, body) {
    const value_range_body = {
        "majorDimension": "ROWS", //log each entry as a new row (vs column)
        "values": [prepare_row(body)] //convert the object's values to an array
    };

    const sheets = google.sheets("v4");
    sheets.spreadsheets.values.append({
        auth: jwt_client,
        spreadsheetId: config.spreadsheet_id,
        range: "Sheet1",
        valueInputOption: "RAW",
        resource: value_range_body
    }).then((response) => {
        console.log(response);
    }, (err) => {
        console.log(err);
    });
}

function prepare_row(body) {
    row = [];
    for (const column of columns) {
        row.push(body[column].toString());
    }
    return row;
}

app.listen(3001, function(){
	console.log("server running");
});