import React from 'react'

import GameCard from '../gameCard/GameCard'

interface Props {
  game: Game,
}

// TODO: Editable comment area (grey placeholder text: "Click to edit")
// TODO: Editable conditions & illegal/high scorers: greyed out buttons that activate when tapped.

const GameInfoView: React.FC<Props> = (props) => {
  const { game } = props

  return (
    <div>
      <br /><br /><br />
      <GameCard game={game} />
      <br />[Send game]
    </div>
  )
}

export default GameInfoView
