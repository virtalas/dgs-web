import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import DiscGolfBasket from '../DiscGolfBasket'
import { grassGreen } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '40%',
    minWidth: 250,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: grassGreen,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}))

interface Props {
  title: string,
}

const FormContainer: React.FC<Props> = props => {
  const classes = useStyles()

  const { title } = props

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <DiscGolfBasket />
      </Avatar>

      <Typography component="h1" variant="h5">
        {title}
      </Typography>

      <div className={classes.form}>
        {props.children}
      </div>
    </div>
  )
}

export default FormContainer
