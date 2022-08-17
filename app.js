const express = require('express')
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const URLlist = require('./models/url_list.js')
const shortenURL = require('./shortenURL.js')
const checkURL = require('./checkURL.js')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => console.log('mongoose error'))
db.once('open', () => console.log('mongoose connected'))

const app = express()
const port = 3000

app.engine('handlebars', exhbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  
  return res.render('show')
})
app.post('/', (req, res) => {
  const inputURL = req.body.url
  //輸入結果是空白
  if (inputURL.length === 0){
    return res.render('show', { isError: true, formText: 'Please enter URL!' })
  }
  //輸入結果非有效網址
  if(!checkURL(inputURL)){
    return res.render('show', { isError: true, formText: 'Please enter valid URL!' })
  }
  //輸入結果已重複輸入
  return URLlist.findOne({inputURL: inputURL})
    .lean()
    .then(urllist => {
      if(urllist !== null){
        return res.render('show', { outputURL: urllist.outputURL })
      }
       //若都沒有重複輸入，則新增至資料庫
      const outputURL = shortenURL()
      return URLlist.create({ inputURL: inputURL, outputURL: outputURL })
        .then(() => {
          return res.render('show', { outputURL })
        })
    })
    .catch(error => console.log(error))
})

app.listen(port, () => console.log(`It is listening on http://localhost:${port}`))