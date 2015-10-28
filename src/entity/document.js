import request from '../requests';

/* API Calls Export */
export default {
    list(callback) {
        request.handleRequest('GET', 'documents', callback);
    }
};
