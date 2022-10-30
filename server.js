//server.js
const PLAYER_COUNT = 32;
const COLUMNS = {
  nameCol: 'C',
  discordCol: 'E',
  monCol: 'G',
  wedCol: 'H',
  friCol: 'I'
};

const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const bodyParser = require('body-parser');//Parse JSON requests
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3001;
const app = express();

//------------------------GOOGLE-------------------------------
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
// const request = require('request');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const spreadsheetId = process.env.GOOGLE_OPEN_SPREADSHEET_ID;

const creds = {
  "type": "service_account",
  "project_id": "guild-war-tracker",
  "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_PRIVATE_KEY,
  "client_email": process.env.GOOGLE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT
};

const oauth2 = google.oauth2('v2');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

const googleUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/userinfo.email'
});

//------------------------GOOGLE END-------------------------------

app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/ping', function (req, res) {
  return res.send('pong');
});


//------------------------Backend API-------------------------------
app.get("/api/players", async (req, res) => {
  try {
    // Identifying which document we'll be accessing/reading from
    const doc = new GoogleSpreadsheet(req.cookies.spreadsheetId);

    // Authentication
    await doc.useServiceAccountAuth(creds);

    // Loads document properties and worksheets
    await doc.loadInfo();

    // or use doc.sheetsById[id]
    const sheet = doc.sheetsByIndex[0];

    let players = [];

    // loads a range of cells
    await sheet.loadCells([
      COLUMNS.nameCol + '3:' + COLUMNS.nameCol + PLAYER_COUNT,
      COLUMNS.discordCol + '3:' + COLUMNS.discordCol + PLAYER_COUNT,
      COLUMNS.monCol + '3:' + COLUMNS.monCol + PLAYER_COUNT,
      COLUMNS.wedCol + '3:' + COLUMNS.wedCol + PLAYER_COUNT,
      COLUMNS.friCol + '3:' + COLUMNS.friCol + PLAYER_COUNT]
    );

    for (i = 3; i < PLAYER_COUNT + 1; i++) {
      let row = i.toString();
      players.push({
        'name': sheet.getCellByA1(COLUMNS.nameCol + row).value,
        'discord': sheet.getCellByA1(COLUMNS.discordCol + row).value,
        'mon': sheet.getCellByA1(COLUMNS.monCol + row).value,
        'wed': sheet.getCellByA1(COLUMNS.wedCol + row).value,
        'fri': sheet.getCellByA1(COLUMNS.friCol + row).value
      });
    }
    res.send(players);
  } catch (e) { console.log(e); }
});
//-------------------------------UPLOAD----------------------------------------------------
app.post("/api/upload", async (req, res) => {
  try {
    const players = JSON.parse(req.body.players);
    const config = JSON.parse(req.body.config);

    // Identifying which document we'll be accessing/reading from
    const doc = new GoogleSpreadsheet(req.cookies.spreadsheetId);

    // Authentication
    await doc.useServiceAccountAuth(creds);

    // Loads document properties and worksheets
    await doc.loadInfo();

    // or use doc.sheetsById[id]
    const sheet = doc.sheetsByIndex[0];

    // loads a range of cells
    await sheet.loadCells([
      COLUMNS.monCol + '3:' + COLUMNS.monCol + PLAYER_COUNT,
      COLUMNS.wedCol + '3:' + COLUMNS.wedCol + PLAYER_COUNT,
      COLUMNS.friCol + '3:' + COLUMNS.friCol + PLAYER_COUNT]
    );

    let dayCells = [[], [], []];

    for (i = 0; i < 3; i++) {
      for (j = 3; j < PLAYER_COUNT + 1; j++) {
        let row = j.toString();
        switch (i) {
          case 0:
            dayCells[i].push(sheet.getCellByA1(COLUMNS.monCol + row));
            break;
          case 1:
            dayCells[i].push(sheet.getCellByA1(COLUMNS.wedCol + row));
            break;
          case 2:
            dayCells[i].push(sheet.getCellByA1(COLUMNS.friCol + row));
            break;
          default:
            break;
        }
      }
    }

    const border = {
      top: {
        style: "SOLID",
        color: {
          red: 0,
          green: 0,
          blue: 0
        }
      },
      bottom: {
        style: "SOLID",
        color: {
          red: 0,
          green: 0,
          blue: 0
        }
      },
      left: {
        style: "SOLID",
        color: {
          red: 0,
          green: 0,
          blue: 0
        }
      },
      right: {
        style: "SOLID",
        color: {
          red: 0,
          green: 0,
          blue: 0
        }
      }
    };

    const textFormat = {
      foregroundColor: {
        red: 0,
        green: 0,
        blue: 0
      },
      fontSize: 12,
      bold: true
    };

    for (i = 0; i < 3; i++) {
      if (config[i]) {
        for (j = 3; j < PLAYER_COUNT + 1; j++) {
          let row = j - 3;
          let val = '';
          let bgcolor = {};

          switch (i) {
            case 0:
              val = players[row].mon;
              break;
            case 1:
              val = players[row].wed;
              break;
            case 2:
              val = players[row].fri;
              break;
            default:
              break;
          };

          switch (val) {
            case "FULL":
              bgcolor = { green: 1 };
              break;
            case "NONE":
              bgcolor = { red: 1 };
              break;
            case "Benched":
              bgcolor = { red: 1, green: 1 };
              break;
            default:
              bgcolor = { red: 1, green: 1, blue: 1 };
              break;
          }

          dayCells[i][row].value = val;
          dayCells[i][row].backgroundColor = bgcolor;
          dayCells[i][row].borders = border;
          dayCells[i][row].horizontalAlignment = "CENTER";
          dayCells[i][row].textFormat = textFormat;
        }
      }
    }

    // save all updates in one call
    await sheet.saveUpdatedCells();
    res.send('Success');
  } catch (e) { console.log(e); }
});

app.get("/api/init", async (req, res) => {
  try {
    if (!req.cookies.spreadsheetId) {
      res.cookie('spreadsheetId', process.env.GOOGLE_OPEN_SPREADSHEET_ID, {
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: true,
        sameSite: true,
      });
    }

    res.send(googleUrl);
  } catch (e) { console.log(e); }
});

app.post("/api/auth", async (req, res) => {
  try {
    const code = req.body.code;

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    const userInfo = await oauth2.userinfo.get({
      auth: oauth2Client,
    });

    const authAccs = process.env.GOOGLE_AUTHORIZED_ACCOUNTS.split(",");

    if (authAccs.includes(userInfo.data.email)) {
      res.cookie('spreadsheetId', process.env.GOOGLE_SPREADSHEET_ID, {
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: true,
        sameSite: true,
      });

      let userName;

      if (!userInfo.data.name) {
        userName = userInfo.data.email;
      }
      else {
        userName = userInfo.data.name;
      }

      res.cookie('userName', userName, {
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: true,
        sameSite: true,
      });

      res.send("Authorized");
    }
    else {
      res.send("Not Authorized");
    }
  } catch (e) { console.log(e); }
});

app.post("/api/signout", async (req, res) => {
  try {
    res.clearCookie('userName');
    res.clearCookie('spreadsheetId');
    res.send('Signed Out!');
  } catch (e) { console.log(e); }
});
//------------------------Backend API END-------------------------------

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}); app.listen(port);