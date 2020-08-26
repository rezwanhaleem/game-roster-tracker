//server.js
const PLAYER_COUNT=32;

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
const fs              = require('fs');
const readline        = require('readline');
const {google}        = require('googleapis');
const request         = require('request');
const {GoogleSpreadsheet} = require('google-spreadsheet');

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
app.get("/api/players", async (req, res) => { try {
    // Identifying which document we'll be accessing/reading from
  const doc = new GoogleSpreadsheet(req.cookies.spreadsheetId);

  // Authentication
  await doc.useServiceAccountAuth(creds);

  // Loads document properties and worksheets
  await doc.loadInfo(); 

  // or use doc.sheetsById[id]
  const sheet = doc.sheetsByIndex[0]; 

  let players = [], 
  columns = {
    nameCol:'C',
    discordCol:'E',
    monCol:'G',
    wedCol:'H',
    friCol:'I'};

  // loads a range of cells
  await sheet.loadCells([
    columns.nameCol+'3:'+columns.nameCol+PLAYER_COUNT,
    columns.discordCol+'3:'+columns.discordCol+PLAYER_COUNT, 
    columns.monCol+'3:'+columns.monCol+PLAYER_COUNT, 
    columns.wedCol+'3:'+columns.wedCol+PLAYER_COUNT, 
    columns.friCol+'3:'+columns.friCol+PLAYER_COUNT]);

  let keys = Object.keys(columns);

  let letter;
  for (i = 3; i < PLAYER_COUNT+1; i++) {
    let row = i.toString();
    players.push({
      'name': sheet.getCellByA1(columns.nameCol + row).value,
      'discord':sheet.getCellByA1(columns.discordCol + row).value,
      'mon':sheet.getCellByA1(columns.monCol + row).value,
      'wed':sheet.getCellByA1(columns.wedCol + row).value,
      'fri':sheet.getCellByA1(columns.friCol + row).value
    });
  } 
  // const cellG3 = sheet.getCellByA1('G3');

  // cellG3.value = 'NO';

  // const textFormat = cellG3.textFormat;
  // const horizontalAlignment =cellG3.horizontalAlignment;

  // //Workaround for reported issue #353 - Can't change cells backgroundColor if it's not clean 
  // cellG3.clearAllFormatting()
  // await cellG3.save();

  // cellG3.backgroundColor={ red:1 };
  // cellG3.textFormat = textFormat;
  // cellG3.horizontalAlignment = horizontalAlignment;

  // // save all updates in one call
  // await sheet.saveUpdatedCells(); 

  res.send(players);
} catch (e) { console.log(e); } });

app.post("/api/upload", async (req, res) => { try {
  console.log(req.body);
  res.send('OK');
} catch (e) { console.log(e); } });

app.get("/api/init", async (req, res) => { try {
  if(!req.cookies.spreadsheetId) {
    res.cookie('spreadsheetId', process.env.GOOGLE_OPEN_SPREADSHEET_ID, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  res.send(googleUrl);
} catch (e) { console.log(e); } });

app.post("/api/auth", async (req, res) => { try {
  const code = req.body.code;

  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  const userInfo = await oauth2.userinfo.get({
    auth: oauth2Client,
  });

  const authAccs = process.env.GOOGLE_AUTHORIZED_ACCOUNTS.split(",");

  if(authAccs.includes(userInfo.data.email)){
    res.cookie('spreadsheetId', process.env.GOOGLE_SPREADSHEET_ID, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    let userName;

    if(!userInfo.data.name){
      userName = userInfo.data.email;
    }
    else{
      userName = userInfo.data.name;
    }

    res.cookie('userName', userName, {
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: true,
      sameSite: true,
    });

    res.send("Authorized");
  }
  else{
    res.send("Not Authorized!");
  }
} catch (e) { console.log(e); } });

app.post("/api/signout", async (req, res) => { try {
  res.clearCookie('userName');
  res.clearCookie('spreadsheetId');
  res.send('Signed Out!');
} catch (e) { console.log(e); } });
//------------------------Backend API END-------------------------------

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});app.listen(port);