const recastai = require('recastai')
const Robin = require('robin-js-sdk')

const robin = new Robin(process.env.ROBINAUTH)
// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    robin.api.organizations.get('thinslices').then(function (response) {
      message.addReply({ type: 'text', content: response.getData() })
    })
    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)
    }

    // If there is not any message return by Recast.AI for this current conversation
    if (!result.replies.length) {
      message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
    } else {
      // Add each reply received from API to replies stack
      result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
    }

    // Send all replies
    message.reply()
    .then(() => {
      // Do some code after sending messages
    })
    .catch(err => {
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
