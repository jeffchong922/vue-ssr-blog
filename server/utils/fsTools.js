const { promises } = require('fs')

const getImageContent = async (path) => {
  const content = await promises.readFile(path, 'binary')
  return content
}

module.exports = {
  getImageContent
}