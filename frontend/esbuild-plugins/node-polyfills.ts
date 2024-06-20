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
      buffer: 'buffer',
    };
  },
};

export default nodePolyfills;
