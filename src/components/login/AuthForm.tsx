import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

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
  inputFeedback: {
    color: 'red',
    fontSize: '0.9em',
  },
  submit: {
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
}))

interface Props {
  title: string,
  subtitle?: string,
  handleRegister?: (values: any, setSubmitting: (submitting: boolean) => void) => void,
  existingAccountError?: boolean,
  guestName?: string,
  handleLogin?: (values: { email: string, password: string }, setSubmitting: (submitting: boolean) => void) => void,
  wrongCredentialsError?: boolean,
}

const AuthForm: React.FC<Props> = props => {
  const classes = useStyles()

  const { title, existingAccountError, subtitle, handleRegister, handleLogin, wrongCredentialsError, guestName } = props

  const isLogin = handleLogin !== undefined

  let initialValues = { email: '', firstName: guestName ? guestName : '', lastName: '', password: '' }
  let validationSchema
  let accountAlreadyExists = false
  let credentialsAreWrong = false

  if (isLogin) {
    // initialValues = { email: '', password: '' }
    credentialsAreWrong = wrongCredentialsError !== undefined && wrongCredentialsError
    validationSchema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required('Required'),
      password: Yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.')
    })
  } else {
    // initialValues = { email: '', firstName: '', lastName: '', password: '' }
    accountAlreadyExists = existingAccountError !== undefined && existingAccountError
    validationSchema = Yup.object().shape({
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
    })
  }

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <DiscGolfBasket />
      </Avatar>

      <Typography component="h1" variant="h5">
        {title}
      </Typography>

      {subtitle ? (
        <Typography>
          {subtitle}
        </Typography>
      ) : null}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (handleRegister) {
            handleRegister(values, setSubmitting)
          } else if (handleLogin) {
            handleLogin(values, setSubmitting)
          }
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

          const emailInput = (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              inputProps={{
                autoCapitalize: "off",
              }}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                ((errors.email ? errors.email.length > 0 : false) && touched.email) || accountAlreadyExists || credentialsAreWrong
              }
            />
          )

          const firstNameInput = (
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
          )

          const lastNameInput = (
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
          )

          const passwordInput = (
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
              error={((errors.password ? errors.password.length > 0 : false) && touched.password) || credentialsAreWrong}
            />
          )

          return (
            <form onSubmit={handleSubmit}>
              {emailInput}
              {errors.email && touched.email && (
                <div className={classes.inputFeedback}>{errors.email}</div>
              )}
              {accountAlreadyExists && (
                <div className={classes.inputFeedback}>
                  This email has already been registered with another account.
                </div>
              )}

              {isLogin ? null : firstNameInput}
              {errors.firstName && touched.firstName && (
                <div className={classes.inputFeedback}>{errors.firstName}</div>
              )}

              {isLogin ? null : lastNameInput}
              {errors.lastName && touched.lastName && (
                <div className={classes.inputFeedback}>{errors.lastName}</div>
              )}

              {passwordInput}
              {errors.password && touched.password && (
                <div className={classes.inputFeedback}>{errors.password}</div>
              )}
              {credentialsAreWrong && (
                <div className={classes.inputFeedback}>
                  You have entered an invalid email or password.
                </div>
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
                {isLogin ? "Sign in" : "Sign up"}
              </Button>
            </form>
          )
        }}
      </Formik>

      {props.children}
    </div>
  )
}

export default AuthForm
