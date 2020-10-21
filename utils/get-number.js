async function GetNumber (model) {
  const record = await model.findOne().sort('-number')
  if (record && record.number) {
    return record.number + 1
  } else {
    return 1
  }
}

module.exports = GetNumber
