import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import MonthControls from './MonthControls'
import gamesService from '../../services/gamesService'
import GameList from './GameList'
import { Button, Grid } from '@material-ui/core'
import { Redirect } from 'react-router-dom'

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
}))

interface Props {
  match: any,
}

const Games: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { match } = props
  const gameId = match.params.id
  const singleGameView = Boolean(gameId)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() - 1

  const [games, setGames] = useState<Game[]>([])
  const [fetchedMonths, setFetchedMonths] = useState<number[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth) // 0 = January
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [monthsThatHaveGames, setMonthsThatHaveGames] = useState<GameMonths[]>()
  const [availableWeatherConditions, setAvailableWeatherConditions] = useState<Tag[]>([])
  const [availableConditions, setAvailableConditions] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [redirect, setRedirect] = useState(false)

  const gamesToShow = singleGameView ? games : games.filter(game => game.endDate.getMonth() === selectedMonth
                                                            && game.endDate.getFullYear() === selectedYear)

  const fetchGames = () => {
    gamesService.getGames(selectedYear, selectedMonth).then(fetchedGames => {
      setFetchedMonths(months => months.concat([selectedMonth])) // Mark games for this month as fetched.
      setGames(games => games.concat(fetchedGames))
      setIsLoading(false)
    })
    .catch(e => {
      console.log(e)
      setIsLoading(false)
      setIsError(true)
    })
  }

  useEffect(() => {
    // Fetch available conditions (for editing, search)
    if (availableConditions.length === 0) {
      gamesService.getAvailableConditions().then(conditions => {
        setAvailableConditions(conditions.filter(tag => tag.condition))
        setAvailableWeatherConditions(conditions.filter(tag => tag.weather_condition))  
      })
    }

    if (fetchedMonths.includes(selectedMonth)) return // Don't refetch already fetched games.
    setIsLoading(true)

    // Page for a single game:

    if (singleGameView) {
      gamesService.getGame(gameId).then(game => setGames([game]))
      return
    }

    // Page for multiple games:

    if (!monthsThatHaveGames) {
      // First fetch a list of years and months that have games:
      gamesService.getMonthsThatHaveGames().then((gameMonths: GameMonths[]) => {
        setMonthsThatHaveGames(gameMonths)
        // Select the latest month & year that have games:
        if (gameMonths && gameMonths.length > 0) {
          setSelectedYear(gameMonths[0].year)
          setSelectedMonth(gameMonths[0].months[gameMonths[0].months.length - 1])
        }
        // Since selectedYear/Month changed, component rerenders and fetchGames() happens.
      }).catch(e => {
        setIsLoading(false)
        setIsError(true)
      })
    } else {
      // Fetch games for selectedMonth.
      fetchGames()
    }

  }, [selectedYear, selectedMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  if (redirect) {
    return <Redirect push to={'/games'} />
  }

  const clearFetchedGames = () => {
    setFetchedMonths([])
    setGames([]) // Clear fetched games if year changed.
  }

  const setGame = (game: Game) => {
    let gameToUpdate = games.find(g => g.id === game.id) as Game
    let updateIndex = games.indexOf(gameToUpdate)
    const updatedGames = games.fill(game, updateIndex, updateIndex + 1)
    setGames([...updatedGames])
  }

  const handleShowAllButton = () => setRedirect(true)

  const monthControls = (
    <MonthControls
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      clearFetchedGames={clearFetchedGames}
      monthsThatHaveGames={monthsThatHaveGames}
    />
  )

  return (
    <div id="gamesPage" className={classes.root}>
      {singleGameView ? (
        <Grid className={classes.topControls} container justify="center">
          <Button variant="outlined" onClick={handleShowAllButton}>
            Show all games
          </Button>
        </Grid>
      ) : (
        <div className={classes.topControls}>
          {monthControls}
        </div>
      )}

      <GameList
        gamesToShow={gamesToShow}
        setGame={setGame}
        availableWeatherConditions={availableWeatherConditions}
        availableConditions={availableConditions}
        isLoading={isLoading}
        isError={isError}
      />

      {gamesToShow.length > 2 ? (
        <div className={classes.bottomControls}>
          {monthControls}
        </div>
      ) : null}
    </div>
  )
}

export default Games
