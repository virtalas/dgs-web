import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { useAuth } from '../../context/AuthContext'
import playersService from '../../services/playersService'
import PlayerCard from './PlayerCard'
import baseService from '../../services/baseService'
import { pageMaxWidth } from '../BasePage'

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

  const [players, setPlayers] = useState<Player[]>()
  const [currentUser, setCurrentUser] = useState<Player>()

  const friends = players?.filter(player => !player.guest).filter(player => player.id !== currentUser?.id)
  const guests = players?.filter(player => player.guest)

  useEffect(() => {
    const cancelTokenSource = baseService.cancelTokenSource()

    playersService.getPlayers(cancelTokenSource).then(p => {
      setPlayers(p)
      setCurrentUser(p.find(player => player.id === userId))
    })

    return () => cancelTokenSource?.cancel()
  }, [userId])

  const generatePlayerCard = (player: Player, showGuestButton: boolean) =>
    <PlayerCard key={'player' + player.id} player={player} guest={showGuestButton} />

  return (
    <div id="playersPage" className={classes.page}>
      {currentUser ? (
        <PlayerCard player={currentUser} />
      ) : null}

      {friends?.map(player => generatePlayerCard(player, false))}

      {(guests && guests.length > 0) ? (
        <div className={classes.guestsTitle}>
          <Typography variant="h6">Guests</Typography>
        </div>
      ) : null}

      {guests?.map(player => generatePlayerCard(player, true))}
    </div>
  )
}

export default Players
