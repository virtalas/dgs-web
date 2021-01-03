import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { useAuth } from '../../context/AuthContext'
import playersService from '../../services/playersService'

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  table: {
  },
}))

const Players: React.FC<{}> = () => {
  const classes = useStyles()
  const { user } = useAuth()

  const [players, setPlayers] = useState<Player[]>()

  useEffect(() => {
    playersService.getPlayers().then(p => setPlayers(p))
  }, [players])

  const generatePlayerCard = (player: Player | undefined) => {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {player?.firstName}
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
          <Button size="small">High scores</Button>
          <Button size="small" disabled>Average scores</Button>
        </CardActions>
      </Card>
    )
  }

  return (
    <div id="playersPage">
      {/* First the user's own card, then other players in alphabetical order. */}
      {generatePlayerCard(user)}
      {players?.filter(player => player.id !== user?.id).map(player => (
        generatePlayerCard(player)
      ))}
    </div>
  )
}

export default Players
