import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { allowedToEditExplanation } from '../../constants/Strings'
import DisableableButton from '../DisableableButton'
import CoursePhotoButton from './CoursePhotoButton'
import { getUserLocation } from '../../utils/Utils'

const inputMaxWidth = 400
const inputWidth = '90%'

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(2),
  },
  formControl: {
    maxWidth: inputMaxWidth,
    width: inputWidth,
    marginTop: theme.spacing(2),
  },
  locationButton: {
    marginTop: theme.spacing(2),
  },
  createButton: {
    margin: theme.spacing(3),
    marginBottom: 0,
  },
  deleteButton: {
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  explanation: {
    marginTop: theme.spacing(2),
    width: '70%',
    textAlign: 'center',
  },
}))

interface Props {
  course?: DetailedCourse, // Course to edit, undefined if it's new.
  handleFinish: (course: Course) => void,
  handleCancel?: () => void,
  handleDelete?: () => void,
}

const EditCourse: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course, handleFinish, handleCancel, handleDelete } = props

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [latError, setLatError] = useState(false)
  const [lonError, setLonError] = useState(false)
  const [photo, setPhoto] = useState<Photo>()

  const newCourse = course ? false : true

  useEffect(() => {
    if (!newCourse) {
      setName(course ? course.name : '')
      setCity(course ? course.city : '')
      setLat(course && course.lat ? String(course.lat) : '')
      setLon(course && course.lon ? String(course.lon) : '')
      setPhoto(course && course.photo ? course.photo : undefined)
    }
  }, [course, newCourse])

  const handleFinishClicked = () => {
    const inputtedCourse = {
      id: course?.id ?? '',
      name: name,
      city: city,
      lat: lat.length > 0 ? Number(lat) : undefined,
      lon: lon.length > 0 ? Number(lon) : undefined,
      numberOfGames: course?.numberOfGames ?? 0,
      photo: photo,
    }
    handleFinish(inputtedCourse)
  }

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = e.target.value
    if (isNaN(Number(input)) && input !== '-') {
      return
    }
    setLat(input)
    const newLat = Number(input)
    setLatError(!(newLat >= -90 && newLat <= 90))
  }

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = e.target.value
    if (isNaN(Number(input)) && input !== '-') {
      return
    }
    setLon(input)
    const newLon = Number(input)
    setLonError(!(newLon >= -180 && newLon <= 180))
  }

  const handleGetCurrentLocation = () => {
    const locationDataInputted = lat.length > 0 || lon.length > 0
    if (locationDataInputted && !window.confirm('Override the currently set latitude and longitude?')) return
    
    getUserLocation((lat, lon) => {
      if (!lat || !lon) return
      setLat(String(lat))
      setLon(String(lon))
    })
  }

  const deleteButton = !newCourse ? (
    <Button
      className={classes.deleteButton}
      color="secondary"
      onClick={() => handleDelete ? handleDelete() : null}
    >
      Delete
    </Button>
  ) : null

  return (
    <div className={classes.page}>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography variant="h5">
          {newCourse ? 'New' : 'Edit'} Course
        </Typography>

        <TextField
          className={classes.formControl}
          label="Name"
          data-cy="courseNameInput"
          value={name}
          required
          onChange={e => setName(e.target.value)}
        />

        <TextField
          className={classes.formControl}
          label="City"
          data-cy="courseCityInput"
          value={city}
          required
          onChange={e => setCity(e.target.value)}
        />

        <TextField
          className={classes.formControl}
          label="Latitude"
          data-cy="courseLatInput"
          value={lat ? lat : ''}
          error={latError}
          onChange={handleLatitudeChange}
        />

        <TextField
          className={classes.formControl}
          label="Longitude"
          data-cy="courseLonInput"
          value={lon ? lon : ''}
          error={lonError}
          onChange={handleLongitudeChange}
        />
        
        <Button
          className={classes.locationButton}
          variant="outlined"
          size="small"
          onClick={handleGetCurrentLocation}
        >
          Use my location
        </Button>

        <CoursePhotoButton
          course={course}
          photo={photo}
          setPhoto={setPhoto}
        />

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {newCourse ? null : (
            <Button
              className={classes.createButton}
              variant="contained"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}

          <div className={classes.createButton}>
            <DisableableButton
              onClick={handleFinishClicked}
              disabled={name.length === 0 || city.length === 0 || latError || lonError}
            >
              {newCourse ? 'Create' : 'Update'}
            </DisableableButton>
          </div>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography className={classes.explanation} component="p" variant="caption">
            {allowedToEditExplanation + 'course.'}
          </Typography>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {deleteButton}
        </Grid>
      </Grid>
    </div>
  )
}

export default EditCourse
