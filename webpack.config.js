const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "lib/query_page/static"),
    filename: "app.js"
  },
  entry: path.join(__dirname, "src", "app.js"),
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "lib/query_page/static")
  }
};
