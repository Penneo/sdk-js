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
 * Parse the response from the server. All responses from the server should be
 * parsed by this function to keep the convention
 *
 * @private
 *
 * @param response {object} Successful response from HTTP Request.
 *
 * @return {object} An object with the keys: body, raw, status
 */
function parseResponse(data) {
    let response = {
        body: {},
        raw: data,
        status: data.statusCode
    };

    if (!data.body) {
        return response;
    }

    response.body = JSON.parse(data.body);
    return response;
}

/**
 * Builds the appropriate options for the HTTP Requests based on Method and Arguments
 *
 * @private
 *
 * @param method   {string} This can be one of GET|DELETE|POST|PUT
 * @param resource {string} The resource name
 * @param data     {object} POST data or GET Parameters
 *
 * @return {object} An object with the options for the HTTP Request.
 */
function buildRequestOptions(method, resource, data) {
    let requestOptions = {
        method: method,
        uri: config.url + resource,
        withCredentials: false, // @todo: why do we need to set this?
        headers: {
            'X-WSSE': generateAuthHeader(config.key, config.secret),
            'Accept-charset': 'utf-8',
            Accept: 'application/json'
        }
    };

    if (!data) {
        return requestOptions;
    }

    switch (method) {
        case 'GET': // Build a QueryString on GET requests with URL Parameters.
            requestOptions.qs = data;
            break;

        case 'POST': // Accept JSON and body on POST with Data.
            requestOptions.body = data;
            requestOptions.json = true;
            break;

        default:
            throw new Error('Method not supported.');
    }

    return requestOptions;
}

/**
 * @private
 * @throws SDK not configured
 *
 * @param method   {string} This can be one of GET|DELETE|POST|PUT
 * @param resource {string} The resource name
 * @param data     {object} POST data or GET Parameters
 *
 * @return {Promise}
 */
function createRequest(method, resource, data) {
    if (!isConfigured()) {
        // @todo: Add link to the documentation if it doesn't change
        //        http://docs.penneo.com/javascript-sdk#init
        throw new Error('Please configure the Penneo SDK before calling any methods.');
    }

    let options = buildRequestOptions(method, resource, data);

    return new Promise(function(resolve, reject) {
        request(options, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    }).then(parseResponse);
}

/**
 * @param resource {string} Resource endpoint e.g. /casefiles, /casefiles/1
 * @param params   {object} Object containing keys and values for URL Parameters.
 *
 * @return {Promise}
 */
function _get(resource, params) {
    return createRequest('GET', resource, params);
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
