const getGreetings = require('./intents/greetings.js')
const getInfoPokemon = require('./intents/infopokemon.js')
const config = require('./config.js')
const restify = require('restify')
const recastai = require('recastai')
const builder = require('botbuilder')
const { sendMessageByType } = require('./utils.js')

// Connection to Microsoft Bot Framework
const connector = new builder.ChatConnector({
  appId: config.appId,
  appPassword: config.appPassword
})
const bot = new builder.UniversalBot(connector)
const INTENTS = {
  greetings: getGreetings,
  statpokemon: getInfoPokemon,
  infopokemon: getInfoPokemon
}

const recastClient = new recastai.request(config.recast, 'en')
let senderId = null

bot.dialog('/', (session) => {
  // console.log(recastClient)
  recastClient.converseText(session.message.text, { conversationToken: senderId || null })
  .then(res => {
    console.log(res)
    const intent = res.intents[0]
    const entity = res.get('pokemon')
    console.log('entity', entity)
    senderId = res.conversationToken
    if (intent) {
      INTENTS[intent.slug](entity, intent.slug)
      .then(res => { res.forEach((message) => sendMessageByType[message.type](builder, session, message)) })
      .catch(err => { err.forEach((message) => sendMessageByType[message.type](builder, session, message)) })
    }
  })
  .catch(() => session.send('I need some sleep right now... Talk to me later!'))
})
// Server Init
const server = restify.createServer()
server.listen(8080)
server.post('/', connector.listen())
