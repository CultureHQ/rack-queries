const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "lib/rack/queries/static"),
    filename: "app.js"
  },
  entry: path.join(__dirname, "src", "app.js"),
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
    ]
  }
};
