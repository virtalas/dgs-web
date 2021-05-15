import React, { useEffect, useState, useRef } from 'react'
import axios, { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'

import FormContainer from './AuthForm'

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

const Register: React.FC<{}> = (props: any) => {
  const classes = useStyles()
  const { authenticated, handleLogin } = useAuth()

  const guestId = props.match.params.guestid
  const isInvitation = guestId !== undefined
  const guestName = getParameterByName('name')

  const [existingAccountError, setExistingAccountError] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  if (authenticated) {
    return (<Redirect to='/' />)
  }

  const handleRegister = async (values: any, setSubmitting: (submitting: boolean) => void) => {
    setExistingAccountError(false)

    try {
      cancelTokenSourceRef.current = axios.CancelToken.source()
      if (isInvitation) {
        await authService.registerGuestAsUser(guestId, values.email, values.firstName, values.lastName, values.password, cancelTokenSourceRef.current)
      } else {
        await authService.register(values.email, values.firstName, values.lastName, values.password, cancelTokenSourceRef.current, guestId)
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setExistingAccountError(true)
      } else {
        alert('Registering failed:\n\n' + error)
      }
      setSubmitting(false)
      return
    }

    try {
      const accessToken = await authService.login(values.email, values.password)
      if (handleLogin) {
        setSubmitting(false)
        handleLogin(accessToken)
      }
    } catch (error) {
      alert('Registering succeeded, but login failed:\n\n' + error)
    }
  }

  let titleText
  if (isInvitation) {
    if (guestName) {
      titleText = 'Hi, ' + guestName + "!"
    } else {
      titleText = 'Hi!'
    }
  } else {
    titleText = 'Sign up'
  }

  return (
    <div>
      <FormContainer
        title={titleText}
        subtitle={isInvitation ? "Welcome to Disc Golf Stats! Sign up here to create and view your and your friends' games, and much more!" : ''}
        existingAccountError={existingAccountError}
        handleRegister={handleRegister}
        guestName={guestName ?? undefined}
      >
        <Grid container className={classes.buttonsGrid}>
          <Grid item xs>
          </Grid>
          <Grid item>
            <Link href="#/signin" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </FormContainer>
    </div>
  )
}

function getParameterByName(name: string, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&') // eslint-disable-line no-useless-escape
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export default Register
