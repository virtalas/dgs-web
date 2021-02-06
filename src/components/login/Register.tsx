import React, { useState } from 'react'
import { Formik } from 'formik'
import * as EmailValidator from 'email-validator'
import * as Yup from 'yup'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'

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

const Register: React.FC<{}> = () => {
  const classes = useStyles()
  // const { authToken, loggedIn } = useAuth()

  // if (authToken) {
  //   return (<Redirect to='/' />)
  // }

  return (
    <AuthForm title="Sign up">
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
          authService.register(values.email, values.firstName, values.lastName, values.password)
            .then((token: string) => {
            setSubmitting(false)
            console.log(token)
          }).catch(error => {
            // TODO: handle existing email error
            console.log(error)
          })
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
                error={(errors.email ? errors.email.length > 0 : false) && touched.email}
              />
              {errors.email && touched.email && (
                <div className={classes.inputFeedback}>{errors.email}</div>
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
        </Grid>
        <Grid item>
          <Link href="#/signin" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </AuthForm>
  )
}

export default Register
