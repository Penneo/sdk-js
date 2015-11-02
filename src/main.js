import config from './config';
import connector from './connector';

function init(key, secret, url) {
    config.update({key: key, secret: secret, url: url});
}

/* Exports */
export default {
    init: init,
    config: config,
    get: connector.get,
    post: connector.post,
    put: connector.put,
    delete: connector.delete
};
