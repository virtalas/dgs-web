import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { useAuth } from '../../context/AuthContext'
import playersService from '../../services/playersService'
import PlayerCard from './PlayerCard'
import baseService from '../../services/baseService'
import { pageMaxWidth } from '../BasePage'
import LoadingView from '../LoadingView'
import Grow from '@material-ui/core/Grow'
import ErrorView from '../ErrorView'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: pageMaxWidth,
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(11),
  },
  guestsTitle: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
}))


const Players: React.FC<{}> = () => {
  const classes = useStyles()
  const { userId } = useAuth()

  const [friendList, setFriendList] = useState<FriendList>()
  const [currentUser, setCurrentUser] = useState<Player>()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const friends = friendList?.myFriends
  const guests = friendList?.myGuests

  useEffect(() => {
    setIsError(false)
    const cancelTokenSource = baseService.cancelTokenSource()

    playersService.getPlayers(cancelTokenSource)
      .then(p => {
        setFriendList(p)
        setCurrentUser(p.me)
        setIsLoading(false)
      })
      .catch(() => setIsError(true))

    return () => cancelTokenSource?.cancel()
  }, [userId])

  const generatePlayerCard = (player: Player, showGuestButton: boolean, index: number) => (
    <Grow key={'grow' + index} in={true} {...{ timeout: Math.min(1000, index * 300 + 100) }}>
      <div>
        <PlayerCard key={'player' + player.id} player={player} guest={showGuestButton} />
      </div>
    </Grow>
  )

  return (
    <div id="playersPage" className={classes.page}>
      {currentUser ? (
        <PlayerCard player={currentUser} />
      ) : null}

      {friends?.map((player, index) => generatePlayerCard(player, false, index))}

      {(guests && guests.length > 0) ? (
        <div className={classes.guestsTitle}>
          <Typography variant="h6">Guests</Typography>
        </div>
      ) : null}

      {guests?.map((player, index) => generatePlayerCard(player, true, index + (friends ?? []).length))}

      {friendList === undefined && isLoading && !isError && (
        <LoadingView />
      )}

      {isError && (
        <ErrorView />
      )}
    </div>
  )
}

export default Players
