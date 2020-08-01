module.exports = app => {
  const router = require('express').Router(),
        userModel = require('../models/User'),
        { checkAuth } = require('../middleware'),
        { getSalt, getHashedString, validateString, getToken } = require('../utils/encryptor')

  // 若无需求 请关闭此路由
  // router.post('/sign-up', async (req, res, next) => {
  //   try {
  //     const { username, password } = req.body

  //     const existUser = await userModel.findOne({ username })
  //     if (existUser) return res.status(409).json({ /* 409:conflict */
  //       code: 409,
  //       error: {
  //         message: '409 | 当前用户已注册'
  //       }
  //     })

  //     const salt = await getSalt()
  //     const hashedPass = await getHashedString(password, salt)

  //     const createdUser = new userModel({
  //       username,
  //       password: hashedPass,
  //       salt
  //     })
  //     await createdUser.save()
  //     res.status(201).json({
  //       code: 201,
  //       data: {
  //         id: createdUser.id,
  //         name: createdUser.username
  //       }
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // })

  router.post('/sign-in', async (req, res, next) => {
    try {
      const { username, password } = req.body

      const existUser = await userModel.findOne({ username })
      if (!existUser) return res.status(401).json({ /* 401:unauthorized */
        code: 401,
        error: {
          message: '401 | 用户未注册'
        }
      })

      const isValid = await validateString(password, existUser.password, existUser.salt)
      if (!isValid) return res.status(401).json({ /* 401:unauthorized */
        code: 401,
        error: {
          message: ' 401 | 密码验证失败'
        }
      })

      const token = await getToken(
        {
          username: existUser.username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES || '7d'
        }
      )

      res.json({
        code: 200,
        data: {
          accessToken: token
        }
      })
    } catch (error) {
      next(error)
    }
  })

  router.post('/sign-in-token', checkAuth, async (req, res, next) => {
    try {
      console.log('signIn by token : ', req.body['username'])
      const { username } = req.body

      const existUser = await userModel.findOne({ username })
      if (!existUser) return res.status(401).json({ /* 401:unauthorized */
        code: 401,
        error: {
          message: '401 | 用户未注册'
        }
      })

      const token = await getToken(
        {
          username: existUser.username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES || '7d'
        }
      )

      res.json({
        code: 200,
        data: {
          accessToken: token
        }
      })
    } catch (error) {
      next(error)
    }
  })

  app.use('/api/auth', router)
}