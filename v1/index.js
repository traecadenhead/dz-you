const SHEET_ID = "11lZDyLSpfXqZV2Zxa19FI4oZXIuVAQn9sqIsKOe_oUE"
const ACCESS_TOKEN = "ya29.a0ARrdaM_xu55kp8cZIMBmzwSY7qkAxw3CXsxjF1xvAEAj3j_FJR9V5uQH1GqMl5OuteZeSSg4rSKGdaRzMbgU-nwcxAJfsL5ZZcrQRZE7m6tqSjPlpasLGo1XPP_JJSUJcFCsHHg_jCqlbNnjJPBF44C-G8X0"

function save() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({

        requests: [{
          repeatCell: {
            range: {
              startColumnIndex: 0,
              endColumnIndex: 1,
              startRowIndex: 0,
              endRowIndex: 1,
              sheetId: 0
            },
            cell: {
              userEnteredValue: {
                "numberValue": 10
              },
            },
            fields: "*"
          }
        }]
      })
    })
}

function test(msg) {
    console.log(msg);
    alert(msg);
}