import React, { useState, useEffect } from 'react'

import { Grid, Button, Select, MenuItem, OutlinedInput } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import gamesService from '../../services/gamesService'

const buttonHeight = 45

// TODO: Highlight selected year/month when Select opened.
// TODO: Lose focus on Select after choosing month/year, eg:
// https://stackoverflow.com/questions/54325908/change-outline-for-outlinedinput-with-react-material-ui

const useStyles = makeStyles((theme) => ({
  monthNavigationButton: {
    height: buttonHeight,
  },
  select: {
    height: buttonHeight,
  },
  selectMonth: {
    height: buttonHeight,
    width: 117, // Fixed to the longest month name so the controls' width doesn't change between months.
  }
}))

interface Props {
  selectedMonth: number,
  setSelectedMonth: any,
  selectedYear: number,
  setSelectedYear: any,
  fetchedMonths: number[],
}

const MonthControls: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { setSelectedMonth, selectedMonth, selectedYear, setSelectedYear, fetchedMonths } = props

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0 = January

  const [yearsThatHaveGames, setYearsThatHaveGames] = useState<number[]>([currentYear])

  useEffect(() => {
    if (fetchedMonths.includes(selectedMonth)) return
    gamesService.getYearsThatHaveGames().then((years: number[]) => {
      setYearsThatHaveGames(years)
      setSelectedYear(years[0]) // Set selectedYear as the latest year that has games (note: not necessarily the current year).
    })
  }, [selectedYear, selectedMonth, fetchedMonths, setSelectedYear])

  // TODO: change to next/prev year instead of disabling button
  const handlePrevMonth = () => setSelectedMonth((month: number) => month - 1)
  const handleNextMonth = () => setSelectedMonth((month: number) => month + 1)
  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMonth(event.target.value as number)
  }
  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // TODO
    // setSelectedYear(event.target.value as number)
    // setFetchedMonths([]) // empty the array
  }

  var monthOptions: any = []
  const lastSelectableMonth = currentYear === selectedYear ? currentMonth : 11 // 0 = January
  for (var i = lastSelectableMonth; i >= 0; i--) {
    // 0 = January, 1st day has to be 1
    const monthName = new Date(Date.UTC(0, i, 1)).toLocaleString('en-us', { month: 'long' })
    monthOptions.push(<MenuItem value={i} key={i}>{monthName}</MenuItem>)
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      wrap="nowrap"
      spacing={3}
    >
      <Grid item zeroMinWidth>
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
      <Grid item zeroMinWidth>
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
      <Grid item zeroMinWidth>
        <Select
          value={selectedMonth}
          className={classes.selectMonth}
          onChange={handleMonthChange}
          input={<OutlinedInput labelWidth={0} />}
        >
          {monthOptions}
        </Select>
      </Grid>
      <Grid item zeroMinWidth>
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
}

export default MonthControls
