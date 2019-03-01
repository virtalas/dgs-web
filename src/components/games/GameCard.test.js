import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Typography from '@material-ui/core/Typography'

import GameCard from './GameCard'
import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'

describe.only('<GameCard />', () => {

  let game
  let gameCard

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
    gameCard = shallow(<GameCard game={game} />).dive()
  })

  it('renders content', () => {
    expect(gameCard.find(Typography).at(0).dive().dive().text()).contain(game.course.name)
    expect(gameCard.find(Typography).at(1).dive().dive().text()).contain(game.endDate)
    expect(gameCard.find(ScoreCard)).to.have.lengthOf(1)
    expect(gameCard.find(GameInfo)).to.have.lengthOf(1)
  })
})
