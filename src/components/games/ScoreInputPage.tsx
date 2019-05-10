import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'

import HoleInfoBar from './HoleInfoBar'
import PlayerScoreList from './PlayerScoreList'
import gamesService from '../../services/gamesService'

const useStyles = makeStyles((theme) => ({
}))

const ScoreInputPage: React.FC<{}> = (props: any) => {
  const classes = useStyles()
  const gameId = props.match.params.gameid // Props type as any to avoid props.match problem.
  
  const [game, setGame] = useState()
  const [holeNum, setHoleNum] = useState(1) // TODO: Use findIndex() to start from first 0 stroked hole
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    gamesService.getGame(gameId).then((fetchedGame) => {
      setGame(fetchedGame)
    })
  }, [gameId])
  
  const updateScores = (newScores: PlayerScores[]) => {
    const newGame = {
      ...game,
      scores: newScores,
    }
    setGame(newGame)
  }

  const handleHoleChange = () => {
    // TODO: Call updateGame only if 1 second has passed since last update
    setUpdating(true)
    gamesService.updateGame(game).then(() => {
      setUpdating(false)
    })
  }

  if (game !== undefined) {
    return (
      <div>
        <HoleInfoBar />
        <PlayerScoreList scores={game.scores} holeNumber={holeNum} onScoreChange={updateScores} updating={updating} />
        {/* Prev/Next hole buttons */}
        {/* Bottom navigation component (scores, hole info, map, game) */}
      </div>
    )
  } else {
    return (<div>Loading...</div>) // TODO: Better loading screen
  }
}

export default ScoreInputPage
