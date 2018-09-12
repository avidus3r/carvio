const fs        = require('fs'),
      readline  = require('readline'),
      {google}  = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = './lib/sheets/token.json';
let d = new Date();
let sheetName = (d.getMonth()+1).toString() + '-' + d.getDate().toString() + '-' + d.getFullYear().toString();

const gSheets = {};

gSheets.loadAuth = function(callback) {
  // Load client secrets from a local file.
  fs.readFile('./lib/sheets/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    gSheets.authorize(JSON.parse(content), callback);
  });
};

gSheets.authorize = function(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return gSheets.getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};

gSheets.getNewToken = function(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

gSheets.onAuthorized = function(auth) {
  let spreadsheetId = '1Bg1M9uZ41Fn0zsI5jQWddjVfPjpd_txeDxxMOJMBdSI';
  let values = [
    [
      "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "i2", "j2",
    ],
  ];
  gSheets.getSpreadsheetSheet('1Bg1M9uZ41Fn0zsI5jQWddjVfPjpd_txeDxxMOJMBdSI', auth).then(function(result) {
    let sheet = result.filter(s => s.properties.title === sheetName).reduce((obj, item) => {
      obj = item;
      return obj;
    }, {});
    if(!sheet) {
    
    } else {
      console.log(sheet);
      let sheetId = sheet.properties.sheetId;
      gSheets.updateSheet(spreadsheetId, sheetId, auth, values);
    }
  }).catch(function(reason) {
    gSheets.createNewSheet('1Bg1M9uZ41Fn0zsI5jQWddjVfPjpd_txeDxxMOJMBdSI', auth).then(function(result) {
      let sheet = result.filter(s => s.properties.title === sheetName).reduce((obj, item) => {
        obj = item;
        return obj;
      }, {});
      console.log(sheet);
      let sheetId = sheet.properties.sheetId;
      gSheets.updateSheet(spreadsheetId, sheetId, auth, values);
    });
  });
};

gSheets.createSheet = function(auth, spreadsheetId) {
  return new Promise(function(resolve, reject) {
    const sheets = google.sheets({version: 'v4', auth});
    let request = {
      resource: {
        spreadsheetId: '3mr4T9uZ41Fn0zsI5jQWddjVfPjpd_txeDxxMOJMBdSJ',
      },
      auth: auth,
    };
    
    sheets.spreadsheets.create(request, function(err, response) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(response);
    });
  });
};

gSheets.getSpreadsheetSheet = function(spreadsheetId, auth) {
  return new Promise(function(resolve, reject) {
    const sheets = google.sheets({version: 'v4', auth});
    let request = {
      // The spreadsheet to request.
      spreadsheetId: spreadsheetId,  // TODO: Update placeholder value.
      
      // The ranges to retrieve from the spreadsheet.
      // ranges: [],  // TODO: Update placeholder value.
      
      // True if grid data should be returned.
      // This parameter is ignored if a field mask was set in the request.
      includeGridData: false,  // TODO: Update placeholder value.
      
      auth: auth,
    };
    
    sheets.spreadsheets.get(request, function(err, response) {
      if (err) {
        reject(err);
        return;
      }
      
      // TODO: Change code below to process the `response` object:
      resolve(response.data.sheets);
    });
  });
};

gSheets.createNewSheet = function(spreadsheetId, auth) {
  return new Promise(function(resolve, reject) {
    const sheets = google.sheets({version: 'v4', auth});
    let requests = [
      {
        "addSheet": {
          "properties": {
            "title": sheetName,
            "gridProperties": {
              "rowCount": 500,
              "columnCount": 12
            },
            "tabColor": {
              "red": 1.0,
              "green": 0.3,
              "blue": 0.4
            }
          }
        }
      }
    ];
    const batchUpdateRequest = {requests};
    sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: batchUpdateRequest,
    }, (err, response) => {
      if (err) {
        // Handle error
        reject(err);
      } else {
        resolve(response.data.sheets);
      }
    });
  });
};

gSheets.updateSheet = function(spreadsheetId, sheetId, auth, values) {
  const sheets = google.sheets({version: 'v4', auth});
  
  let request = {
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!A1:J1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values,
    },
    auth: auth,
  };
  sheets.spreadsheets.values.append(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }
    // TODO: Change code below to process the `response` object:
    console.log(response);
  });
};

module.exports = gSheets;