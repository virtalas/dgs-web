import React from 'react'
import { expect } from 'chai'

import { createShallow } from '@material-ui/core/test-utils'

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
          total: 49,
          toPar: 4
        },
        {
          player: {
            id: 3,
            firstName: "Teppo",
          },
          strokes: [3,3,4,2,3,3,3,3,3,2,3,6,3,3,2,3,3,2,2,2],
          obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          total: 58,
          toPar: -2
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
    scoreCard = createShallow()(<ScoreCard game={game} />)
  })

  it('renders content', () => {
    // Correct number of rows & columns
    expect(scoreCard.find('[className^="Hook-leftTable"]').find('tr')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-leftTable"]').find('td')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-middleContainer"]').find('tr')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-middleContainer"]').find('td')).to.have.lengthOf(21 * 4)
    expect(scoreCard.find('[className^="Hook-rightTable"]').find('tr')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-rightTable"]').find('td')).to.have.lengthOf(4)

    // Correct contents

    const leftCells = scoreCard.find('[className^="Hook-leftTable"]').find('td').map(column => column.text())
    expect(leftCells[0]).contain("Hole")
    expect(leftCells[1]).contain("PAR")
    expect(leftCells[2]).contain("Seppo")
    expect(leftCells[3]).contain("Teppo")

    const middleCells = scoreCard.find('[className^="Hook-middleContainer"]').find('td').map(column => column.text())
    checkMiddleCellContents(middleCells, game)

    const rightCells = scoreCard.find('[className^="Hook-rightTable"]').find('td').map(column => column.text())
    expect(rightCells[0]).contain("Par")
    expect(rightCells[1]).contain("0")
    expect(rightCells[2]).contain("+4")
    expect(rightCells[3]).contain("-2")

    expect(scoreCard.find('[className^="Hook-ob-"]')).to.have.lengthOf(10) // Render only max three ob markers per cell
  })

  it('renders different hole counts correctly', () => {
    game.course.pars = [3,3,3,3,3,3,3,3,3]
    game.scores[0].strokes = [3,3,3,3,3,3,3,3,3]
    game.scores[0].obs = [0,0,0,0,0,0,0,0,0]
    game.scores[1].strokes = [3,3,3,3,3,3,3,3,3]
    game.scores[1].obs = [0,0,0,0,0,0,0,0,0]
    scoreCard = createShallow()(<ScoreCard game={game} />)

    // Correct number of rows & columns
    expect(scoreCard.find('[className^="Hook-leftTable"]').find('tr')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-leftTable"]').find('td')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-middleContainer"]').find('tr')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-middleContainer"]').find('td')).to.have.lengthOf(10 * 4) // Only 9+1 insted of 20+1
    expect(scoreCard.find('[className^="Hook-rightTable"]').find('tr')).to.have.lengthOf(4)
    expect(scoreCard.find('[className^="Hook-rightTable"]').find('td')).to.have.lengthOf(4)

    // Correct contents

    const leftCells = scoreCard.find('[className^="Hook-leftTable"]').find('td').map(column => column.text())
    expect(leftCells[0]).contain("Hole")
    expect(leftCells[1]).contain("PAR")
    expect(leftCells[2]).contain("Seppo")
    expect(leftCells[3]).contain("Teppo")

    const middleCells = scoreCard.find('[className^="Hook-middleContainer"]').find('td').map(column => column.text())
    checkMiddleCellContents(middleCells, game)

    const rightCells = scoreCard.find('[className^="Hook-rightTable"]').find('td').map(column => column.text())
    expect(rightCells[0]).contain("Par")
    expect(rightCells[1]).contain("0")
    expect(rightCells[2]).contain("+4")
    expect(rightCells[3]).contain("-2")

    expect(scoreCard.find('[className^="Hook-ob-"]')).to.have.lengthOf(0)
  })

  it('renders colors according to score and hole par', () => {
    const middleCells = scoreCard.find('[className^="Hook-middleContainer"]').find('td')
    let offset = game.course.pars.length * 2 + 2

    // Player #1
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-bogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-overBogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-overBogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-overBogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(middleCells.at(offset++).hasClass('')).to.equal(true)
    expect(middleCells.at(offset++).hasClass('')).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-holeInOne/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    offset++

    // Player #2
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-bogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-bogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-overBogey/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-eagle/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-par/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
    expect(/^Hook-birdie/.test(middleCells.at(offset++).prop('className'))).to.equal(true)
  })
})

function checkMiddleCellContents(middleCells, givenGame) {
  // Hole number
  for (let i = 0; i < givenGame.course.pars.length; i++) {
    expect(middleCells[i]).contain(i + 1 + "")
  }
  let offset = givenGame.course.pars.length

  expect(middleCells[offset]).contain("Total")
  offset++

  // Hole par number
  for (let i = 0; i < givenGame.course.pars.length; i++) {
    expect(middleCells[offset + i]).contain(givenGame.course.pars[i] + "")
  }
  offset += givenGame.course.pars.length

  expect(middleCells[offset]).contain(givenGame.course.total + "")
  offset++

  // Player #1 scores
  for (let i = 0; i < givenGame.scores[0].strokes.length; i++) {
    if (givenGame.scores[0].strokes[i] === 0) {
      expect(middleCells[offset + i]).contain("-") // Skipped hole marker
    } else {
      expect(middleCells[offset + i]).contain(givenGame.scores[0].strokes[i] + "")
    }
  }
  offset += givenGame.scores[0].strokes.length

  expect(middleCells[offset]).contain(givenGame.scores[0].total + "")
  offset++

  // Player #2 scores
  for (let i = 0; i < givenGame.scores[1].strokes.length; i++) {
    if (givenGame.scores[1].strokes[i] === 0) {
      expect(middleCells[offset + i]).contain("-") // Skipped hole marker
    } else {
      expect(middleCells[offset + i]).contain(givenGame.scores[1].strokes[i] + "")
    }
  }
  offset += givenGame.scores[1].strokes.length

  expect(middleCells[offset]).contain(givenGame.scores[1].total + "")
}
