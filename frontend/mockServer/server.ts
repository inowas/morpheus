// eslint-disable-next-line import/no-extraneous-dependencies
import {createServer} from 'miragejs';

import config from '../src/config';

export function makeServer({environment = 'test'} = {}) {
  return createServer({
    environment,
    routes: function () {
      this.timing = 100;
      this.namespace = config.baseApiUrl;
    },
    seeds(server) {
      server.db.loadData({});
    },
  });
}
