const {app, dialog, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

import Store from 'electron-store'
import {startLogin, getAccessToken} from "./twitter/auth";
import {key, secret} from "./env";

import log from "electron-log";


const store = new Store();

app.once('ready', () => {
    const window = new BrowserWindow({width: 800, height: 600});

    const twitCredentials = store.get('TwitterUserCredentials');
    log.info('twitCredentials', twitCredentials);

    if (twitCredentials === null || twitCredentials === 'null') {
        startLogin(window, {
            key: key,
            secret: secret,
        }).then(result => {
            const {oauth, oauthToken, oauthTokenSecret} = result;
            const url = `https://api.twitter.com/oauth/authenticate?force_login=true;oauth_token=${oauthToken}`;
            return getAccessToken(window, {
                oauth: oauth,
                oauthToken: oauthToken,
                oauthTokenSecret: oauthTokenSecret
            }, url);
        }).then(result => {
            const accessToken = result.oauth_access_token;
            const accessTokenSecret = result.oauth_access_token_secret;
            dialog.showErrorBox(
                'Status',
                `Token: ${accessToken} \nSecret: ${accessTokenSecret}`,
            );
            store.set('TwitterUserCredentials', {accessToken: accessToken, accessTokenSecret: accessTokenSecret})
            return {accessToken: accessToken, accessTokenSecret: accessTokenSecret}
        })
    }
    return twitCredentials
})

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, './../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools()

    const info = {
        key: key,
        secret: secretkey
    }
    const window = new BrowserWindow({webPreferences: {nodeIntegration: false}});
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})