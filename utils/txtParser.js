// utils/txtParser.js
export const parseTXT = async (file) => {
  const text = await file.text()
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const data = line.split(',')
    return headers.reduce((acc, header, i) => {
      acc[header] = data[i]
      return acc
    }, {})
  })
}
