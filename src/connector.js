import wsse from 'wsse';
import request from 'request';
import Promise from 'bluebird';

import config from './config';

/**
 * Generates the Authentication Header Token
 *
 * @private
 *
 * @param key    {string} API key
 * @param secret {string} secret  API secret
 *
 * @return {object}
 */
function generateAuthHeader(key, secret) {
    let wsseOptions = {username: key, password: secret};
    let token = wsse(wsseOptions);
    return token.getWSSEHeader({nonceBase64: true});
}

/**
 * @private
 *
 * @return {bool}
 */
function isConfigured() {
    for (let key in config) {
        if (!config.hasOwnProperty(key)) {
            continue;
        }
        if (!config[key]) {
            return false;
        }
    }
    return true;
}

/**
 * @private
 * @throws SDK not configured
 *
 * @param method   {string} This can be one of GET|DELETE|POST|PUT
 * @param resource {string} The resource name
 *
 * @return {Promise}
 */
function createRequest(method, resource) {
    if (!isConfigured()) {
        // @todo: Add link to the documentation if it doesn't change
        //        http://docs.penneo.com/javascript-sdk#init
        throw 'Please configure the Penneo SDK before calling any methods.';
    }

    let requestOptions = {
        method: method,
        uri: config.url + resource,
        withCredentials: false, // @todo: why do we need to set this?
        headers: {
            'X-WSSE': generateAuthHeader(config.key, config.secret),
            'Accept-charset': 'utf-8',
            'Accept': 'application/json'
        }
    };

    return new Promise(function(resolve, reject) {
        request(requestOptions, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

/**
 * @param resource {string} Resource endpoint e.g. /casefiles, /casefiles/1
 * @param filter   {object} @todo: to implement
 *
 * @return {Promise}
 */
function _get(resource, filter) {
    if (filter) {
        throw 'Functionality for adding filters has not been implemented';
    }
    return createRequest('GET', resource);
}

/**
 * @param resource {string} Resource endpoint e.g. /casefiles, /casefiles/1/documents
 * @param data     {object} Data to be used for creating the resource
 *
 * @return {Promise}
 */
function _post(resource, data) {
    return createRequest('POST', resource, data);
}

/**
 * @param resource {string} Resource endpoint e.g. /casefiles/1, /casefiles/1/documents/1
 * @param data     {object} Data to be used for updating the resource
 *
 * @return {Promise}
 */
function _put(resource, data) {
    return createRequest('PUT', resource, data);
}

/**
 * @param resource {string} Resource endpoint e.g. /casefiles/1, /casefiles/1/documents/1
 *
 * @return {Promise}
 */
function _delete(resource) {
    return createRequest('DELETE', resource);
}

/* Exports */
export default {
    get: _get,
    post: _post,
    put: _put,
    delete: _delete
};
