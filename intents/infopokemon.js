const request = require('superagent')
const { toText, toImage } = require('../utils')

const infoPokemonLayout = (json) => {
  const answer = [toText(`${json.name} infos`)]
  const toAdd = json.types.map(elem => elem.type.name).join(' / ')
  answer.push(toText(`Type(s): ${toAdd}`))
  if (json.sprites.front_default) {
    answer.push(toImage(json.sprites.front_default))
  }
  return answer
}

const statsInfoLayout = (json) => {
  const answer = [toText(`${json.name} statistics`)]
  if (json.sprites.front_default) {
    answer.push(toImage(json.sprites.front_default))
  }
  const statsArray = json.stats
  statsArray.map(stat => answer.push(toText(`${stat.stat.name} -> ${stat.base_stat}`)))
  return answer
}

const getInfoPokemon = (entity, type) => {
  if (!entity) {
    return Promise.reject('You didn\'t gave me any pokemon')
  }

  return new Promise((resolve, reject) => {
    request.get('https://pokeapi.co/api/v2/pokemon/' + entity.raw)
    .end((err, res) => {
      if (err) { return reject('ERROR') }
      if (type === 'statpokemon') {
        resolve(statsInfoLayout(res.body))
      } else {
        resolve(infoPokemonLayout(res.body))
      }
    })
  })
}
module.exports = getInfoPokemon

