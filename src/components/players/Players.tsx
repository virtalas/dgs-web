import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { useAuth } from '../../context/AuthContext'
import playersService from '../../services/playersService'
import PlayerCard from './PlayerCard'
import baseService from '../../services/baseService'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: 600,
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(11),
  },
}))


const Players: React.FC<{}> = () => {
  const classes = useStyles()
  const { userId } = useAuth()

  const [players, setPlayers] = useState<Player[]>()
  const [currentUser, setCurrentUser] = useState<Player>()


  useEffect(() => {
    const cancelTokenSource = baseService.cancelTokenSource()

    playersService.getPlayers(cancelTokenSource).then(p => {
      setPlayers(p)
      setCurrentUser(p.find(player => player.id === userId))
    })

    return () => cancelTokenSource?.cancel()
  }, [userId])

  return (
    <div id="playersPage" className={classes.page}>
      {currentUser ? (
        <PlayerCard player={currentUser} />
      ) : null}
      {players?.filter(player => player.id !== currentUser?.id).map(player => (
        <PlayerCard key={'player' + player.id} player={player} />
      ))}
    </div>
  )
}

export default Players
