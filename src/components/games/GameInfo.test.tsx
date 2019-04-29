import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import GameInfo from './GameInfo'

describe.only('<GameInfo />', () => {

  let game
  let info

  beforeEach(() => {
    game = {
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
    info = shallow(<GameInfo game={game} />).dive()
  })

  it('renders content', () => {
    expect(info.find('.chipRow')).to.have.lengthOf(2) // Chips are rendered in two rows
    expect(info.find(Chip)).to.have.lengthOf(6) // There should be 6 Chips in total

    // Contents
    expect(info.find(Chip).at(0).prop('label')).contain(game.temperature + " °C")
    expect(info.find(Chip).at(1).prop('label')).contain(game.weatherConditions[0])
    expect(info.find(Chip).at(2).prop('label')).contain(game.weatherConditions[1])
    expect(info.find(Chip).at(3).prop('label')).contain(game.conditions[0])
    expect(info.find(Chip).at(4).prop('label')).contain(game.highScorers[0])
    expect(info.find(Chip).at(5).prop('label')).contain(game.illegalScorers[0])
    expect(info.find(Typography).dive().dive().text()).contain(game.comment)
  })

  it('does not render empty conditions', () => {
    game.temperature = null
    game.weatherConditions = ["snow"]
    game.conditions = []
    game.highScorers = []
    game.illegalScorers = []
    game.comment = null
    game.contestName = null
    info = shallow(<GameInfo game={game} />).dive()

    expect(info.find('.chipRow').at(1).children()).to.have.lengthOf(0) // High / illegal scorers row has 0 Chips
    expect(info.find(Chip)).to.have.lengthOf(1)
  })

  it('does not render anything when no conditions', () => {
    game.temperature = null
    game.weatherConditions = []
    game.conditions = []
    game.highScorers = []
    game.illegalScorers = []
    game.comment = null
    game.contestName = null
    info = shallow(<GameInfo game={game} />).dive()

    expect(info.children()).to.have.lengthOf(0)
  })
})
