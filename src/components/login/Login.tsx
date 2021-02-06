import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import AuthForm from './AuthForm'

import authService from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { Redirect } from 'react-router'

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  buttonsGrid: {
    marginTop: theme.spacing(2),
  }
}))

const SignIn: React.FC<{}> = () => {
  const classes = useStyles()
  const { authToken, loggedIn } = useAuth()

  const handleLogin = () => {
    authService.login('', '').then((token: string) => {
      // TODO: Handle JWT
      if (loggedIn) loggedIn(token)
    })
  }

  if (authToken) {
    return (<Redirect to='/' />)
  }

  return (
    <AuthForm title="Sign in">
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
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
        id="signin"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleLogin}
      >
        Sign In
      </Button>

      <Grid container className={classes.buttonsGrid}>
        <Grid item xs>
          {/* <Link href="#" variant="body2">
            Forgot password? (coming soon)
          </Link> */}
        </Grid>
        <Grid item>
          <Link href="#/register" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Grid>
      </Grid>
    </AuthForm>
  )
  // <FormControlLabel
  //   control={<Checkbox value="remember" color="primary" />}
  //   label="Remember me"
  // />
}

export default SignIn
