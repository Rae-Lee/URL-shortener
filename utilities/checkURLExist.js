async function checkURLExist(url){
  const res = await fetch(url)
  if (res.ok) {
    return true
  }else{
    return false
  }
}

module.exports = checkURLExist