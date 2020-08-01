function articleReducer (data) {
  function setTitle (title) {
    return title
  }
  function setDesc (description) {
    return description
  }
  function setCreatedTime (time) {
    return time
  }
  function setUpdatedTime (time) {
    return time
  }
  function setContent (content) {
    return content
  }

  return {
    setTitle,
    setDesc,
    setCreatedTime,
    setUpdatedTime,
    setContent
  }
}

export default articleReducer