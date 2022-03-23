const path= require('path')
const CopyPlugin= require('copy-webpack-plugin')

module.exports= (env, argv) =>{
  return {
    stats: 'minimal', // Keep console output easy to read.
    entry: "./src/app.js",
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // Enable sourcemaps while debugging
    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/index.html', to: './' },
          { from: 'src/style.css', to: './' },
          { from: 'src/images/pause.png', to: './images/pause.png' },
          { from: 'src/images/next.png', to: './images/next.png' },
          { from: 'src/images/play.png', to: './images/play.png' },
          { from: 'src/images/trash.png', to: './images/trash.png' },
          { from: 'src/images/information.png', to: './images/information.png' },
        ]
      }),
    ],
  }
}
