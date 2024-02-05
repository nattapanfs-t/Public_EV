const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://110.164.161.9:8107',
      changeOrigin: true,
    })
  );
};
