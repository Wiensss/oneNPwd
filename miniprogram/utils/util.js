const filterRecords = (records) => {
  if (!records || typeof records !== 'object') return []

  return Object.entries(records).reduce((result, [key, record]) => {
    if (typeof record === 'object' && record.hasOwnProperty('token'))
      result.push({ ...record })

    return result
  }, [])
}

module.exports = {
  filterRecords,
}
