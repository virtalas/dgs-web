import React, { useEffect, useRef, useState } from 'react'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'

import PlayerSelect from '../newGame/PlayerSelect'
import baseService from '../../services/baseService'
import playersService from '../../services/playersService'
import CourseSelect from '../newGame/CourseSelect'
import TagSelect from './TagSelect'
import TextField from '@material-ui/core/TextField'
import gamesService from '../../services/gamesService'
import MonthControls from './MonthControls'
import GameList from './GameList'

export const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    // Copied from Games.tsx
    // No vertical scrolling even if views overflow:
    overflow: 'hidden',
    width: '100%',
    paddingBottom: theme.spacing(12),
  },
  searchControls: {
    margin: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
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
  onEditToggle: (isEditing: boolean) => void,
}

const SearchPage: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { onEditToggle } = props

  const [games, setGames] = useState<Game[]>([])
  const [fetchedYears, setFetchedYears] = useState<number[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course>()
  const [selectedYear, setSelectedYear] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [yearsThatHaveGames, setYearsThatHaveGames] = useState<number[]>()

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  const gamesToShow = games.filter(game => game.endDate.getFullYear() === selectedYear)

  const fetchGames = () => {
    if (selectedYear !== undefined) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const searchConditions = { course: selectedCourse }
      gamesService.getGames(selectedYear, undefined, searchConditions, cancelTokenSourceRef.current).then(fetchedGames => {
        setGames(games => games.concat(fetchedGames))
        setIsLoading(false)
        fetchTagsIfEmpty()
      })
      .catch(e => {
        setIsLoading(false)
        setIsError(true)
      })
    }
  }

  const fetchTagsIfEmpty = () => {
    if (allTags.length === 0) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      gamesService.getAllTags(cancelTokenSourceRef.current)
        .then(fetchedTags => {
          setAllTags(fetchedTags)
        })
        .catch(e => console.log('fetching tags failed:', e))
    }
  }

  const fetchPlayersIfEmpty = () => {
    if (allPlayers.length === 0) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      playersService.getPlayers(cancelTokenSourceRef.current)
        .then(fetchedPlayers => {
          setAllPlayers(fetchedPlayers)
        })
        .catch(e => console.log('fetching players failed:', e))  
    }
  }

  const clearFetchedGames = () => {
    setFetchedYears([])
    setGames([])
    setYearsThatHaveGames(undefined)
  }

  const onSearchConditionChange = () => {
    cancelTokenSourceRef.current?.cancel()
    clearFetchedGames()
    setSelectedYear(undefined)
  }

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    onSearchConditionChange()
  }

  useEffect(() => {
    if (!selectedCourse) return
    if (fetchedYears.includes(selectedYear ?? -1)) return
    setIsLoading(true)

    if (!yearsThatHaveGames) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const searchConditions = { course: selectedCourse }
      gamesService.getYearsThatHaveGames(searchConditions, cancelTokenSourceRef.current).then(gameYears => {
        setYearsThatHaveGames(gameYears)
        if (gameYears && gameYears.length > 0) {
          setSelectedYear(gameYears[0])
        } else {
          setIsLoading(false)
        }
        // Since selectedYear changed, component rerenders and fetchGames() happens.
      }).catch(e => {
        setIsLoading(false)
        setIsError(true)
      })
    } else {
      fetchGames()
    }

    return () => cancelTokenSourceRef.current?.cancel()
  }, [selectedYear, selectedCourse]) // eslint-disable-line react-hooks/exhaustive-deps

  // Called after a child has updated a game.
  // Copied from Games.tsx
  const setGame = (game: Game) => {
    let gameToUpdate = games.find(g => g.id === game.id) as Game
    let updateIndex = games.indexOf(gameToUpdate)
    const updatedGames = games.fill(game, updateIndex, updateIndex + 1)
    setGames([...updatedGames])
  }

  // Copied from Games.tsx
  const onGameDeleted = (game: Game) => {
    const updatedGames = games.filter(g => g.id !== game.id)
    setGames([...updatedGames])
  }

  const monthControls = selectedYear !== undefined && games.length > 0  ? (
    <MonthControls
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      monthsThatHaveGames={yearsThatHaveGames?.map(year => { return { year: year, months: [0] } })}
    />
  ) : null

  const searchConditionsEmpty = selectedCourse === undefined

  return (
    <div className={classes.root}>
      <div className={classes.searchControls}>
        <CourseSelect onCourseChange={handleCourseSelect} isSearch={true} />

        <PlayerSelect
          players={selectedPlayers}
          setPlayers={setSelectedPlayers}
          allPlayers={allPlayers}
        />

        <br />

        <TagSelect
          allTags={allTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />

        <br />

        <TextField
          className={classes.formControl}
          label="Comment"
          value={''}
          onChange={() => {}}
        />
      </div>

      <div className={classes.topControls}>
        {monthControls}
      </div>

      <GameList
        gamesToShow={gamesToShow}
        setGame={setGame}
        onGameDeleted={onGameDeleted}
        availableWeatherConditions={allTags.filter(tag => tag.weatherCondition)}
        availableConditions={allTags.filter(tag => tag.condition)}
        isLoading={isLoading}
        isError={isError}
        onEditToggle={onEditToggle}
        searchConditionsEmpty={searchConditionsEmpty}
      />

      {gamesToShow.length > 2 ? (
        <div className={classes.bottomControls}>
          {monthControls}
        </div>
      ) : null}

    </div>
  )
}

export default SearchPage
