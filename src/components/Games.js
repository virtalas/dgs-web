import React, { Component } from 'react'

import ScoreCard from './ScoreCard'

const games = [{
  id: 123,
  course: {
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      firstName: "Seppo",
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      firstName: "Teppo",
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  conditions: ["snow"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
}]

class Games extends Component {
  render() {
    return (
      <div>
        {games.map(game => (
          <ScoreCard game={game} key={game.id}/>
        ))}
      </div>
    )
  }
}

export default Games
