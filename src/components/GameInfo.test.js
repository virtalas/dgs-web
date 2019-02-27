import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Chip from '@material-ui/core/Chip'
import GameInfo from './GameInfo'

const game = {
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
      obs: [0,1,2,3,4,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
  illegalScorers: ["Seppo"],
  comment: "Fun :D",
  contestName: null,
}

describe.only('<GameInfo />', () => {
  it('renders content', () => {
    const info = shallow(<GameInfo game={game} />).dive()

    expect(info.find('.chipRow')).to.have.lengthOf(2) // Chips are rendered in two rows
    expect(info.find(Chip)).to.have.lengthOf(6) // There should be 6 Chips in total

    expect(info.find(Chip).at(0).prop('label')).contain(game.temperature + " °C")
  })
})
