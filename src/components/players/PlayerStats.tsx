import React, { useEffect, useRef, useState } from 'react'

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

import baseService from '../../services/baseService'
import playersService from '../../services/playersService'

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordion: {
    border: '1px solid lightgrey',
  },
  lastRowCell: {
    borderBottom: 'none',
  },
}))

interface Props {
  playerId: string,
}

const PlayerStats: React.FC<Props> = props => {
  const classes = useStyles()

  const { playerId } = props

  const [countStats, setCountStats] = useState<PlayerCountStats>()
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  const fetchPlayerCountStatsIfNeeded = async () => {
    if (countStats) return
    setIsLoading(true)
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    const userCountStats = await playersService.getPlayerCountStats(playerId, cancelTokenSourceRef.current)
    setCountStats(userCountStats)
    setIsLoading(false)
  }

  const toggleExpand = async () => {
    setExpanded(!expanded)
    fetchPlayerCountStatsIfNeeded()
  }

  return (
    <Accordion className={classes.accordion} elevation={0} expanded={expanded}>
      
      <AccordionSummary
        expandIcon={isLoading ? <CircularProgress size={20} /> : <ExpandMoreIcon />}
        id="panel1a-header"
        onClick={toggleExpand}
      >
        <Typography className={classes.heading}>Stats</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Table className={classes.table} size="small">
          <TableBody>
            <TableRow>
              <TableCell>Games</TableCell>
              <TableCell align="right">
                {countStats ? countStats.gameCount : ''}
              </TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell>Throws</TableCell>
              <TableCell align="right">XXX</TableCell>
            </TableRow> */}
            {/* <TableRow>
              <TableCell>Latest game</TableCell>
              <TableCell align="right">XXX</TableCell>
            </TableRow> */}
            <TableRow>
              <TableCell>Hole in ones</TableCell>
              <TableCell align="right">
                {countStats ? countStats.holeInOneCount : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Eagles (excluding hole in ones)</TableCell>
              <TableCell align="right">
                {countStats ? countStats.eagleCount : ''}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.lastRowCell}>Birdies</TableCell>
              <TableCell className={classes.lastRowCell} align="right">
                {countStats ? countStats.birdieCount : ''}
              </TableCell>
            </TableRow>
            {/* <TableRow>
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
            </TableRow> */}
          </TableBody>
        </Table>
      </AccordionDetails>

    </Accordion>
  )
}

export default PlayerStats
