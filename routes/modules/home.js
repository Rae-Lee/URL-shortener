const express = require('express')
const router = express.Router()
const URLlist = require('../../models/url_list.js')
const shortenURL = require('../../utilities/shortenURL.js')
const checkURL = require('../../utilities/checkURL.js')
const checkURLExist = require('../../utilities/checkURLExist.js')
//首頁
router.get('/', (req, res) => {
  return res.render('show')
})
router.post('/', (req, res) => {
  const enterURL = req.body.url
  //輸入結果是空白
  if (enterURL.length === 0) {
    return res.render('show', { isError: true, formText: 'Please enter URL!' })
  }
  //輸入的URL格式不正確
  if (!checkURL(enterURL)) {
    return res.render('show', { isError: true, formText: 'Please enter valid URL!' })
  }
  //輸入的URL無法成功連線
  return checkURLExist(enterURL)
    .then(result => {
      if (!result) {
        return res.render('show', { isError: true, formText: 'URL do not exist!' })
      } else {
        //輸入的URL成功連線
        //若先前已輸入過，則回覆對應的短網址
        return URLlist.findOne({ inputURL: enterURL })
          .lean()
          .then(urlList => {
            if (urlList !== null) {
              return res.render('show', { shortURL: urlList.outputURL })
            }
            //若都沒有重複輸入，則新增短網址至資料庫
            const shortURL = req.protocol + '://' + req.hostname + ':' + port + '/' + shortenURL()
            return URLlist.create({ inputURL: enterURL, outputURL: shortURL })
              .then(() => {
                return res.render('show', { shortURL })
              })
          })
      }
    })
    .catch(error => console.log(error))
})
//導向原網址頁面
router.get('/:randomWords', (req, res) => {
  const randomWords = req.params.randomWords
  const url = req.protocol + '://' + req.hostname + ':' + port + '/' + randomWords
  return URLlist.findOne({ outputURL: url })
    .then(urlList => {
      res.redirect(urlList.inputURL)
    })
    .catch(error => console.log(error))
})

module.exports = router