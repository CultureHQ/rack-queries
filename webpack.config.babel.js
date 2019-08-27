import path from "path";

export default {
  output: {
    path: path.resolve(__dirname, "lib/rack/queries/static"),
    filename: "app.js"
  },
  entry: path.join(__dirname, "src", "App.tsx"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "awesome-typescript-loader", exclude: /node_modules/ }
    ]
  }
};
