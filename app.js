const express = require('express')
const exhbs = require('express-handlebars')

const app = express()
const port = 3000

app.engine('handlebars', exhbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.get('/', (req, res) => {
  return res.render('show')
})

app.listen(port, () => console.log(`It is listening on http://localhost:${port}`))