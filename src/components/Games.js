import React, { Component } from 'react'

import ScoreCard from './ScoreCard'

import '../css/Games.css'

const games = [{
  id: 123,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppo",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,1,3,3,3,3,2,3,3],
      obs: [0,0,2,3,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,6,3,3,2,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
},{
  id: 124,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppomoinen",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: [],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros.",
  contestName: null,
},{
  id: 125,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppo",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: null,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
},{
  id: 126,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppo",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
},{
  id: 127,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppo",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
},{
  id: 128,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppo",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
},{
  id: 129,
  course: {
    id: 5,
    name: "Puolarmaari",
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: 3,
        firstName: "Seppo",
      },
      strokes: [3,3,3,2,3,0,0,0,3,2,3,3,3,3,3,3,3,2,3,3],
      obs: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: 3,
        firstName: "Teppo",
      },
      strokes: [3,3,4,2,3,3,3,3,3,2,3,3,3,6,3,3,3,2,3,3],
      obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: null,
  weatherConditions: [],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "",
  contestName: null,
}]

class Games extends Component {
  render() {
    return (
      <div className="gamesContainer">
        {games.map(game => (
          <ScoreCard game={game} key={game.id}/>
        ))}
      </div>
    )
  }
}

export default Games
