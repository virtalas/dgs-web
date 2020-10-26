import React, { useState, useEffect } from 'react'

import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import GameCard from '../gameCard/GameCard'
import MonthControls from './MonthControls'
import gamesService from '../../services/gamesService'

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
  const currentMonth = new Date().getMonth()

  const [games, setGames] = useState<Game[]>([])
  const [fetchedMonths, setFetchedMonths] = useState<number[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth) // 0 = January
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [monthsThatHaveGames, setMonthsThatHaveGames] = useState<GameMonths[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const gamesToShow = games.filter(game => game.endDate.getMonth() === selectedMonth
    && game.endDate.getFullYear() === selectedYear)

  // useEffect() works like componentDidMount(): runs only once after the component is rendered.
  // In addition, it reruns each time 'selectedYear' or 'selectedMonth' change.
  useEffect(() => {
    if (fetchedMonths.includes(selectedMonth)) return // Don't refetch already fetched games.
    setIsLoading(true)

    const fetchGames = () => {
      gamesService.getGames(selectedYear, selectedMonth).then(fetchedGames => {
        setFetchedMonths(months => months.concat([selectedMonth])) // Mark games for this month as fetched.
        setGames(games => games.concat(fetchedGames))
        setIsLoading(false)
      })
    }

    if (!monthsThatHaveGames) {
      // First fetch a list of years and months that have games:
      gamesService.getMonthsThatHaveGames().then((gameMonths: GameMonths[]) => {
        setMonthsThatHaveGames(gameMonths)
        // Select the latest month & year that have games:
        setSelectedYear(gameMonths[0].year)
        setSelectedMonth(gameMonths[0].months[gameMonths[0].months.length - 1])
        // Since selectedYear/Month changed, component rerenders and fetchGames() happens.
      })
    } else {
      // Fetch games for selectedMonth.
      fetchGames()
    }
  }, [selectedYear, selectedMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearFetchedGames = () => {
    setFetchedMonths([])
    setGames([]) // Clear fetched games if year changed.
  }

  const setGame = (game: Game) => {
    let gameToUpdate = games.find(g => g.id === game.id) as Game
    let index = games.indexOf(gameToUpdate)
    games.fill(game, index, index++) // Replace gameToUpdate with game
    setGames(games)
  }

  return (
    <div id="gamesPage" className={classes.root}>
      <div className={classes.topControls}>
        <MonthControls
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          clearFetchedGames={clearFetchedGames}
          monthsThatHaveGames={monthsThatHaveGames}
        />
      </div>
      {gamesToShow.map(game => (
        <GameCard game={game} setGame={setGame} key={game.id}/>
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
            clearFetchedGames={clearFetchedGames}
            monthsThatHaveGames={monthsThatHaveGames}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Games
