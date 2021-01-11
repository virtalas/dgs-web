import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

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
    marginBottom: 0,
  },
}))

interface Props {
  course?: Course, // Course to edit, undefined if it's new.
  handleFinish: (course: Course) => void,
  handleCancel?: () => void,
}

// TODO: Feature for uploading a picture of the course. (use same preview as NewLayout.tsx)

const EditCourse: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course, handleFinish, handleCancel } = props

  const [name, setName] = useState('')
  const [city, setCity] = useState('')

  const newCourse = course ? false : true

  useEffect(() => {
    if (!newCourse) {
      setName(course ? course.name : '')
      setCity(course ? course.city : '')
    }
  }, [course, newCourse])

  const handleFinishClicked = () => {
    const courseId = course ? course.id : ''
    const layouts = course ? course.layouts : []
    const numberOfGames = course ? course.popularity : 0
    const inputtedCourse = {
      id: courseId,
      name: name,
      city: city,
      layouts: layouts,
      popularity: numberOfGames,
    }
    handleFinish(inputtedCourse)
  }

  return (
    <div className={classes.page}>
      <Typography variant="h5">
        {newCourse ? 'New' : 'Edit'} Course
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

      {newCourse ? null : (
        <Button
          className={classes.createButton}
          variant="contained"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      )}

      <Button
        className={classes.createButton}
        variant="contained"
        color="primary"
        onClick={handleFinishClicked}
        disabled={name.length === 0 || city.length === 0}
      >
        {newCourse ? 'Create' : 'Update'}
      </Button>
    </div>
  )
}

export default EditCourse
