import React, { useEffect, useState, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import axios, { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import playersService from '../../services/playersService'
import CancellableModal from '../CancellableModal'
import LoadingView from '../LoadingView'

const useStyles = makeStyles((theme) => ({
  modalTable: {
    display: 'table',
  },
  closeButton: {
    margin: theme.spacing(2),
  },
  indentedText: {
    paddingLeft: theme.spacing(3),
  }
}))

interface Props {
  playerId: string,
  playerName: string,
}

const HighScores: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { playerId, playerName } = props
  const [redirect, setRedirect] = useState(false)
  const [redirectGameId, setRedirectGameId] = useState('')
  const [highScores, setHighScores] = useState<CourseHighScores[]>()
  const [highScoresOpen, setHighScoresOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), []) // eslint-disable-line react-hooks/exhaustive-deps

  if (redirect) {
    return <Redirect push to={'/games/view/' + redirectGameId} />
  }

  const handleHighScoresOpen = () => {
    cancelTokenSourceRef.current = axios.CancelToken.source()
    setIsLoading(true)
    setHighScoresOpen(true)

    playersService.getHighScores(playerId, cancelTokenSourceRef.current).then(scores => {
      setIsLoading(false)
      setHighScores(scores)
    })
  }

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

  const courseNameRow = (courseHighScores: CourseHighScores) => (
    <TableRow key={'scoreRow' + courseHighScores.courseName}>
      <TableCell align="left">
        <b>{courseHighScores.courseName}</b>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  )

  const layoutHighScoreRow = (layoutHighScore: LayoutHighScore) => (
    <TableRow key={'scoreRow' + layoutHighScore.layoutName}>
      <TableCell align="left">
        <div className={classes.indentedText}>
          {layoutHighScore.layoutName}
        </div>
      </TableCell>

      <TableCell align="center">
        {layoutHighScore.toPar}
      </TableCell>

      <TableCell align="right">
        <Button
          data-cy="highScoreGameButton"
          variant="outlined"
          size="small"
          onClick={handleGameClick}
          value={layoutHighScore.gameId}
        >
          {layoutHighScore.gameEndDate.toLocaleString('fi-FI', dateOptions)}
        </Button>
      </TableCell>
    </TableRow>
  )

  const courseHighScoreRows = highScores?.map((courseHighScores: CourseHighScores) => [
    courseNameRow(courseHighScores),
    courseHighScores.layoutHighScores.map((layoutHighScore: LayoutHighScore) => (
      layoutHighScoreRow(layoutHighScore)
    ))
  ])

  const highScoresTable = (
    <Table data-cy="highScoresTable" className={classes.modalTable} size="small">
      <TableHead>
        <TableRow>
          <TableCell>Course/Layout</TableCell>
          <TableCell>To Par</TableCell>
          <TableCell>Score Card</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {courseHighScoreRows}
      </TableBody>
    </Table>
  )

  return (
    <div>
      <Button data-cy="highScoresButton" size="small" onClick={handleHighScoresOpen}>
        High scores
      </Button>
      <CancellableModal modalOpen={highScoresOpen} onClose={handleHighScoresClose}>
        {isLoading ? (
          <div>
            <LoadingView />
            <br /><br /><br /><br /><br />
          </div>
        ) : (
          <div>
            <Typography variant="h6">{playerName}</Typography>
            {highScoresTable}
          </div>
        )}
        <Button className={classes.closeButton} data-cy="closeModal" variant="outlined" onClick={handleHighScoresClose}>
          Close
        </Button>
      </CancellableModal>
    </div>
  )
}

export default HighScores
