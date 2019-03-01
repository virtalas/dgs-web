import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import Games from './Games'
import GameCard from './GameCard'

describe.only('<Games />', () => {

  let games
  let gamesPage

  beforeEach(() => {
    games = [{
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
          strokes: [3,3,3,2,3,3,0,0,3,2,3,3,1,3,3,3,3,2,3,3],
          obs: [0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          total: 48,
          toPar: -3
        },
      ],
      temperature: 1,
      weatherConditions: ["snow", "rain"],
      conditions: ["LED"],
      highScorers: ["Teppo"],
      illegalScorers: ["Seppo"],
      comment: "Fun :D",
      contestName: null,
    },
    {
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
          strokes: [3,3,3,2,3,3,0,0,3,2,3,3,1,3,3,3,3,2,3,3],
          obs: [0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          total: 48,
          toPar: -3
        },
      ],
      temperature: 1,
      weatherConditions: ["snow", "rain"],
      conditions: ["LED"],
      highScorers: ["Teppo"],
      illegalScorers: ["Seppo"],
      comment: "Fun :D",
      contestName: null,
    }]
    gamesPage = shallow(<Games games={games} />)
  })

  it('renders content', () => {
    // TODO
    // expect(gamesPage.find(GameCard)).to.have.lengthOf(2)
  })
})
