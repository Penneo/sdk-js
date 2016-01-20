import config from './config';
import connector from './connector';

function init(options) {
    config.update(options);
}

/* Exports */
export default {
    init: init,
    config: config,
    get: connector.get,
    post: connector.post,
    put: connector.put,
    patch: connector.patch,
    delete: connector.delete
};
