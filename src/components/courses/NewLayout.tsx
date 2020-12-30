import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import coursesService from '../../services/coursesService'

const useStyles = makeStyles((theme) => ({
  page: {
    margin: 20,
  },
  formControl: {
    margin: 5,
    minWidth: 120,
  },
  countButton: {
    width: 50,
    height: 50,
    margin: 5,
  },
  countInput: {
    width: 130,
    height: 50,
    margin: 5,
  }
}))

interface Props {
  match: any,
}

// TODO: center all elements

const NewLayout: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { match } = props

  const [course, setCourse] = useState<Course>(
    { id: '', name: 'Loading...', city: '', pars: [], total: 0, layouts: [], popularity: 0 }
  )
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mapURL, setMapURL] = useState('')
  const [holeCount, setHoleCount] = useState(18)

  useEffect(() => {
    coursesService.getCourse(match.params.id).then(c => setCourse(c))
  }, [course])

  return (
    <div className={classes.page}>
      <h2>New Layout for {course.name}, {course.city}</h2>

      <TextField
        className={classes.formControl}
        label="Layout name"
        value={name}
      />
      <br />

      <TextField
        className={classes.formControl}
        label="Description"
        value={description}
      />
      <br />

      <TextField
        className={classes.formControl}
        label="Map URL"
        value={mapURL}
      />
      <br />

      <p>
        [Small preview of map]
      </p>
      <br />

      <Button
        className={classes.countButton}
        variant="outlined"
      >
        –
      </Button>
      <TextField
        className={classes.countInput}
        label="Number of holes"
        variant="outlined"
        value={holeCount}
      />
      <Button
        className={classes.countButton}
        variant="outlined"
      >
        +
      </Button>
    </div>
  )
}

export default NewLayout
