import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

import { deepBlue } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 700, // Max desktop width.
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 2vw)' // Width for mobile.
    },
    marginTop: theme.spacing(4),
    marginLeft: 'auto', // Place in the center.
    marginRight: 'auto',
    marginBottom: theme.spacing(4),
    backgroundColor: deepBlue,
    position: 'relative', // For positioning edit button.
  },
  content: {
    maxWidth: 672, // Max desktop width.
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 4vw)', // Width for mobile.
    },
    marginLeft: 'auto', // Place in the center.
    marginRight: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
}))

const BlueCard: React.FC<{}> = (props) => {
  const classes = useStyles()
  return (
    <Card className={classes.card} raised={true}>
      <div className={classes.content}>
        {props.children}
      </div>
    </Card>
  )
}

export default BlueCard
