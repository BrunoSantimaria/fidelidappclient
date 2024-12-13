const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  // Resto de tu configuración de Webpack
  plugins: [new BundleAnalyzerPlugin()],
  rules: [
    {
      test: /pdf\.worker\.js$/,
      use: { loader: "worker-loader" },
    },
  ],
};
