import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import coursesService from '../../services/coursesService'

const inputMaxWidth = 400
const inputWidth = '90%'

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(2),
  },
  formControl: {
    maxWidth: inputMaxWidth,
    width: inputWidth,
    marginTop: theme.spacing(1),
  },
  createButton: {
    margin: theme.spacing(3),
  },
}))

const NewCourse: React.FC<{}> = () => {
  const classes = useStyles()

  const [redirect, setRedirect] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [courseId, setCourseId] = useState('')

  // Redirect user to create a layout for the new course.
  if (redirect) {
    return <Redirect to={'/courses/new/layout/' + courseId} />
  }

  const handleCreateCourse = () => {
    coursesService.createCourse(name, city).then(course => {
      setCourseId(course.id)
      setRedirect(true)
    })
  }

  return (
    <div className={classes.page}>
      <Typography variant="h5">
        New Course
      </Typography>

      <TextField
        className={classes.formControl}
        label="Name"
        value={name}
        required
        onChange={e => setName(e.target.value)}
      />

      <TextField
        className={classes.formControl}
        label="City"
        value={city}
        required
        onChange={e => setCity(e.target.value)}
      />

      <Button
        className={classes.createButton}
        variant="contained"
        color="primary"
        onClick={handleCreateCourse}
        disabled={name.length === 0 || city.length === 0}
      >
        Create
      </Button>
    </div>
  )
}

export default NewCourse
