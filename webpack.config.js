module.exports = function (env) {
  let target = env.target;
  if (env.target === undefined) {
    target = 'dev';
  }
  return require(`./config/webpack.${target}.config.js`);
};
