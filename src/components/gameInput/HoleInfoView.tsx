import React, { useEffect, useRef } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'

import playersService from '../../services/playersService'
import baseService from '../../services/baseService'

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(2),
  },
}))

export interface CourseHighScore {
  player: Player,
  highScore: number,
}

interface Props {
  holeIndex: number,
  setHoleIndex: (holeNum: number) => void,
  swipeableViewStyle: any,
  game: Game,
  highScores?: CourseHighScore[],
  setHighScores: (highScores: CourseHighScore[]) => void,
}

const HoleInfoView: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { holeIndex, setHoleIndex, swipeableViewStyle, game, highScores, setHighScores } = props

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchHighScores = async () => {
      let fetchedHighScores: CourseHighScore[] = []

      for (let i = 0; i < game.scores.length; i++) {
        cancelTokenSourceRef.current = baseService.cancelTokenSource()
        const playerHighScores = await playersService.getHighScores(game.scores[i].player.id, cancelTokenSourceRef.current)
        const layoutHighScore = playerHighScores.flatMap(phs => phs.layoutHighScores).find(phs => phs.layoutId === game.layout.id)?.toPar
        if (!layoutHighScore) continue
        fetchedHighScores.push({
          player: game.scores[i].player,
          highScore: layoutHighScore,
        })
      }

      setHighScores(fetchedHighScores)
    }

    if (highScores) return
    fetchHighScores()
    return () => cancelTokenSourceRef.current?.cancel()
  }, [game.layout.id, game.scores, highScores, setHighScores])

  const highScoresTable = highScores && (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Player</TableCell>
          <TableCell>To par</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {highScores.map(highScore => (
          <TableRow key={highScore.player.id}>
            <TableCell>{highScore.player.firstName}</TableCell>
            <TableCell>{highScore.highScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <SwipeableViews
      id="holeInfoView"
      className={swipeableViewStyle}
      resistance
      index={holeIndex}
      onChangeIndex={(index: number) => setHoleIndex(index)}
    >
      {game.layout.holes.map((hole, index) => (
        <div className={classes.page}>
          <br /><br /><br />

          <Typography variant="h6" gutterBottom>
            High scores on {game.layout.name}
          </Typography>
          
          {highScoresTable}

          <br />

          <Typography variant="h6" gutterBottom>
            Hole {hole.number} statistics
          </Typography>

          <Typography variant="body1" gutterBottom>
            pars/birdies/bogies/etc graph
          </Typography>

          {/* <Typography variant="h6" gutterBottom>
            Course statistics
          </Typography> */}
        </div>
      ))}
    </SwipeableViews>
  )
}

export default HoleInfoView
