const express = require('express')
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')
const dotenv =require('dotenv').config()
const shortenURL = require('./shortenURL.js')
const URLlist = require('./models/url_list.js')
const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => console.log('mongoose error'))
db.once('open', () => console.log('mongoose connected'))

app.engine('handlebars', exhbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  return res.render('show')
})
app.post('/', (req, res) => {
  const inputURL = req.body.url
  //輸入結果是非網址或空白
  //輸入結果已重複輸入
  const outputURL = shortenURL()
  res.render('show', { outputURL })
})

app.listen(port, () => console.log(`It is listening on http://localhost:${port}`))