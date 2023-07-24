const dotenv = require('dotenv');

console.log('process.env.ENVIRONMENT', process.env.ENVIRONMENT);
// console.log('process.env.ENVIRONMENT',dotenv.config({ path: `variables/.env.production` }).parsed)
const files = {
  ...dotenv.config({ path: './.env' }).parsed,
  ...dotenv.config({ path: `./.env.${process.env.ENVIRONMENT}` }).parsed,
  ...dotenv.config({ path: `./.env.${process.env.ENVIRONMENT}.local` }).parsed,
};

module.exports = function () {
  for (key in files) {
    if (typeof files[key] !== 'string') {
      files[key] = JSON.stringify(files[key]);
    }
  }
  return files;
};
