import React, { useEffect, useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

import baseService from '../../services/baseService'
import coursesService from '../../services/coursesService'

const useStyles = makeStyles((theme) => ({
  table: {
    marginBottom: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordion: {
    border: '1px solid lightgrey',
    textAlign: 'center',
  },
  lastRowCell: {
    borderBottom: 'none',
  },
  gameLinkButton: {
    width: 92,
  },
  detailsRoot: {
    width: '100%',
  },
}))

interface Props {
  layoutId: string,
}

const LayoutTopScores: React.FC<Props> = props => {
  const classes = useStyles()

  const { layoutId } = props

  const [topScores, setTopScores] = useState<LayoutTopScore[]>()
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [redirectGameId, setRedirectGameId] = useState('')

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchTopScores = async () => {
      setIsLoading(true)
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const topScores = await coursesService.getLayoutTopScores(layoutId, cancelTokenSourceRef.current)
      setTopScores(topScores)
      setIsLoading(false)
    }
    
    fetchTopScores()
    return () => cancelTokenSourceRef.current?.cancel()
  }, [layoutId])

  if (redirect) {
    return <Redirect push to={'/games/view/' + redirectGameId} />
  }

  const toggleExpand = async () => {
    setExpanded(!expanded)
  }

  const handleGameClick = (e: any) => {
    setRedirectGameId(e.currentTarget.value)
    setRedirect(true)
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  }

  const presentableToPar = (toPar: number) => toPar > 0 ? '+' + toPar : '' + toPar

  const tableBody = topScores?.map((topScore, index) => {
    const className = index === topScores.length - 1 ? classes.lastRowCell : ''
    return (
      <TableRow key={index}>
        <TableCell className={className} align="left">{index + 1}. {topScore.playerFirstName}</TableCell>
        <TableCell className={className} align="right">{presentableToPar(topScore.toPar)}</TableCell>
        <TableCell className={className} align="right">
          <Button
            className={classes.gameLinkButton}
            data-cy="highScoreGameButton"
            variant="outlined"
            size="small"
            onClick={handleGameClick}
            value={topScore.gameId}
          >
            {topScore.gameEndDate.toLocaleString('en-FI', dateOptions)}
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  return (topScores === undefined || topScores.length > 0) ? (
    <Accordion className={classes.accordion} elevation={0} expanded={expanded}>
      
      <AccordionSummary
        expandIcon={isLoading ? <CircularProgress size={20} /> : <ExpandMoreIcon />}
        id="panel1a-header"
        onClick={toggleExpand}
      >
        <Typography className={classes.heading}>
          {topScores && topScores.length > 0 ? (
            'Top score: ' + topScores[0].playerFirstName + ' (' + presentableToPar(topScores[0].toPar) + ')'
          ) : 'Top score:'}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <div className={classes.detailsRoot}>
          <Table className={classes.table} size="small">
            <TableBody>
              {tableBody}
            </TableBody>
          </Table>

          <Typography variant="caption">
            Top 5 scores from you and your friends.
          </Typography>
        </div>
      </AccordionDetails>

    </Accordion>
  ) : null
}

export default LayoutTopScores
