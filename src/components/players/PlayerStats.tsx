import React from 'react'

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

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordion: {
  }
}))

const PlayerStats: React.FC<{}> = () => {
  const classes = useStyles()

  return (
    <Accordion className={classes.accordion}>
      
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Stats</Typography>
      </AccordionSummary>

      <AccordionDetails>
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
      </AccordionDetails>

    </Accordion>
  )
}

export default PlayerStats
