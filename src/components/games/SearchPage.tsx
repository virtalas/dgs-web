import React, { useEffect, useRef, useState } from 'react'
import axios, { CancelTokenSource } from 'axios'
import { useLocation } from 'react-router-dom' 
import qs from 'qs'

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

  const searchConditionQueryParams = qs.parse(useLocation().search, { ignoreQueryPrefix: true })
  const queryParamTagId = searchConditionQueryParams.tag ?? undefined
  const queryParamCourseId = searchConditionQueryParams.course_id ? String(searchConditionQueryParams.course_id) : undefined

  const [games, setGames] = useState<Game[]>([])
  const [fetchedYears, setFetchedYears] = useState<number[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [friendList, setFriendList] = useState<FriendList>()
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course>()
  const [selectedYear, setSelectedYear] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [yearsThatHaveGames, setYearsThatHaveGames] = useState<number[]>()
  const [textInput, setTextInput] = useState('')

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  const gamesToShow = games.filter(game => game.endDate.getFullYear() === selectedYear)

  const createSearchConditions = (course?: Course, players?: Player[], tags?: Tag[], comment?: string): GameSearchConditions => {
    return {
      course: course,
      players: players,
      tags: tags,
      comment: comment,
    }
  }

  const fetchGames = () => {
    if (selectedYear !== undefined) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const searchConditions = createSearchConditions(selectedCourse, selectedPlayers, selectedTags, textInput)

      gamesService.getGames(selectedYear, undefined, searchConditions, cancelTokenSourceRef.current).then(fetchedGames => {
        setGames(games => games.concat(fetchedGames))
        setFetchedYears([selectedYear, ...fetchedYears])
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
        if (!axios.isCancel(e)) {
          setIsError(true)
          console.log('Search failed (GET /games):', e)
        }
      })
    }
  }

  const fetchGameYears = () => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    const searchConditions = createSearchConditions(selectedCourse, selectedPlayers, selectedTags, textInput)
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
      if (!axios.isCancel(e)) {
        setIsError(true)
        console.log('Search failed (GET /games/years):', e)
      }
    })
  }

  const initialFetchData = async () => {
    if (!friendList) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const fetchedFriendList = await playersService.getPlayers(cancelTokenSourceRef.current)
      setFriendList(fetchedFriendList)
    }

    let fetchedTags: Tag[] = []
    if (allTags.length === 0) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      fetchedTags = await gamesService.getAllTags(cancelTokenSourceRef.current)
      setAllTags(fetchedTags)
    }

    if (Object.keys(searchConditionQueryParams).length !== 0) {
      if (queryParamTagId !== undefined) {
        const queryParamTag = fetchedTags.find(tag => tag.id === queryParamTagId)

        if (queryParamTag !== undefined) {
          setSelectedTags([queryParamTag])
          await fetchGameYears()
          fetchGames()
        }
      }
    }
  }

  useEffect(() => {
    initialFetchData()

    if (!selectedCourse && selectedPlayers.length === 0 && selectedTags.length === 0 && textInput.length === 0) return
    if (fetchedYears.includes(selectedYear ?? -1)) return
    setIsLoading(true)
    setIsError(false)

    if (!yearsThatHaveGames) {
      fetchGameYears()
    } else {
      fetchGames()
    }

    return () => cancelTokenSourceRef.current?.cancel()
  }, [selectedYear, selectedCourse, selectedPlayers, selectedTags, textInput]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleCourseSelect = (course?: Course) => {
    setSelectedCourse(course)
    onSearchConditionChange()
  }

  const handlePlayerSelect = (players: Player[]) => {
    setSelectedPlayers([...players])
    onSearchConditionChange()
  }

  const handleTagSelect = (tags: Tag[]) => {
    setSelectedTags(tags)
    onSearchConditionChange()
  }

  const handleTextInputChange = (text: string) => {
    setTextInput(text)
    onSearchConditionChange()
  }

  const monthControls = selectedYear !== undefined && games.length > 0  ? (
    <MonthControls
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      monthsThatHaveGames={yearsThatHaveGames?.map(year => { return { year: year, months: [0] } })}
    />
  ) : null

  const searchConditionsEmpty = !selectedCourse && selectedPlayers.length === 0 && selectedTags.length === 0 && textInput.length === 0

  const allPlayers = friendList ?
    [friendList.me]
    .concat(friendList.myFriends)
    .concat(friendList.myGuests)
    .concat(friendList.friendsFriends)
    .concat(friendList.friendsGuests)
  : []

  return (
    <div className={classes.root}>
      <div className={classes.searchControls}>
        <CourseSelect
          onCourseChange={handleCourseSelect}
          chooseNearest={false}
          preselectedCourseId={queryParamCourseId}
          allowUndefinedCourse={true}
        />

        <PlayerSelect
          players={selectedPlayers}
          setPlayers={handlePlayerSelect}
          allPlayers={allPlayers}
          friendList={friendList}
          isSearch={true}
        />

        <br />

        <TagSelect
          allTags={allTags}
          selectedTags={selectedTags}
          setSelectedTags={handleTagSelect}
        />

        <br />

        <TextField
          className={classes.formControl}
          label="Comment"
          value={textInput}
          onChange={e => handleTextInputChange(e.target.value)}
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
