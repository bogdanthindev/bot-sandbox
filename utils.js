const toText = message => {
  return {
    type: 'text', content: message }
}

const toImage = image => {
  return {
    type: 'image', content: image }
}

const random = array => { return array[Math.floor(Math.random() * array.length)] }

const sendMessageByType = {
  image: (builder, session, elem) => session.send(new builder.Message().addAttachment({
    contentType: 'image/png',
    contentUrl: elem.content
  })),
  text: (builder, session, elem) => session.send(elem.content)
}

module.exports = { toImage, toText, random, sendMessageByType }
