//server.js
const PLAYER_COUNT=31;

const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const bodyParser = require('body-parser');//Parse JSON requests
const port = process.env.PORT || 3001;
const app = express();

//------------------------GOOGLE-------------------------------
const fs              = require('fs');
const readline        = require('readline');
const {google}        = require('googleapis');
const request         = require('request');
const {GoogleSpreadsheet} = require('google-spreadsheet');

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

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

//------------------------GOOGLE END-------------------------------

app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
 return res.send('pong');
});

//------------------------Backend API-------------------------------
app.get("/players", async (req, res) => { try {
    // Identifying which document we'll be accessing/reading from
  const doc = new GoogleSpreadsheet(spreadsheetId);

  // Authentication
  await doc.useServiceAccountAuth(creds);

  // Loads document properties and worksheets
  await doc.loadInfo(); 

  // or use doc.sheetsById[id]
  const sheet = doc.sheetsByIndex[0]; 

  // loads a range of cells
  await sheet.loadCells(['C3:C'+PLAYER_COUNT, 'E3:E'+PLAYER_COUNT, 'G3:G'+PLAYER_COUNT, 'H3:H'+PLAYER_COUNT, 'I3:I'+PLAYER_COUNT]);

  let players = [], 
  columns = {
    nameCol:'C',
    discordCol:'E',
    monCol:'G',
    wedCol:'H',
    friCol:'I'};

  let keys = Object.keys(columns);

  let letter;
  for (i = 3; i < 32; i++) {
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
//------------------------Backend API END-------------------------------

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});app.listen(port);