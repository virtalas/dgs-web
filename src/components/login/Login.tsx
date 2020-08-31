import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import DiscGolfBasket from '../DiscGolfBasket'

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
    backgroundColor: '#5cb85c',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: 'auto',
    marginTop: theme.spacing(2),
  },
}))

export default function SignIn() {
  const classes = useStyles()

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <DiscGolfBasket />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password? (TODO)
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              Don't have an account? Sign Up (TODO)
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  )
  // <FormControlLabel
  //   control={<Checkbox value="remember" color="primary" />}
  //   label="Remember me"
  // />
}
