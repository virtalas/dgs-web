import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import FormContainer from './FormContainer'

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
  const { authToken, loggedIn } = useAuth()

  const [wrongCredentialsError, setWrongCredentialsError] = useState(false)

  if (authToken) {
    return (<Redirect to='/' />)
  }

  const handleLogin = (values: { email: string, password: string }, setSubmitting: (submitting: boolean) => void) => {
    setWrongCredentialsError(false)

    authService.login(values.email, values.password).then(accessToken => {
      if (loggedIn) {
        setSubmitting(false)
        loggedIn(accessToken)
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
    <FormContainer title="Sign in">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email()
            .required('Required'),
          password: Yup.string()
            .required('No password provided.')
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleLogin(values, setSubmitting)
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props

          return (
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={((errors.email ? errors.email.length > 0 : false) && touched.email) || wrongCredentialsError}
              />
              {errors.email && touched.email && (
                <div className={classes.inputFeedback}>{errors.email}</div>
              )}

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={((errors.password ? errors.password.length > 0 : false) && touched.password) || wrongCredentialsError}
              />
              {errors.password && touched.password && (
                <div className={classes.inputFeedback}>{errors.password}</div>
              )}

              {wrongCredentialsError && (
                <div className={classes.inputFeedback}>
                  You have entered an invalid email or password.
                </div>
              )}

              <Button
                type="submit"
                id="signin"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
              >
                Sign up
              </Button>
            </form>
          )
        }}
      </Formik>

      <Grid container className={classes.buttonsGrid}>
        <Grid item xs>
          {/* <Link href="#" variant="body2">
            Forgot password? (coming soon)
          </Link> */}
        </Grid>
        <Grid item id="#signup">
          <Link href="#/register" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Grid>
      </Grid>
    </FormContainer>
  )
  // <FormControlLabel
  //   control={<Checkbox value="remember" color="primary" />}
  //   label="Remember me"
  // />
}

export default SignIn
