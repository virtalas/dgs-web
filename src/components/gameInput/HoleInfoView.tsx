import React, { useEffect, useRef } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { CancelTokenSource } from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { isMobile } from 'react-device-detect'

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
import HoleNavigation from './HoleNavigation'

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
  game?: Game,
  layout: GameLayout,
  highScores?: CourseHighScore[],
  setHighScores?: (highScores: CourseHighScore[]) => void,
  holeScoreDistribution?: HoleScoreDistribution[],
  setHoleScoreDistribution: (hsd: HoleScoreDistribution[]) => void,
}

const HoleInfoView: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { holeIndex, setHoleIndex, swipeableViewStyle, game, layout, highScores, setHighScores, holeScoreDistribution, setHoleScoreDistribution } = props
  const isGameInput = game !== undefined

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchHighScores = async () => {
      if (highScores || !game || !setHighScores) return
      let fetchedHighScores: CourseHighScore[] = []

      for (let i = 0; i < game.scores.length; i++) {
        cancelTokenSourceRef.current = baseService.cancelTokenSource()
        let playerHighScores = undefined

        try {
          playerHighScores = await playersService.getHighScores(game.scores[i].player.id, cancelTokenSourceRef.current)
        } catch (error) {
          console.log('Failed to fetch high score for a player: ' + error)
        }

        const layoutHighScore = playerHighScores?.flatMap(phs => phs.layoutHighScores).find(phs => phs.layoutId === game.layout.id)?.toPar
        if (!layoutHighScore) continue

        fetchedHighScores.push({
          player: game.scores[i].player,
          highScore: layoutHighScore,
        })
      }

      setHighScores(fetchedHighScores)
    }

    const fetchHoleScoreDistribution = async () => {
      if (holeScoreDistribution || !game) return
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


  const getHoleScoreData = (index: number): HoleScoreDistribution | undefined => {
    return holeScoreDistribution ? holeScoreDistribution[index] : undefined
  }

  const holeScoreData = getHoleScoreData(holeIndex)
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

  const createAvgScoreString = (hsd?: HoleScoreDistribution): string => {
    let avgScoreString = 'Average score: ' + hsd?.holeAvgScore
    if (hsd && hsd.holeAvgToPar >= 0) {
      avgScoreString += ` (+${hsd.holeAvgToPar})`
    } else if (hsd) {
      avgScoreString += ` (${hsd.holeAvgToPar})`
    }
    return avgScoreString
  }

  const createDifficultyPlacementString = (hsd: HoleScoreDistribution | undefined): string => {
    if (!hsd) return ''

    if (hsd.holeDifficultyPlacement === 1) {
      return 'Most difficult hole'
    } else if (hsd.holeDifficultyPlacement === layout.holes.length) {
      return 'Easiest hole'
    }

    const middleIndex = Math.round((layout.holes.length - 1) / 2)

    if (hsd.holeDifficultyPlacement - 1 >= middleIndex) {
      const holeEasinessPlacement = layout.holes.length - hsd.holeDifficultyPlacement + 1
      return holeEasinessPlacement + '. easiest'
    }

    return hsd.holeDifficultyPlacement + '. most difficult'
  }

  const handlePrevHoleClick = () => {
    if (holeIndex > 0) {
      handleHoleChange(holeIndex - 1)
    }
  }

  const handleNextHoleClick = () => {
    if (holeIndex !== layout.holes.length - 1) {
      handleHoleChange(holeIndex + 1)
    }
  }

  const handleHoleChange = (newHoleIndex: number) => {
    setHoleIndex(newHoleIndex)
  }

  // Render hole navigation buttons for desktop.
  const holeNavigation = isMobile ? null : (
    <HoleNavigation
      onPrevHole={handlePrevHoleClick}
      onNextHole={handleNextHoleClick}
    />
  )

  return (
    <div>
      <SwipeableViews
        id="holeInfoView"
        className={swipeableViewStyle}
        resistance
        index={holeIndex}
        onChangeIndex={(index: number) => setHoleIndex(index)}
      >
        {holeHasScores && layout.holes.map((hole, index) => (
          <div className={classes.page} key={index}>
            {isGameInput && (
              <div>
                <br /><br /><br />
              </div>
            )}

            {isGameInput && (
              <Typography variant="h6" gutterBottom>
                High scores
              </Typography>
            )}
            
            {highScoresTable}

            <br />

            <Typography variant="h6" gutterBottom>
              Hole {!isGameInput && hole.number} statistics
            </Typography>

            {!isGameInput && (
              <Typography>
                Par {hole.par}
              </Typography>
            )}

            {scoreDistributionChart && (
              <Typography gutterBottom>
                {createAvgScoreString(getHoleScoreData(index))}
                <br />
                {createDifficultyPlacementString(getHoleScoreData(index))}
              </Typography>
            )}

            {scoreDistributionChart}

            {/* <Typography variant="h6" gutterBottom>
              Course statistics
            </Typography> */}

          </div>
        ))}
      </SwipeableViews>

      {holeNavigation}
    </div>
  )
}

export default HoleInfoView
