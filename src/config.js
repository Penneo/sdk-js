import assign from 'object-assign';

/* Update objects in Configuration */
function update(object) {
    assign(config, object);
}

/* Configuration Placeholder */
let config = {
    key: null,
    secret: null,
    url: null,
    update: update
};

/* Prevent new keys to be added on object. */
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
Object.seal(config);

/* Exports */
export default config;
