import { terser } from 'rollup-plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'

export default {
  input: 'store.js',
  output: {
      file: 'dist/store.min.js',
      format: 'es',
  },
  plugins: [terser(), gzipPlugin()],
}
