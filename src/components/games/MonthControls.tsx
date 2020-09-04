import React from 'react'

import { Grid, Button, Select, MenuItem, OutlinedInput } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const buttonHeight = 45

// TODO: Lose focus on Select after choosing month/year, eg:
// https://stackoverflow.com/questions/54325908/change-outline-for-outlinedinput-with-react-material-ui

const useStyles = makeStyles((theme) => ({
  monthNavigationButton: {
    height: buttonHeight,
  },
  selectYear: {
    height: buttonHeight,
    minWidth: 74, // Loading (empty) and filled (with a year) states have same width.
  },
  selectMonth: {
    height: buttonHeight,
    width: 117, // Fixed to the longest month name so the controls' width doesn't change between months.
  }
}))

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '95%',
    },
  },
}

interface Props {
  selectedMonth: number,
  setSelectedMonth: (month: number) => void,
  selectedYear: number,
  setSelectedYear: (year: number) => void,
  clearFetchedGames: () => void,
  monthsThatHaveGames: GameMonths[] | undefined,
}

const MonthControls: React.FC<Props> = (props) => {
  const classes = useStyles()
  const {
    setSelectedMonth,
    selectedMonth,
    selectedYear,
    setSelectedYear,
    clearFetchedGames,
    monthsThatHaveGames,
  } = props

  const isLoading = monthsThatHaveGames === undefined
  const gameMonthsInSelectedYear = monthsThatHaveGames ?
      monthsThatHaveGames.find((gameMonths: GameMonths) => selectedYear === gameMonths.year)
      : undefined
  const latestSelectableYear = monthsThatHaveGames ?
      monthsThatHaveGames[0].year
      : 9999
  const latestSelectableMonth = monthsThatHaveGames ?
      monthsThatHaveGames[0].months[monthsThatHaveGames[0].months.length - 1]
      : 11
  const oldestSelectableYear = monthsThatHaveGames ?
      monthsThatHaveGames[monthsThatHaveGames.length - 1].year
      : 0
  const oldestSelectableMonth = monthsThatHaveGames ?
      monthsThatHaveGames[monthsThatHaveGames.length - 1].months[0]
      : 11

  const handlePrevMonth = () => {
    if (monthsThatHaveGames && gameMonthsInSelectedYear) {
      // First try to move to previous month (that has games) in the same year:
      const indexOfSelectedMonth = gameMonthsInSelectedYear.months.indexOf(selectedMonth)
      if (indexOfSelectedMonth > 0) {
        setSelectedMonth(gameMonthsInSelectedYear.months[indexOfSelectedMonth - 1])
        return
      }
      // Then try to move to the last month (that has games) of the previous year (that has games):
      const indexOfSelectedYear = indexOfYear(monthsThatHaveGames, selectedYear)
      if (indexOfSelectedYear < monthsThatHaveGames.length - 1 && indexOfSelectedYear !== -1) {
        const toBeSelectedYear = monthsThatHaveGames[indexOfSelectedYear + 1]
        setSelectedYear(toBeSelectedYear.year)
        setSelectedMonth(toBeSelectedYear.months[toBeSelectedYear.months.length - 1])
        clearFetchedGames()
      }
    }
  }

  const handleNextMonth = () => {
    if (monthsThatHaveGames && gameMonthsInSelectedYear) {
      // First try to move to next month (that has games) in the same year:
      const indexOfSelectedMonth = gameMonthsInSelectedYear.months.indexOf(selectedMonth)
      if (indexOfSelectedMonth < gameMonthsInSelectedYear.months.length - 1) {
        setSelectedMonth(gameMonthsInSelectedYear.months[indexOfSelectedMonth + 1])
        return
      }
      // Then try to move to the first month (that has games) of the next year (that has games):
      const indexOfSelectedYear = indexOfYear(monthsThatHaveGames, selectedYear)
      if (indexOfSelectedYear > 0) {
        const toBeSelectedYear = monthsThatHaveGames[indexOfSelectedYear - 1]
        setSelectedYear(toBeSelectedYear.year)
        setSelectedMonth(toBeSelectedYear.months[0])
        clearFetchedGames()
      }
    }
  }

  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMonth(event.target.value as number)
  }

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const year = event.target.value as number
    setSelectedYear(year)
    // Select the latest month (that has games) of the new selected year:
    const monthsOfNewYear = monthsThatHaveGames ?
        monthsThatHaveGames[indexOfYear(monthsThatHaveGames, year)].months
        : [0]
    setSelectedMonth(monthsOfNewYear[monthsOfNewYear.length - 1])
    clearFetchedGames() // Clear fetched games.
  }

  var monthOptions: JSX.Element[] = []
  for (var i = 11; i >= 0; i--) {
    // Generate month name (0 = January, 1st day has to be 1):
    const monthName = new Date(Date.UTC(0, i, 1)).toLocaleString('en-us', { month: 'long' })
    const hasGames = arrayContainsMonth(gameMonthsInSelectedYear, i)
    monthOptions.push(<MenuItem disabled={!hasGames} value={i} key={i}>{monthName}</MenuItem>)
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      wrap="nowrap"
      spacing={1}
    >
      <Grid item zeroMinWidth>
        <Button
          variant="outlined"
          size="small"
          className={classes.monthNavigationButton}
          onClick={handlePrevMonth}
          disabled={selectedYear === oldestSelectableYear && selectedMonth === oldestSelectableMonth}
        >
          ≪
        </Button>
      </Grid>
      <Grid item zeroMinWidth>
        <Select
          value={isLoading ? '' : selectedYear}
          className={classes.selectYear}
          onChange={handleYearChange}
          input={<OutlinedInput labelWidth={0} />}
        >
          {monthsThatHaveGames ? monthsThatHaveGames.map((gameMonths: GameMonths) => (
            <MenuItem value={gameMonths.year} key={gameMonths.year}>{gameMonths.year}</MenuItem>
          )) : null}
        </Select>
      </Grid>
      <Grid item zeroMinWidth>
        <Select
          value={isLoading ? '' : selectedMonth}
          className={classes.selectMonth}
          onChange={handleMonthChange}
          input={<OutlinedInput labelWidth={0} />}
          MenuProps={MenuProps}
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
          disabled={selectedYear === latestSelectableYear && selectedMonth === latestSelectableMonth}
        >
          ≫
        </Button>
      </Grid>
    </Grid>
  )
}

function arrayContainsMonth(gameMonths: GameMonths | undefined, month: number): boolean {
  return gameMonths ? gameMonths.months.some(m => m === month) : false
}

function indexOfYear(gameMonths: GameMonths[], year: number): number {
  let i = 0
  while (i < gameMonths.length) {
    if (gameMonths[i].year === year) return i
    i++
  }
  return -1
}

export default MonthControls
