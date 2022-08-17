function checkURL(string){
  try{
    const url = new URL(string)
  }
  catch(e){
    return false
  }
  return true
}

module.exports = checkURL
