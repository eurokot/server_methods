const path = require('path');

const allPath = () => path.join(__dirname, '../static');
const createPath = (page) => path.join(__dirname, '../static', `${page}.html`);

module.exports = {
  allPath,
  createPath,
};
