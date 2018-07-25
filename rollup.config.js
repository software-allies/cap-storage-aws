
export default {
    input: 'dist/index.js',
    output: {
      file: 'dist/bundles/capstorageaws.umd.js',
      name: 'ng.capstorageaws',
      globals: {
        '@angular/core': 'ng.core'
      },
      format: 'umd',
      sourceMap: false
    }
  }