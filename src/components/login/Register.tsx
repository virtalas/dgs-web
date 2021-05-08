import React, { useEffect, useState, useRef } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios, { CancelTokenSource } from 'axios'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'

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

const Register: React.FC<{}> = () => {
  const classes = useStyles()
  const { authenticated, handleLogin } = useAuth()

  const [existingAccountError, setExistingAccountError] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel())

  if (authenticated) {
    return (<Redirect to='/' />)
  }

  const handleRegister = async (values: any, setSubmitting: (submitting: boolean) => void) => {
    setExistingAccountError(false)

    try {
      cancelTokenSourceRef.current = axios.CancelToken.source()
      await authService.register(values.email, values.firstName, values.lastName, values.password, cancelTokenSourceRef.current)
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

  return (
    <FormContainer title="Sign up">
      <Formik
        initialValues={{ email: '', firstName: '', lastName: '', password: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email()
            .required('Required'),
          firstName: Yup.string()
            .required('Required'),
          lastName: Yup.string()
            .required('Required'),
          password: Yup.string()
            .required('No password provided.')
            .min(8, 'Password is too short - should be 8 chars minimum.')
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleRegister(values, setSubmitting)
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
                error={
                  ((errors.email ? errors.email.length > 0 : false) && touched.email) || existingAccountError
                }
              />
              {errors.email && touched.email && (
                <div className={classes.inputFeedback}>{errors.email}</div>
              )}
              {existingAccountError && (
                <div className={classes.inputFeedback}>
                  This email has already been registered with another account.
                </div>
              )}

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="firstName"
                label="First name"
                name="firstName"
                autoComplete="given-name"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(errors.firstName ? errors.firstName.length > 0 : false) && touched.firstName}
              />
              {errors.firstName && touched.firstName && (
                <div className={classes.inputFeedback}>{errors.firstName}</div>
              )}

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="lastName"
                label="Family name"
                name="lastName"
                autoComplete="family-name"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(errors.lastName ? errors.lastName.length > 0 : false) && touched.lastName}
              />
              {errors.lastName && touched.lastName && (
                <div className={classes.inputFeedback}>{errors.lastName}</div>
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
                error={(errors.password ? errors.password.length > 0 : false) && touched.password}
              />
              {errors.password && touched.password && (
                <div className={classes.inputFeedback}>{errors.password}</div>
              )}

              <Button
                type="submit"
                id="signup"
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
        </Grid>
        <Grid item>
          <Link href="#/signin" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </FormContainer>
  )
}

export default Register
