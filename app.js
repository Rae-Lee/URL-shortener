const express = require('express')
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const URLlist = require('./models/url_list.js')
const shortenURL = require('./utilities/shortenURL.js')
const checkURL = require('./utilities/checkURL.js')
const checkURLExist = require('./utilities/checkURLExist.js')
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
  const enterURL = req.body.url
  //輸入結果是空白
  if (enterURL.length === 0){
    return res.render('show', { isError: true, formText: 'Please enter URL!' })
  }
  //輸入的URL格式不正確
  if(!checkURL(enterURL)){
    return res.render('show', { isError: true, formText: 'Please enter valid URL!' })
  }
  //輸入的URL無法成功連線
  return checkURLExist(enterURL)
    .then(result => {
      if(!result){
        return res.render('show', { isError: true, formText: 'URL do not exist!' })
      }else{
        //輸入的URL成功連線
          //若先前已輸入過，則回覆對應的短網址
        return URLlist.findOne({ inputURL: enterURL })
          .lean()
          .then(urlList => {
            if (urlList !== null) {
              return res.render('show', { shortURL: urlList.outputURL })
            }
            //若都沒有重複輸入，則新增短網址至資料庫
            const shortURL = req.protocol + '://' + req.hostname + ':' + port + '/'+ shortenURL()
            return URLlist.create({ inputURL: enterURL, outputURL: shortURL })
              .then(() => {
                return res.render('show', { shortURL })
              })
          })
      }
    })
    .catch(error => console.log(error))
})
app.get('/:randomWords', (req, res) => {
  const randomWords = req.params.randomWords
  const url = req.protocol + '://' + req.hostname + ':' + port + '/' + randomWords
  return URLlist.findOne({ outputURL: url })
    .then(urlList =>{
      res.redirect(urlList.inputURL)
    })
    .catch(error => console.log(error))
})
app.listen(port, () => console.log(`It is listening on http://localhost:${port}`))