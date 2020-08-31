import React, { useState, useEffect } from 'react'

import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import GameCard from '../gameCard/GameCard'
import MonthControls from './MonthControls'
import gamesService from '../../services/gamesService'
import { dateFrom } from '../../utils/DateUtil'

// TODO: When the device is rotated, don't open the drawer -> show whole score card instead
// TODO: Fetch prev and next month as well.
// TODO: Fix bug: moving to previous month before games have loaded

const useStyles = makeStyles((theme) => ({
  root: {
    // No vertical scrolling even if views overflow:
    overflow: 'hidden',
    width: '100%',
  },
  topControls: {
    paddingTop: theme.spacing(2),
    margin: 0,
    marginBottom: -theme.spacing(3),
    width: '100%',
  },
  bottomControls: {
    paddingBottom: theme.spacing(12),
    margin: 0,
    width: '100%',
  },
  noGames: {
    color: 'grey',
    margin: 0,
    position: 'absolute',
    top: '50%',
    marginTop: -10, // Align with progress spinner
    left: '50%',
    marginLeft: -35, // Align with progress spinner
    transform: 'translate(-50 %, -50 %)',
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  centerContainer: {
    height: theme.spacing(30),
    position: 'relative',
    zIndex: -1, // Don't block navigation controls.
  },
}))

const Games: React.FC<{}> = () => {
  const classes = useStyles()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0 = January

  const [games, setGames] = useState<Game[]>([])
  const [fetchedMonths, setFetchedMonths] = useState<number[]>([]) // To store information about empty months
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth) // 0 = January
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [isLoading, setIsLoading] = useState<Boolean>(false)

  const gamesToShow = games.filter(game => dateFrom(game.endDate).getMonth() === selectedMonth
    && dateFrom(game.endDate).getFullYear() === selectedYear)

  // useEffect works like componentDidMount.
  // Will be rerun each time 'selectedYear' or 'selectedMonth' change.
  useEffect(() => {
    if (fetchedMonths.includes(selectedMonth)) return
    setIsLoading(true)
    setFetchedMonths(months => months.concat([selectedMonth]))
    gamesService.getGames(selectedYear, selectedMonth).then(fetchedGames => {
      // Simulate network delay.
      setTimeout(function () {
        setGames(games => games.concat(fetchedGames))
        setIsLoading(false)
      }, 500);
    })
  }, [selectedYear, selectedMonth, fetchedMonths])

  return (
    <div id="gamesPage" className={classes.root}>
      <div className={classes.topControls}>
        <MonthControls
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          fetchedMonths={fetchedMonths}
        />
      </div>
      {gamesToShow.map(game => (
        <GameCard game={game} key={game.id}/>
      ))}
      {gamesToShow.length === 0 && isLoading ? (
        <div className={classes.centerContainer}>
          <CircularProgress className={classes.progress} />
        </div>
      ) : null}
      {gamesToShow.length === 0 && !isLoading ? (
        <div className={classes.centerContainer}>
          <div className={classes.noGames}>No games</div>
        </div>
      ) : null}
      {gamesToShow.length > 2 ? (
        <div className={classes.bottomControls}>
          <MonthControls
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            fetchedMonths={fetchedMonths}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Games
