const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getSalt = async () => {
  return await bcrypt.genSalt(10)
}

const getHashedString = async (strOrigin, salt) => {
  return await bcrypt.hash(strOrigin, salt)
}

const validateString = async (strOrigin, strTarget, salt) => {
  const hashed = await getHashedString(strOrigin, salt)
  return strTarget === hashed
}

const getToken = async (data, secret, options = undefined) => {
  return jwt.sign(data, secret, options)
}

const getTokenMsg = async (token, secret) => {
  return jwt.verify(token, secret)
}

module.exports = {
  getSalt,
  getHashedString,
  validateString,
  getToken,
  getTokenMsg
}
