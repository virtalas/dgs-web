import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import ScoreCard from './ScoreCard'

describe.only('<ScoreCard />', () => {

  let game
  let scoreCard

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
    scoreCard = shallow(<ScoreCard game={game} />).dive()
  })

  it('renders content', () => {
    // Correct number of rows & columns
    expect(scoreCard.find('.left tr')).to.have.lengthOf(4)
    expect(scoreCard.find('.left td')).to.have.lengthOf(4)
    expect(scoreCard.find('.middle tr')).to.have.lengthOf(4)
    expect(scoreCard.find('.middle td')).to.have.lengthOf(21 * 4)
    expect(scoreCard.find('.right tr')).to.have.lengthOf(4)
    expect(scoreCard.find('.right td')).to.have.lengthOf(4)

    // Correct contents

    const leftCells = scoreCard.find('.left td').map(column => column.text())
    expect(leftCells[0]).contain("Hole")
    expect(leftCells[1]).contain("PAR")
    expect(leftCells[2]).contain("Seppo")
    expect(leftCells[3]).contain("Teppo")

    const middleCells = scoreCard.find('.middle td').map(column => column.text())
    for (let i = 0; i < game.course.pars.length; i++) {
      expect(middleCells[i]).contain(i + 1 + "") // Hole number
    }
    let offset = game.course.pars.length

    expect(middleCells[offset]).contain("Total")
    offset++

    for (let i = 0; i < game.course.pars.length; i++) {
      expect(middleCells[offset + i]).contain(game.course.pars[i] + "") // Hole par number
    }
    offset += game.course.pars.length

    expect(middleCells[offset]).contain(game.course.total + "")
    offset++

    for (let i = 0; i < game.scores[0].strokes.length; i++) {  // Player #1 scores
      if (game.scores[0].strokes[i] === 0) {
        expect(middleCells[offset + i]).contain("-") // Skipped hole marker
      } else {
        expect(middleCells[offset + i]).contain(game.scores[0].strokes[i] + "")
      }
    }
    offset += game.scores[0].strokes.length

    expect(middleCells[offset]).contain(game.scores[0].total + "")
    offset++

    for (let i = 0; i < game.scores[1].strokes.length; i++) {  // Player #2 scores
      if (game.scores[1].strokes[i] === 0) {
        expect(middleCells[offset + i]).contain("-") // Skipped hole marker
      } else {
        expect(middleCells[offset + i]).contain(game.scores[1].strokes[i] + "")
      }
    }
    offset += game.scores[1].strokes.length

    expect(middleCells[offset]).contain(game.scores[1].total + "")
    offset++

    const rightCells = scoreCard.find('.right td').map(column => column.text())
    expect(rightCells[0]).contain("Par")
    expect(rightCells[1]).contain("0")
    expect(rightCells[2]).contain("-3")
    expect(rightCells[3]).contain("+1")
  })

  it('renders different hole counts correctly', () => {
    
  })
})
