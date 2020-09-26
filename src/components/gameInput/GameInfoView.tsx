import React from 'react'
import { Button } from '@material-ui/core'

import GameCard from '../gameCard/GameCard'

interface Props {
  game: Game,
}

// TODO: Editable comment area (grey placeholder text: "Click to edit")
// TODO: Editable conditions & illegal/high scorers: greyed out buttons that activate when tapped.

const GameInfoView: React.FC<Props> = (props) => {
  const { game } = props

  const handleFinish = () => {
    
  }

  return (
    <div>
      <br /><br /><br />
      <GameCard game={game} />
      <br />
      <Button variant="contained" color="primary" onClick={handleFinish}>
        Finish game
      </Button>
    </div>
  )
}

export default GameInfoView
