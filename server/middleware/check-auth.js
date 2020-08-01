const { getTokenMsg } = require('../utils/encryptor')

const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization')
    if (!authHeader) return res.status(400).json({
      code: 400,
      error: {
        message: '400 | 未添加认证信息'
      }
    })
  
    const token = authHeader.split(' ').pop()
    if (!token) return res.status(400).json({
      code: 400,
      error: {
        message: '400 | 未添加认证信息'
      }
    })
    const decode = await getTokenMsg(token, process.env.JWT_SECRET)
    console.log('jwt decode: ', decode)
    /* 根据jwt数据进行设置 */
    req.body['username'] = decode.username
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = checkAuth
