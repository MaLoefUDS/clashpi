const https = require('https');

class Connector {
    constructor(apiToken) {
        this.api = 'api.clashroyale.com';
        this.apiToken = apiToken;
    }

    async request(args = [], queries = {}) {
        const options = {
            hostname: this.api,
            path: '/v1/' + Connector.pack(args).join('/') + (queries.length === 0 ? '' : '?' +
                Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&')),
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.apiToken
            }
        };
        return await new Promise((resolve, reject) => {
            https.get(options, async response => {
                let content = [];
                response.on('data', data => {
                    content.push(data.toString());
                });
                response.on('end', _ => {
                    resolve(JSON.parse(content.join("")));
                });
            }).on('error', error => {
                reject(error);
            })
        });
    }

    static pack(value) {
        return value.constructor.name === 'Array' ? value : [value];
    }
}

module.exports = {Connector};