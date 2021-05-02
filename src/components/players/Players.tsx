import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import { useAuth } from '../../context/AuthContext'
import playersService from '../../services/playersService'
import HighScores from './HighScores'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: 600,
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(11),
  },
  card: {
    margin: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(1),
  },
}))

// TODO: Average scores modal (pretty identical to High Scores, show only toPar and no total, vertically scrolling, years as columns).

const Players: React.FC<{}> = () => {
  const classes = useStyles()
  const { userId } = useAuth()

  const [players, setPlayers] = useState<Player[]>()
  const [currentUser, setCurrentUser] = useState<Player>()

  useEffect(() => {
    playersService.getPlayers().then(p => {
      setPlayers(p)
      setCurrentUser(p.find(player => player.id === userId))
    })
  }, [userId])

  const generatePlayerCard = (player: Player | undefined) => {
    return player ? (
      <Card data-cy="playerCard" key={'player' + player.id} className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {player.firstName}
          </Typography>

          <Table className={classes.table} size="small">
            <TableBody>
              <TableRow>
                <TableCell>Games played</TableCell>
                <TableCell align="right">XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Throws</TableCell>
                <TableCell align="right">XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Latest game</TableCell>
                <TableCell align="right">XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hole in ones</TableCell>
                <TableCell align="right">XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Eagles (not hole in one)</TableCell>
                <TableCell align="right">XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Birdies</TableCell>
                <TableCell align="right">XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Most played courses</TableCell>
                <TableCell align="right">1. XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">2. XXX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">3. XXX</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>

        <CardActions>
          <HighScores key={'highscore' + player.id} playerId={player.id} />
          <Button size="small" disabled>Average scores</Button>
        </CardActions>
      </Card>
    ) : null
  }

  return (
    <div id="playersPage" className={classes.page}>
      {/* First the user's own card, then other players in alphabetical order. */}
      {generatePlayerCard(currentUser)}
      {players?.filter(player => player.id !== currentUser?.id).map(player => (
        generatePlayerCard(player)
      ))}
    </div>
  )
}

export default Players
