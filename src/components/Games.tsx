import React, { useState, useEffect } from 'react'

import { Grid, Button, Select, MenuItem, OutlinedInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import GameCard from './gameCard/GameCard'
import gamesService from '../services/gamesService'

const buttonHeight = 45

// TODO: December is in the wrong place on safari
// TODO: Lose focus on Select after choosing month/year

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
}))

const Games: React.FC<{}> = () => {
  const classes = useStyles()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const [games, setGames] = useState<Game[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [yearsThatHaveGames, setYearsThatHaveGames] = useState<number[]>([currentYear])
  
  // useEffect(func, []) works like componentDidMount.
  useEffect(() => {
    gamesService.getYearsThatHaveGames().then(years => setYearsThatHaveGames(years))
    gamesService.getGames(selectedYear, selectedMonth).then(fetchedGames => {
      // TODO: Change games to array: const games = ["2019-04": [games...], "2019-05": [games...]]
      setGames(fetchedGames)
    })
  }, [selectedYear, selectedMonth]) // Will be rerun each time 'selectedYear' or 'selectedMonth' change.

  const handlePrevMonth = () => {
    // TODO
  }

  const handleNextMonth = () => {
    // TODO
  }

  const handleMonthChange = () => {
    // TODO
  }

  var monthOptions: any = []
  const lastSelectableMonth = currentYear === selectedYear ? currentMonth : 11
  for (var i = lastSelectableMonth; i >= 0 ; i--) {
    const monthName = new Date(1, i, 1).toLocaleString('en-us', { month: 'long' })
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
          onChange={handleMonthChange}
          input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}
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
          input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}
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
  
  // TODO: 'No games' text.
  return (
    <div id="gamesPage">
      <div className={classes.topControls}>
        {pageControls}
      </div>
      {games.map(game => (
        <GameCard game={game} key={game.id}/>
      ))}
      <div className={classes.bottomControls}>
        {pageControls}
      </div>
    </div>
  )
}

export default Games
