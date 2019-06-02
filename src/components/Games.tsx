import React, { useState, useEffect } from 'react'

import { Grid, Button, Select, MenuItem, OutlinedInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import GameCard from './gameCard/GameCard'
import gamesService from '../services/gamesService'

const buttonHeight = 45

const useStyles = makeStyles((theme) => ({
  topControls: {
    paddingTop: theme.spacing.unit * 2,
    margin: 0,
    marginBottom: -theme.spacing.unit * 3,
    width: '100%',
  },
  bottomControls: {
    paddingBottom: theme.spacing.unit * 12,
    margin: 0,
    width: '100%',
  },
  monthButton: {
    height: buttonHeight,
  },
  monthSelect: {
    height: buttonHeight,
  },
}))

const Games: React.FC<{}> = () => {
  const classes = useStyles()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const [games, setGames] = useState<Game[]>([])
  const [month, setCurrentMonth] = useState<number>(currentMonth)
  const [year, setCurrentYear] = useState<number>(currentYear)
  const [years, setYears] = useState<number[]>([year])
  
  // useEffect(func, []) works like componentDidMount.
  useEffect(() => {
    gamesService.getYears().then((fethedYears) => setYears(fethedYears))
    gamesService.getGamesByMonth(year, month).then((fetchedGames) => {
      // TODO: Change games to array: const games = ["2019-04": [games...], "2019-05": [games...]]
      setGames(fetchedGames)
    })
  }, [year, month]) // Will be rerun each time 'year' or 'month' change.

  const handlePrevMonth = () => {
    // TODO
  }

  const handleMonthChange = () => {
    // TODO
  }

  var monthOptions: any = []
  const lastSelectableMonth = currentYear === year ? currentMonth : 11
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
          className={classes.monthButton}
          onClick={handlePrevMonth}
        >
          ≪
        </Button>
      </Grid>
      <Grid item>
        <Select
          value={year}
          className={classes.monthSelect}
          onChange={handleMonthChange}
          input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}
        >
          {years.map(year => (
            <MenuItem value={year} key={year}>{year}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <Select
          value={month}
          className={classes.monthSelect}
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
          className={classes.monthButton}
          onClick={handlePrevMonth}
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
