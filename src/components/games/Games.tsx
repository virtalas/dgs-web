import React, { useState, useEffect, useRef } from 'react'
import axios, { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'

import MonthControls from './MonthControls'
import gamesService from '../../services/gamesService'
import GameList from './GameList'
import { Button, Grid } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import baseService from '../../services/baseService'

// TODO: When the device is rotated, don't open the drawer -> show whole score card instead
// TODO: Fetch prev and next month as well.
// TODO: Fix bug: moving to previous month before games have loaded

const useStyles = makeStyles((theme) => ({
  root: {
    // No vertical scrolling even if views overflow:
    overflow: 'hidden',
    width: '100%',
    paddingBottom: theme.spacing(20),
  },
  topControls: {
    paddingTop: theme.spacing(2),
    margin: 0,
    marginBottom: -theme.spacing(3),
    width: '100%',
  },
  bottomControls: {
    margin: 0,
    width: '100%',
  },
}))

interface Props {
  match: any,
  onEditToggle: (isEditing: boolean) => void,
}

const Games: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { match, onEditToggle } = props
  const gameId = match.params.id
  const singleGameView = Boolean(gameId)

  const [games, setGames] = useState<Game[]>([])
  const [fetchedMonths, setFetchedMonths] = useState<number[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>() // 0 = January
  const [selectedYear, setSelectedYear] = useState<number>()
  const [monthsThatHaveGames, setMonthsThatHaveGames] = useState<GameMonths[]>()
  const [availableWeatherConditions, setAvailableWeatherConditions] = useState<Tag[]>([])
  const [availableConditions, setAvailableConditions] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [redirect, setRedirect] = useState(false)

  const gamesToShow = singleGameView ? games : games.filter(game => game.endDate.getMonth() === selectedMonth
                                                            && game.endDate.getFullYear() === selectedYear)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  const fetchGames = () => {
    if (selectedYear !== undefined && selectedMonth !== undefined) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      gamesService.getGames(selectedYear, selectedMonth, undefined, cancelTokenSourceRef.current).then(fetchedGames => {
        setFetchedMonths(months => months.concat([selectedMonth])) // Mark games for this month as fetched.
        setGames(games => games.concat(fetchedGames))
        setIsLoading(false)
        fetchConditionsIfEmpty()
      })
      .catch(e => {
        if (!axios.isCancel(e)) {
          setIsLoading(false)
          setIsError(true)
        }
      })
    }
  }

  const fetchGameMonths = () => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    gamesService.getMonthsThatHaveGames(cancelTokenSourceRef.current).then((gameMonths: GameMonths[]) => {
      setMonthsThatHaveGames(gameMonths)
      // Select the latest month & year that have games:
      if (gameMonths && gameMonths.length > 0) {
        setSelectedYear(gameMonths[0].year)
        setSelectedMonth(gameMonths[0].months[gameMonths[0].months.length - 1])
      } else {
        setIsLoading(false)
      }
      // Since selectedYear/Month changed, component rerenders and fetchGames() happens.
    }).catch(e => {
      setIsLoading(false)
      if (!axios.isCancel(e)) {
        setIsLoading(false)
        setIsError(true)
      }
    })
  }

  // Fetch available conditions (for editing & search)
  const fetchConditionsIfEmpty = () => {
    if (availableConditions.length === 0) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      gamesService.getAvailableConditions(cancelTokenSourceRef.current).then(conditions => {
        setAvailableConditions(conditions.filter(tag => tag.condition))
        setAvailableWeatherConditions(conditions.filter(tag => tag.weatherCondition))  
      })
    }
  }

  useEffect(() => {
    if (fetchedMonths.includes(selectedMonth ?? -1)) return // Don't refetch already fetched games.
    setIsLoading(true)

    // Page for a single game:
    if (singleGameView) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      gamesService.getGame(gameId, cancelTokenSourceRef.current).then(game => {
        setGames([game])
        fetchConditionsIfEmpty()
      })
      return
    }

    // Page for multiple games:
    if (!monthsThatHaveGames) {
      // First fetch a list of years and months that have games:
      fetchGameMonths()
    } else {
      // Fetch games for selectedMonth.
      fetchGames()
    }

    return () => cancelTokenSourceRef.current?.cancel()
  }, [selectedYear, selectedMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  if (redirect) {
    return <Redirect push to={'/games'} />
  }

  const clearFetchedGames = () => {
    setFetchedMonths([])
    setGames([]) // Clear fetched games if year changed.
  }

  // Called after a child has updated a game.
  const setGame = (game: Game) => {
    let gameToUpdate = games.find(g => g.id === game.id) as Game
    let updateIndex = games.indexOf(gameToUpdate)
    const updatedGames = games.fill(game, updateIndex, updateIndex + 1)
    setGames([...updatedGames])

    // TODO: Fetch gameMonths again. Make current fetching in useEffect into a function and call that. Also, remove lint disabler comment and use useCallback() for all
  }

  const onGameDeleted = (game: Game) => {
    const updatedGames = games.filter(g => g.id !== game.id)
    setGames([...updatedGames])
  }

  const handleShowAllButton = () => setRedirect(true)

  const monthControls = selectedYear !== undefined && selectedMonth !== undefined ? (
    <MonthControls
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      monthsThatHaveGames={monthsThatHaveGames}
      clearFetchedGames={clearFetchedGames}
    />
  ) : null

  return (
    <div id="gamesPage" className={classes.root}>
      {singleGameView ? (
        <Grid className={classes.topControls} container justifyContent="center">
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
        onGameDeleted={onGameDeleted}
        availableWeatherConditions={availableWeatherConditions}
        availableConditions={availableConditions}
        isLoading={isLoading}
        isError={isError}
        onEditToggle={onEditToggle}
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
