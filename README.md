# styled-jsx/css loader

```diff
- ⚠️ THIS PROJECT IS NO LONGER MAINTAINED ⚠️ -
```

**TL;DR:** You are encouraged to use the [`styled-jsx/webpack` loader](https://github.com/zeit/styled-jsx#styles-in-regular-css-files) built [styled-jsx](https://www.npmjs.com/package/styled-jsx) v3+ (also with [Next.js](https://nextjs.org/) v7+) in instead of [styled-jsx/css loader](https://github.com/coox/styled-jsx-css-loader).

---

[styled-jsx/css loader](https://github.com/coox/styled-jsx-css-loader) was a loader for webpack that let you import CSS files as a [styled-jsx](https://www.npmjs.com/package/styled-jsx) `css`-tagged template literal.

This was pretty useful back when styled-jsx v2 was in fashion.

In August 2018, [styled-jsx v3](https://github.com/zeit/styled-jsx/releases/tag/v3.0.0) was released, coming with its own [`styled-jsx/webpack` loader](https://github.com/zeit/styled-jsx#styles-in-regular-css-files). This is essentially a full built-in replacement for styled-jsx/css loader. One month later, it was also included in Next.js [v7](https://nextjs.org/blog/next-7#styled-jsx-v3), further reducing the need of an external styled-jsx/css loader.

## Usage

Since version 2.0.1, styled-jsx allows styles to be [defined in separate JavaScript modules](https://github.com/zeit/styled-jsx#keeping-css-in-separate-files), by tagging with `css` any template literal that contain CSS.

This loader allows to go one step further and define styles in separate CSS files, which will be loaded as modules exporting the style sheet as a `css`-tagged template literal.

In practice, you are now able to write:

```jsx
import styles from './styles.css';

<style jsx>{styles}</style>
```

## Installation

It is assumed that your application already depends on styled-jsx, either directly or through [Next.js 4](https://zeit.co/blog/next4).

The loader is typically added as a dependency (or development dependency) to your application using [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

```bash
npm install --save-dev styled-jsx-css-loader
```

## Configuration

The loaded module is intended to be Babel-transformed by styled-jsx.

In order to properly configure this, you will need to define webpack rules for the type of files you want to load (typically, the CSS files of your project and/or external modules).

These rules **must**:

- first, use [styled-jsx-css-loader](https://github.com/coox/styled-jsx-css-loader)
- then, pass its output to [babel-loader](https://github.com/babel/babel-loader), ensuring that it is configured to:
    - transform ES2015 modules (typically using [transform-es2015-modules-commonjs](https://babeljs.io/docs/plugins/transform-es2015-modules-commonjs/) or [another Modules plugin](https://babeljs.io/docs/plugins/#transform-plugins-modules))
    - use the [styled-jsx/babel](https://github.com/zeit/styled-jsx/blob/master/src/babel.js) plugin
    - not let any other Babel configuration interfere (typically setting the `babelrc` option to `false`) — this is especially important if you import styles from third-party modules

### Basic setup

The simplest way to implement this configuration is to stuff it in a single rule of your webpack configuration file:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: [
                require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
                require.resolve('styled-jsx/babel'),
              ]
            }
          },
          'styled-jsx-css-loader'
        ]
      }
    ]
  }
};
```

With this setup, your project must depend on:

- [babel-loader](https://github.com/babel/babel-loader)
- [babel-plugin-transform-es2015-modules-commonjs](https://www.npmjs.com/package/babel-plugin-transform-es2015-modules-commonjs)
- [styled-jsx](https://www.npmjs.com/package/styled-jsx)
- [styled-jsx-css-loader](https://github.com/coox/styled-jsx-css-loader)

### Setup with Next.js

If you are using [Next.js](https://github.com/zeit/next.js), there are a few more requirements and caveats.

You **must** configure webpack to emit loaded files as JavaScript modules in the `.next/dist` build directory, by using Next.js’ built-in [emit-file-loader](https://github.com/zeit/next.js/blob/master/server/build/loaders/emit-file-loader.js).

It is easier to use Babel presets exclusively (rather than a mix of presets and plugins) in your project’s configuration. Therefore it is **recommended** to leverage the [next/babel](https://github.com/zeit/next.js/blob/canary/server/build/babel/preset.js) preset that is shipped with Next.js:

- to transform ES2015 modules, using the [modules](https://github.com/babel/babel/tree/master/experimental/babel-preset-env#modules) setting of the babel-preset-env plugin, which is part of the next/babel preset
- to use styled-jsx using the styled-jsx/babel plugin, which is also part of the next/babel preset

Putting it all together, use the following preset in your project’s `.babelrc`:

```json
{
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {
          "modules": "commonjs"
        }
      }
    ]
  ]
}
```

Then, customize Next.js’ webpack rules in your project’s [next.config.js](https://github.com/zeit/next.js#customizing-webpack-config) file, to use your project’s Babel configuration (and no other) for your CSS files:

```js
module.exports = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.css$/,
        use: [
          {
            loader: 'emit-file-loader',
            options: {
              name: 'dist/[path][name].[ext].js',
            },
          },
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              extends: path.resolve(__dirname, './.babelrc'),
            },
          },
          'styled-jsx-css-loader',
        ],
      }
    );

    return config;
  },
};
```

With this setup, your project must depend on:

- [babel-loader](https://github.com/babel/babel-loader)
- [next](https://github.com/zeit/next.js)
- [styled-jsx-css-loader](https://github.com/coox/styled-jsx-css-loader)

## Credits and acknowledgements

This loader was inspired by [raw-loader](https://github.com/webpack-contrib/raw-loader), and Next.js’ [with-global-stylesheet example](https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet).

Many thanks to styled-jsx author [Giuseppe Gurgone](https://twitter.com/giuseppegurgone).

## License

MIT
