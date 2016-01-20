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
 * @return {object} headers with X-WSSE added
 */
function generateWsseAuthHeader(headers) {
    let wsseOptions = {username: config.key, password: config.secret};
    let token = wsse(wsseOptions);

    headers['X-WSSE'] = token.getWSSEHeader({nonceBase64: true});

    return headers;
}

/**
 * Appends X-Auth-Token to Headers
 *
 * @private
 *
 * @param headers {object} Request Headers
 *
 * @return {object} headers with X-Auth-Token added
 */
function generateTokenAuthHeader(headers) {
    headers['X-Auth-Token'] = config.token;

    return headers;
}

/**
 * Generates the Authentication Headers based on type of authentication
 *
 * @private
 *
 * @param headers {object} Request Headers
 *
 * @return {object} headers with Auth Tokens added
 */
function generateAuthHeaders(headers) {
    if (config.token) {
        return generateTokenAuthHeader(headers);
    }

    if (config.key && config.secret) {
        return generateWsseAuthHeader(headers);
    }

    return headers;
}

/**
 * @private
 *
 * @return {bool}
 */
function isConfigured() {
    if (config.url) {
        return true;
    }

    return false;
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

    if (typeof data.body === "string") {
        response.body = JSON.parse(data.body);
    } else {
        response.body = data.body;
    }

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
            'Accept-charset': 'utf-8',
            Accept: 'application/json'
        }
    };

    // Update Request Headers with Authentication Headers
    requestOptions.headers = generateAuthHeaders(requestOptions.headers);

    if (!data) {
        return requestOptions;
    }

    switch (method) {
        case 'GET': // Build a QueryString on GET requests with URL Parameters.
            requestOptions.qs = data;
            break;

        case 'POST':
        case 'PUT':
        case 'PATCH':
            // Accept JSON and body content on requests with Data.
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
 * @param data     {object} Data to be used for updating the resource
 *
 * @return {Promise}
 */
function _patch(resource, data) {
    return createRequest('PATCH', resource, data);
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
    patch: _patch,
    delete: _delete
};
