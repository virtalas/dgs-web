import React, { useState, useEffect } from 'react'

import { Grid, Button, Select, MenuItem, OutlinedInput, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import GameCard from './gameCard/GameCard'
import gamesService from '../services/gamesService'
import { dateFrom } from '../utils/DateUtil'

const buttonHeight = 45

// TODO: December is in the wrong place on safari.
// TODO: Fix Select width to the width of the longest month name.
// TODO: Highlight selected year/month when Select opened.
// TODO: Lose focus on Select after choosing month/year, eg:
// https://stackoverflow.com/questions/54325908/change-outline-for-outlinedinput-with-react-material-ui

const useStyles = makeStyles((theme) => ({
  topControls: {
    paddingTop: theme.spacing.unit * 2,
    margin: 0,
    marginBottom: -theme.spacing.unit * 3,
    width: '99%', // 100% causes sideways scrollability
  },
  bottomControls: {
    paddingBottom: theme.spacing.unit * 12,
    margin: 0,
    width: '99%', // 100% causes sideways scrollability
  },
  monthNavigationButton: {
    height: buttonHeight,
  },
  select: {
    height: buttonHeight,
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
    height: theme.spacing.unit * 30,
    position: 'relative',
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
  const [yearsThatHaveGames, setYearsThatHaveGames] = useState<number[]>([currentYear])
  const [isLoading, setIsLoading] = useState<Boolean>(false)

  const gamesToShow = games.filter(game => dateFrom(game.endDate).getMonth() === selectedMonth
    && dateFrom(game.endDate).getFullYear() === selectedYear)
  
  // useEffect works like componentDidMount.
  // Will be rerun each time 'selectedYear' or 'selectedMonth' change.
  useEffect(() => {
    if (fetchedMonths.includes(selectedMonth)) return
    setIsLoading(true)
    setFetchedMonths(months => months.concat([selectedMonth]))
    gamesService.getYearsThatHaveGames().then(years => setYearsThatHaveGames(years))
    gamesService.getGames(selectedYear, selectedMonth).then(fetchedGames => {
      // Simulate network delay.
      setTimeout(function () {
        setGames(games => games.concat(fetchedGames))
        setIsLoading(false)
      }, 1500);
    })
  }, [selectedYear, selectedMonth])

  // TODO: change to next/prev year instead of disabling button
  const handlePrevMonth = () => setSelectedMonth(month => month - 1)
  const handleNextMonth = () => setSelectedMonth(month => month + 1)
  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMonth(event.target.value as number)
  }
  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // TODO
    // setSelectedYear(event.target.value as number)
    // setFetchedMonths([])
  }

  var monthOptions: any = []
  const lastSelectableMonth = currentYear === selectedYear ? currentMonth : 11 // 0 = January
  for (var i = lastSelectableMonth; i >= 0 ; i--) {
    // 0 = January, 1st day has to be 1
    const monthName = new Date(Date.UTC(0, i, 1)).toLocaleString('en-us', { month: 'long' })
    monthOptions.push(<MenuItem value={i} key={i}>{monthName}</MenuItem>)
  }

  // TODO: Move to separate component
  const pageControls = (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start"
      spacing={8}
    >
      <Grid item>
        <Button
          variant="outlined"
          size="small"
          className={classes.monthNavigationButton}
          onClick={handlePrevMonth}
          disabled={selectedYear === yearsThatHaveGames[0] && selectedMonth === 0}
        >
          ≪
        </Button>
      </Grid>
      <Grid item>
        <Select
          value={selectedYear}
          className={classes.select}
          onChange={handleYearChange}
          input={<OutlinedInput labelWidth={0} />}
        >
          {yearsThatHaveGames.map(year => (
            <MenuItem value={year} key={year}>{year}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <Select
          value={selectedMonth}
          className={classes.select}
          onChange={handleMonthChange}
          input={<OutlinedInput labelWidth={0} />}
        >
          {monthOptions}
        </Select>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          size="small"
          className={classes.monthNavigationButton}
          onClick={handleNextMonth}
          disabled={selectedYear === currentYear && selectedMonth === currentMonth}
        >
          ≫
        </Button>
      </Grid>
    </Grid>
  )
  
  return (
    <div id="gamesPage">
      <div className={classes.topControls}>
        {pageControls}
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
          {pageControls}
        </div>
      ) : null}
    </div>
  )
}

export default Games
