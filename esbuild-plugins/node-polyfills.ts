import type {Plugin, PluginBuild} from 'esbuild';

const nodePolyfills: Plugin = {
  name: 'nodePolyfills',
  setup: (build: PluginBuild) => {
    const options = build.initialOptions;
    options.alias = {
      ...options.alias || {},
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      http: 'stream-http',
      https: 'https-browserify',
      zlib: 'browserify-zlib',
      'node_modules/@ledgerhq/errors/lib-es/index.js': 'node_modules/@ledgerhq/errors/lib/index.js',
    };
  },
};

export default nodePolyfills;
