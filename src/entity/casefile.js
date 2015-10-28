import request from '../requests';

/* API Calls Export */
export default {
    list(callback) {
        request.handleRequest('GET', 'casefiles', callback);
    },

    find(id, callback) {
        request.handleRequest('GET', 'casefile/' + id, callback);
    }
};
