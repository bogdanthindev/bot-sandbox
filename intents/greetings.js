const { toText, random } = require('../utils')

const getGreetings = () => {
  const answers = [
    'Hello!',
    'Yo ;)',
    'Hey, nice to see you.',
    'Welcome back!',
    'Hi, how can I help you?',
    'Hey, what do you need?'
  ]
  return Promise.resolve([toText(random(answers))])
}
module.exports = getGreetings
