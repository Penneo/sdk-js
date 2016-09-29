import axios from 'axios';
import assign from 'object-assign';

class RequestHandler {
    constructor(settings) {
        this._baseURL = settings.url;
        this._token = settings.token;
        this._auth = settings.auth; // [JWT : JSON Web Token / Session ID]
    }

    getToken() {
        return this._token;
    }

    setToken(token) {
        this._token = token;
    }

    getAuthHeaders() {
        let headers = {};

        if (this._token) {
            headers['X-Auth-Token'] = this._token;
        }

        if (this._auth) {
            headers.Authorization = this._auth;
        }

        headers['X-Requested-With'] = "XHttpRequest";

        let mergedHeaders = assign({}, headers, this.headers);
        return mergedHeaders;
    }

    /**
     * @private
     *
     * @param options {object} Contains axios options {method, url}, etc.
     *
     * @return {Promise}
     */
    _createRequest(options) {
        let baseRequest = {
            baseURL: this._baseURL,
            headers: this.getAuthHeaders()
        };

        let request = assign({}, baseRequest, options);

        return axios(request);
    }

    /**
     * @param resource {string} Resource endpoint e.g. /casefiles, /casefiles/1
     * @param params   {object} Object containing keys and values for URL Parameters.
     *
     * @return {Promise}
     */
    get(resource, params) {
        let request = {
            method: 'GET',
            url: resource,
            params: params
        };

        return this._createRequest(request);
    }

    /**
     * @param resource {string} Resource endpoint e.g. /casefiles, /casefiles/1/documents
     * @param data     {object} Data to be used for creating the resource
     *
     * @return {Promise}
     */
    post(resource, data) {
        let request = {
            method: 'POST',
            url: resource,
            data: data
        };

        return this._createRequest(request);
    }

    /**
     * @param resource {string} Resource endpoint e.g. /casefiles/1, /casefiles/1/documents/1
     * @param data     {object} Data to be used for updating the resource
     *
     * @return {Promise}
     */
    put(resource, data) {
        let request = {
            method: 'PUT',
            url: resource,
            data: data
        };

        return this._createRequest(request);
    }

    /**
     * @param resource {string} Resource endpoint e.g. /casefiles/1, /casefiles/1/documents/1
     * @param data     {object} Data to be used for updating the resource
     *
     * @return {Promise}
     */
    patch(resource, data) {
        let request = {
            method: 'PATCH',
            url: resource,
            data: data
        };

        return this._createRequest(request);
    }

    /**
     * @param resource {string} Resource endpoint e.g. /casefiles/1, /casefiles/1/documents/1
     *
     * @return {Promise}
     */
    delete(resource) {
        let request = {
            method: 'DELETE',
            url: resource
        };

        return this._createRequest(request);
    }

    file(resource, data, method = 'POST') {
        let formData = new FormData();

        for (let key in data) {
            if (!data.hasOwnProperty(key)) {
                break;
            }

            formData.append(key, data[key], data[key].name);
        }

        let request = {
            method: method,
            url: resource,
            data: formData
        };

        return this._createRequest(request);
    }
}

export default RequestHandler;
