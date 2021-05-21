import React, { useState } from 'react'
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
  },
  inputFeedback: {
    color: 'red',
    fontSize: '0.9em',
  },
}))

const SignIn: React.FC<{}> = () => {
  const classes = useStyles()
  const { authenticated, handleLogin } = useAuth()

  const [wrongCredentialsError, setWrongCredentialsError] = useState(false)

  if (authenticated) {
    return (<Redirect to='/' />)
  }

  const loggedIn = (values: { email: string, password: string }, setSubmitting: (submitting: boolean) => void) => {
    setWrongCredentialsError(false)

    authService.login(values.email, values.password).then(accessToken => {
      if (handleLogin) {
        setSubmitting(false)
        handleLogin(accessToken)
      }
    }).catch(error => {
      if (error.response && error.response.status === 401) {
        setWrongCredentialsError(true)
      } else {
        alert('Login failed:\n\n' + error)
      }
      setSubmitting(false)
    })
  }

  return (
    <AuthForm
      title="Sign in"
      handleLogin={loggedIn}
      wrongCredentialsError={wrongCredentialsError}
    >
      <Grid container className={classes.buttonsGrid}>
        <Grid item xs>
          {/* <Link href="#" variant="body2">
            Forgot password? (coming soon)
          </Link> */}
        </Grid>
        <Grid item id="#signin">
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
