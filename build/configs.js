const path = require('path')

const buble = require('rollup-plugin-buble')
// const babel = require('rollup-plugin-babel')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

const packageJson = require('../package.json')
const version = process.env.VERSION || packageJson.version

const {
  name,
  author,
  description
} = packageJson
const banner =
  `/*!
  * ${name} v${version}
  * (c) ${new Date().getFullYear()} ${author}
  * @description ${description}
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)
const fileNamePre = 'index';
module.exports = [
  // browser dev
  {
    file: resolve(`${fileNamePre}.js`),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve(`${fileNamePre}.min.js`),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve(`${fileNamePre}.common.js`),
    format: 'cjs'
  },
  {
    file: resolve(`${fileNamePre}.esm.js`),
    format: 'es'
  }
].map(genConfig)

function genConfig (opts) {
  const fmtModName = (name)=>{
    //console.log(name)
    return name.replace(/-(\w)/g, function(all, letter){
      //console.log(letter);
      return letter.toUpperCase();
      
    }).replace(/^(\w)/g, function(all ,letter){
      //console.log(letter);
      return letter.toUpperCase();
      
    })
  }
  const config = {
    input: {
      input: resolve('dist/index.js'),
      plugins: [
        node(),
        cjs(),
        replace({
          __VERSION__: version
        }),
        buble()
        // babel()
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: fmtModName('index')
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}
