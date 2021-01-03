import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import coursesService from '../../services/coursesService'
import { sneakyGrey } from '../../constants/Colors'
import Grid from '@material-ui/core/Grid'

const inputMaxWidth = 400
const inputWidth = '90%'

const useStyles = makeStyles((theme) => ({
  page: {
  },
  formControl: {
    maxWidth: inputMaxWidth,
    width: inputWidth,
    marginTop: theme.spacing(1),
  },
  countButton: {
    width: 50,
    height: 50,
    margin: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  countInput: {
    width: 130,
    height: 50,
    margin: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  parInput: {
    width: 70,
    height: 50,
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  map: {
    width: '100%',
  },
  mapPaper: {
    maxWidth: inputMaxWidth,
    width: inputWidth,
    height: 100,
    overflow: 'hidden',
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
    // Center mapPlaceholderText vertically:
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  mapPlaceholderText: {
    color: sneakyGrey,
  },
  parInputGrid: {
    width: inputWidth,
    maxWidth: inputMaxWidth,
  },
  createButton: {
    margin: theme.spacing(3),
  },
  totalPar: {
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  match: any,
}

// TODO: remove big decrease/increase count buttons if the native up/down arrows are OK.
// TODO: List other layouts for the course that already exist

const NewLayout: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { match } = props
  const courseId = match.params.id

  const [redirect, setRedirect] = useState(false)
  const [course, setCourse] = useState<Course>(
    { id: '', name: 'Loading...', city: '', pars: [], total: 0, layouts: [], popularity: 0 }
  )
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mapURL, setMapURL] = useState('')
  const [holeCount, setHoleCount] = useState(18)
  const [pars, setPars] = useState<number[]>([])

  const updateParsLength = (newHoleCount: number): number[] => {
    while (pars.length !== newHoleCount) {
      if (pars.length > newHoleCount) {
        pars.pop()
      } else {
        pars.push(3)
      }
    }
    return pars
  }

  useEffect(() => {
    coursesService.getCourse(courseId).then(c => setCourse(c))
    setPars(updateParsLength(18)) // Default hole count is 18.
  }, [course])

  // TODO: Redirect to newly created Layout's view?
  if (redirect) {
    return <Redirect to={'/courses'} />
  }

  const handleCreateLayout = () => {
    coursesService.createLayout(courseId, name, description, mapURL, pars).then(() => setRedirect(true))
  }

  const handleCountDecrease = () => {
    if (holeCount > 1) {
      setHoleCount(holeCount - 1)
      setPars(updateParsLength(holeCount - 1))
    }
  }

  const handleCountIncrease = () => {
    setHoleCount(holeCount + 1)
    setPars(updateParsLength(holeCount + 1))
  }

  const handleHoleCountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newHoleCount = Number(event.target.value)
    // TODO: Fix input with keyboard
    if (newHoleCount > 0 && newHoleCount < 100) {
      updateParsLength(newHoleCount)
      setHoleCount(newHoleCount)
      setPars(pars)
    }
  }

  const handleParChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const holeIndex = Number(event.target.name)
    const par = Number(event.target.value)

    // TODO: Fix input with keyboard
    if (par > 0 && par < 100) {
      const newPars = [...pars]
      newPars[holeIndex] = par
      setPars(newPars)
    }
  }

  const totalPar = pars.reduce((a, b) => a + b, 0)

  const parInputs = pars.map((par, index) => (
    <TextField
      key={'par' + index}
      className={classes.parInput}
      label={'Hole ' + (index + 1)}
      variant="outlined"
      value={par}
      name={String(index)}
      type="number"
      onChange={handleParChange}
    />
  ))

  return (
    <div className={classes.page}>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
      >
        <h2>New Layout for {course.name}, {course.city}</h2>

        <TextField
          className={classes.formControl}
          label="Layout name"
          value={name}
          required
          onChange={e => setName(e.target.value)}
        />

        <TextField
          className={classes.formControl}
          label="Description"
          multiline
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <TextField
          className={classes.formControl}
          label="Map URL"
          value={mapURL}
          onChange={e => setMapURL(e.target.value)}
        />

        <Paper className={classes.mapPaper}>
          {mapURL.length === 0 ? (
            <Typography className={classes.mapPlaceholderText} align="center">
              Preview of the course map
            </Typography>
          ) : (
              <img
                className={classes.map}
                src={mapURL}
              />
            )}

        </Paper>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Button
            className={classes.countButton}
            variant="outlined"
            onClick={handleCountDecrease}
          >
            –
          </Button>
            <TextField
              className={classes.countInput}
              label="Number of holes"
              variant="outlined"
              value={holeCount}
              type="number"
              onChange={handleHoleCountChange}
            />
            <Button
              className={classes.countButton}
              variant="outlined"
              onClick={handleCountIncrease}
            >
              +
          </Button>
        </Grid>

        <Grid
          className={classes.parInputGrid}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          {parInputs}
        </Grid>

        <Typography className={classes.totalPar}>
          Total par: {totalPar}
        </Typography>

        <Button
          className={classes.createButton}
          variant="contained"
          color="primary"
          onClick={handleCreateLayout}
          disabled={name.length === 0}
        >
          Create
        </Button>
      </Grid>
    </div>
  )
}

export default NewLayout
