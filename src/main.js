// Entry point for browserify

import config from './config';
import casefile from './entity/casefile';
import document from './entity/document';

function init(key, secret, url) {
    config.update({key: key, secret: secret, url: url});
}

export default {
    init: init,
    config: config,
    casefile: casefile,
    document: document
};
