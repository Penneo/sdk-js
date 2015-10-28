import wsse from 'wsse';
import request from 'request';
import config from './config';

/* Generates the Authentication Header Token */
function generateAuthHeader(key, secret) {
    let wsseOptions = {username: key, password: secret};
    let token = wsse(wsseOptions);
    return token.getWSSEHeader({nonceBase64: true});
}

function isConfigured() {
    for (let key in config) {
        if (config.hasOwnProperty(key)) {
            if (!config[key]) {
                console.warn('Please configure the Penneo SDK before calling any methods ' +
                             '- Refer to the Docs http://docs.penneo.com/javascript-sdk#init');
                return false;
            }
        }
    }
    return true;
}

/* Penneo Request Handler */
function handleRequest(method, endpoint, callback) {
    if (isConfigured()) {
        let requestOptions = {
            method: method,
            uri: config.url + '/' + endpoint,
            withCredentials: false,
            headers: {
                'X-WSSE': generateAuthHeader(config.key, config.secret)
            }
        };

        request(requestOptions, callback);
    }
}

/* API Calls Export */
export default {
    handleRequest: handleRequest
};
