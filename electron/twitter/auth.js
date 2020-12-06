import {OAuth} from 'oauth';

const startLogin = (window, keyFactory) => {
    const {key, secret} = keyFactory;
    return new Promise((resolve, reject) => {
        const oauth = new OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            key,
            secret,
            '1.0A',
            null,
            'HMAC-SHA1',
        );

        oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
            if (error) {
                reject(error);
            }


            resolve({oauth: oauth, oauthToken: oauthToken, oauthTokenSecret: oauthTokenSecret})
        });
    })
}

const getAccessToken = (window, oauthFactory, authUrl) => {
    const {oauth, oauthToken, oauthTokenSecret} = oauthFactory;
    return new Promise((resolve, reject) => {
        window.loadURL(authUrl).then(r => {
        });
        window.on('close', () => {
            reject(
                new Error("Didn't authentication. close Window Please ReLoad"),
            );
        });
        window.webContents.on('will-navigate', (event, url) => {
            /**
             * If 2fa is set, the url includes challenge_id, challenge_type
             */
            if (
                url.indexOf('challenge_type') >= 0 &&
                url.indexOf('challenge_id') >= 0
            ) {
                window.loadURL(url);
            } else {
                const matched = url.match(
                    /\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/,
                );
                if (matched) {
                    oauth.getOAuthAccessToken(
                        oauthToken,
                        oauthTokenSecret,
                        matched[2],
                        (error, oauthAccessTokenSecret, oauthAccessTokenSecretSecret) => {
                            if (error) {
                                reject(error);
                            }

                            resolve({
                                oauth_access_token: oauthAccessTokenSecret,
                                oauth_access_token_secret: oauthAccessTokenSecretSecret,
                            });
                            window.close();
                        },
                    );
                }
            }
        });
    })
}

export {startLogin, getAccessToken}