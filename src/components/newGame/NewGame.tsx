import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'

import { useAuth } from '../../context/AuthContext'
import { toISOStringWithTimezone } from '../../utils/DateUtils'
import PlayerSelect from './PlayerSelect'
import CourseSelect from './CourseSelect'
import NewGuestButton from './NewGuestButton'
import gamesService from '../../services/gamesService'
import playersService from '../../services/playersService'
import baseService from '../../services/baseService'
import DisableableButton from '../DisableableButton'

const useStyles = makeStyles((theme) => ({
  page: {
    margin: 20,
  },
}))

// TODO: Center by using Grids (e.g in NewLayout.tsx)

const NewGame: React.FC<{}> = () => {
  const { userId } = useAuth()
  const classes = useStyles()

  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState('')
  const [gameCreatable, setGameCreatable] = useState(false)
  const [layout, setLayout] = useState<Layout>()
  const [players, setPlayers] = useState<Player[]>([])
  const [friendList, setFriendList] = useState<FriendList>()

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()

    playersService.getPlayers(cancelTokenSourceRef.current)
      .then(fetchedFriendList => {
        const user = fetchedFriendList.me
        if (user) {
          setPlayers([user])
        }
        setFriendList(fetchedFriendList)
      })
      .catch(e => console.log('fetching players failed:', e))

    return () => cancelTokenSourceRef.current?.cancel()
  }, [userId])

  const handleStartButtonClick = async () => {
    const startDate = toISOStringWithTimezone(new Date())
    if (layout) {
      setGameCreatable(false)
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      gamesService.createGame(layout, players, startDate, cancelTokenSourceRef.current)
        .then(newGameId => {
          setNewGameId(newGameId.id)
          setRedirect(true)
        })
        .catch(e => {
          window.alert('Error creating game: ' + e)
          setGameCreatable(true)
        })
    }
  }

  const handleAddNewGuest = (newGuest: Player) => {
    if (!friendList) return
    friendList.myGuests = [newGuest, ...friendList.myGuests]
    setFriendList(friendList)
  }

  if (redirect) {
    return <Redirect to={'/games/' + newGameId + "/input"} />
  }

  const newGameButtonDisabled = !gameCreatable || layout === undefined || players.length === 0

  const allPlayers = friendList ?
   [friendList.me]
   .concat(friendList.myFriends)
   .concat(friendList.myGuests)
   .concat(friendList.friendsFriends)
   .concat(friendList.friendsGuests)
  : []

  return (
    <div id="newGamePage" className={classes.page}>
      <CourseSelect
        layout={layout}
        setLayout={setLayout}
        setGameCreatable={setGameCreatable}
      />

      <PlayerSelect
        players={players}
        setPlayers={setPlayers}
        allPlayers={allPlayers}
        friendList={friendList}
        setGameCreatable={setGameCreatable}
      />
      <br/>

      <NewGuestButton
        setPlayers={setPlayers}
        players={players}
        handleAddNewGuest={handleAddNewGuest}
        allPlayers={allPlayers}
      />
      <br/>

      <DisableableButton
        onClick={handleStartButtonClick}
        disabled={newGameButtonDisabled}
      >
        Start game
      </DisableableButton>
    </div>
  )
}

export default NewGame
