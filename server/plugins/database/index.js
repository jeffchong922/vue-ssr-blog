module.exports = (server) => {
  const mongoose = require('mongoose')

  mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }, err => {
    err && console.log(`Connect database err: `, err)
    if (!err) {
      server.listen(process.env.SERVER_PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`)
      })
    }
  })
}