import React, { useEffect, useRef } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { CancelTokenSource } from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'

import playersService from '../../services/playersService'
import baseService from '../../services/baseService'
import coursesService from '../../services/coursesService'
import { birdieGreen, bogeyOrange, eagleYellow, holeInOneRed, overBogeyPurple, parGreen } from '../../constants/Colors'

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
  holeScoreDistribution?: HoleScoreDistribution[],
  setHoleScoreDistribution: (hsd: HoleScoreDistribution[]) => void,
}

const HoleInfoView: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { holeIndex, setHoleIndex, swipeableViewStyle, game, highScores, setHighScores, holeScoreDistribution, setHoleScoreDistribution } = props

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchHighScores = async () => {
      if (highScores) return
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

    const fetchHoleScoreDistribution = async () => {
      if (holeScoreDistribution) return
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const hsd = await coursesService.getLayoutScoreDistribution(game.layout.id, cancelTokenSourceRef.current)
      setHoleScoreDistribution(hsd)
    }

    const initialFetchData = async () => {
      await fetchHighScores()
      fetchHoleScoreDistribution()
    }

    initialFetchData()

    return () => cancelTokenSourceRef.current?.cancel()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const holeScoreData = holeScoreDistribution ? holeScoreDistribution[holeIndex] : undefined
  const scoreChartData = holeScoreData ? [
    { name: 'ace', value: holeScoreData.holeInOneCount },
    { name: 'eagle', value: holeScoreData.eagleCount },
    { name: 'birdie', value: holeScoreData.birdieCount },
    { name: 'par', value: holeScoreData.parCount },
    { name: 'bogey', value: holeScoreData.bogeyCount },
    { name: 'over bogey', value: holeScoreData.overBogeyCount },
  ] : []

  const holeHasScores = holeScoreData && (
    holeScoreData.holeInOneCount > 0 ||
    holeScoreData.eagleCount > 0 ||
    holeScoreData.birdieCount > 0 ||
    holeScoreData.parCount > 0 ||
    holeScoreData.bogeyCount > 0 ||
    holeScoreData.overBogeyCount > 0
  )

  const COLORS = [holeInOneRed, eagleYellow, birdieGreen, parGreen, bogeyOrange, overBogeyPurple]

  // @ts-ignore
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent === 0) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const scoreDistributionChart = holeHasScores && holeScoreDistribution && (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={scoreChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            animationDuration={700}
            fill="#8884d8"
            dataKey="value"
          >
            {scoreChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )

  const avgScoreString = 'Average score: ' + holeScoreData?.holeAvgScore
  let difficultyPlacementString = holeScoreData?.holeDifficultyPlacement + '. most difficult'
  if (holeScoreData && holeScoreData.holeDifficultyPlacement === 1) {
    difficultyPlacementString = 'Most difficult hole'
  } else if (holeScoreData && holeScoreData.holeDifficultyPlacement === game.layout.holes.length) {
    difficultyPlacementString = 'Easiest hole'
  }

  return (
    <SwipeableViews
      id="holeInfoView"
      className={swipeableViewStyle}
      resistance
      index={holeIndex}
      onChangeIndex={(index: number) => setHoleIndex(index)}
    >
      {holeHasScores && game.layout.holes.map((hole, index) => (
        <div className={classes.page} key={index}>
          <br /><br /><br />

          <Typography variant="h6" gutterBottom>
            High scores
          </Typography>
          
          {highScoresTable}

          <br />

          <Typography variant="h6" gutterBottom>
            Hole statistics
          </Typography>

          {scoreDistributionChart && (
            <Typography gutterBottom>
              {avgScoreString}<br />
              {difficultyPlacementString}
            </Typography>
          )}

          {scoreDistributionChart}

          {/* <Typography variant="h6" gutterBottom>
            Course statistics
          </Typography> */}
        </div>
      ))}
    </SwipeableViews>
  )
}

export default HoleInfoView
