export default (htmlDoc) => {
  const sensorDataReg = /\d+/gi

  let [, , light, temp] = htmlDoc.match(sensorDataReg)
  return [light, temp]
}
