function shortenURL(){
  let outputURL //宣告最終產生的網址
  const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const data = upperLetters + upperLetters.toLowerCase() + '1234567890'
  const options = data.split('')//選項裡包括大寫字母、小寫字母和數字
  //隨機從選項中抽取5個字母或數字
  for(let i = 1; i <= 5; i++){
    const index = Math.floor(Math.random() * options.length)
    outputURL += options[index]
  }
  return outputURL
}
module.exports = shortenURL
