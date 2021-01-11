import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { sneakyGrey } from '../../constants/Colors'
import Grid from '@material-ui/core/Grid'

const inputMaxWidth = 400
const inputWidth = '90%'

const useStyles = makeStyles((theme) => ({
  page: {
    marginBottom: theme.spacing(2),
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
    marginBottom: 0,
  },
  totalPar: {
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  layout?: Layout, // Layout to edit, undefined if it's new.
  course: Course,
  handleFinish: (layout: Layout) => void,
  handleCancel?: () => void,
}

// TODO: remove big decrease/increase count buttons if the native up/down arrows are OK.
// TODO: List other layouts for the course that already exist

const EditLayout: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { layout, course, handleFinish, handleCancel } = props
  const newLayout = layout ? false : true

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
    if (newLayout) {
      setPars(updateParsLength(18)) // Default hole count is 18.
    } else {
      setName(layout ? layout.name : '')
      setDescription(layout ? layout.description : '')
      setMapURL(layout ? layout.mapURL : '')
      setHoleCount(layout ? layout.pars.length : 18)
      setPars(layout ? layout.pars : [])
    }
  }, [layout, newLayout]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalPar = pars.reduce((total, currentValue) => total + currentValue, 0)
  const numberOfZeroPars = pars.reduce((total, currentValue) => currentValue === 0 ? total + 1 : total, 0)

  const handleFinishClicked = () => {
    const layoutId = layout ? layout.id : ''
    const active = layout ? layout.active : false
    const inputtedLayout = {
      id: layoutId,
      active: active,
      name: name,
      description: description,
      mapURL: mapURL,
      pars: pars,
      total: totalPar
    }
    handleFinish(inputtedLayout)
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
    // Temporarily accept zero to enable empty field while editing.
    if (newHoleCount >= 0 && newHoleCount < 100) {
      updateParsLength(newHoleCount)
      setHoleCount(newHoleCount)
      setPars(pars)
    }
  }

  const handleParChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const holeIndex = Number(event.target.name)
    const par = Number(event.target.value)

    // Temporarily accept zero to enable empty field while editing.
    if (par >= 0 && par < 100) {
      const newPars = [...pars]
      newPars[holeIndex] = par
      setPars(newPars)
    }
  }

  const holeCountControls = (
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
        value={holeCount === 0 ? '' : holeCount}
        error={holeCount === 0}
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
  )

  const parInputs = pars.map((par, index) => (
    <TextField
      key={'par' + index}
      className={classes.parInput}
      label={'Hole ' + (index + 1)}
      variant="outlined"
      value={par === 0 ? '' : par}
      error={par === 0}
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
        <Typography className={classes.formControl} variant="h5">
          {newLayout ? 'New ' : 'Edit '}
          Layout for {course.name}, {course.city}
        </Typography>

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
                alt="Course map"
              />
            )}
        </Paper>

        {newLayout ? holeCountControls : null}

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

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          {newLayout ? null : (
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
            disabled={name.length === 0 || numberOfZeroPars > 0 || holeCount === 0}
          >
            {newLayout ? 'Create' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default EditLayout
