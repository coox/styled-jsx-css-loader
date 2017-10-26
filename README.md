# styled-jsx/css loader

A loader for webpack that lets you import CSS files as a [styled-jsx](https://www.npmjs.com/package/styled-jsx) `css`-tagged template literal.

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

The loaded module is intended to be Babel-transformed by styled-jsx. Therefore you will typically pass styled-jsx-css-loader’s output to [babel-loader](https://github.com/babel/babel-loader), which must use a configuration that:

- transforms module imports
- includes the [styled-jsx/babel](https://github.com/zeit/styled-jsx/blob/master/src/babel.js) plugin

A typical webpack configuration would enable the loader by including a rule similar to this:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'babel-loader',
          'styled-jsx-css-loader'
        ]
      }
    ]
  }
};
```

In the sample config above, styled-jsx-css-loader is used first, and babel-loader then used to enable transformation of the loaded module by styled-jsx.

If you are using Next.js, you need to add its [emit-file-loader](https://github.com/zeit/next.js/blob/master/server/build/loaders/emit-file-loader.js), and the configuration would reside in a [next.config.js](https://github.com/zeit/next.js#customizing-webpack-config) file, typically similar to:

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
              name: 'dist/[path][name].[ext]',
            },
          },
          'babel-loader',
          'styled-jsx-css-loader',
        ],
      }
    );

    return config;
  },
};
```

## Credits and acknowledgements

This loader was inspired by [raw-loader](https://github.com/webpack-contrib/raw-loader), and Next.js’ [with-global-stylesheet example](https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet).

Many thanks to styled-jsx author [Giuseppe Gurgone](https://twitter.com/giuseppegurgone).

## License

MIT
