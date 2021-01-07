import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

import playersService from '../../services/playersService'

const useStyles = makeStyles((theme) => ({
  modal: {
    alignItems: 'center',
  },
  modalTable: {
    display: 'table',
  },
  container: {
    maxHeight: '75%',
    position: 'absolute',
    top: '12%', // Half of the remaining space from (100 - maxHeight)%, thus centering element.
    width: '100%',
    overflow: 'scroll',
    display: 'block',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}))

interface Props {
  playerId: string,
}

// TODO: Type declaration for HighScores?

const HighScores: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { playerId } = props
  const [redirect, setRedirect] = useState(false)
  const [redirectGameId, setRedirectGameId] = useState('')
  const [highScores, setHighScores] = useState<HighScore[]>()
  const [highScoresOpen, setHighScoresOpen] = useState(false)

  if (redirect) {
    return <Redirect to={'/games/view/' + redirectGameId} />
  }

  const handleHighScoresOpen = () => {
    playersService.getHighScores(playerId).then(scores => setHighScores(scores))
    setHighScoresOpen(true)
  };

  const handleHighScoresClose = () => {
    setHighScoresOpen(false)
  }

  const handleGameClick = (e: any) => {
    setRedirectGameId(e.currentTarget.value)
    setRedirect(true)
  }

  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  }

  return (
    <div>
      <Button size="small" onClick={handleHighScoresOpen}>
        High scores
      </Button>
      <Modal
        className={classes.modal}
        open={highScoresOpen}
        onClose={handleHighScoresClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={highScoresOpen}>
          <div className={classes.container}>
            <Table className={classes.modalTable} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>To Par</TableCell>
                  <TableCell>Game Card</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {highScores?.map((score: HighScore) => (
                  <TableRow key={'scoreRow' + score.courseName}>
                    <TableCell align="left">{score.courseName}</TableCell>
                    <TableCell align="center">{score.toPar}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleGameClick}
                        value={score.gameId}
                      >
                        {score.gameDate.toLocaleString('fi-FI', dateOptions)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default HighScores
