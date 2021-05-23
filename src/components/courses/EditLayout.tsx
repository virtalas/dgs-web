import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { sneakyGrey } from '../../constants/Colors'
import Grid from '@material-ui/core/Grid'
import { allowedToEditExplanation } from '../../constants/Strings'

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
    width: 145,
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
  explanation: {
    marginTop: theme.spacing(2),
    width: '70%',
    textAlign: 'center',
  },
}))

interface Props {
  layout?: Layout, // Layout to edit, or undefined if adding a new layout.
  course: Course,
  handleFinish: (layout: Layout) => void,
  handleCancel?: () => void,
}

// TODO: edit hole numbers: Button opens a modal with inputs 'Starts with hole number: ...', 'choose hole to delete'.
// TODO: remove big decrease/increase count buttons if the native up/down arrows are OK.
// TODO: List other layouts for the course that already exist

const EditLayout: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { layout, course, handleFinish, handleCancel } = props
  const newLayout = layout ? false : true

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mapURL, setMapURL] = useState('')
  const [holes, setHoles] = useState<Hole[]>([])

  const updateHoleCount = (newHoleCount: number) => {
    // Temporarily accept zero to enable empty field while editing.
    if (newHoleCount < 0 || newHoleCount >= 100) {
      return
    }
    while (holes.length !== newHoleCount) {
      if (holes.length > newHoleCount) {
        holes.pop()
      } else {
        holes.push({
          number: holes.length + 1,
          par: 3,
        })
      }
    }
    setHoles([...holes])
  }

  useEffect(() => {
    if (layout) {
      setName(layout.name)
      setDescription(layout.description)
      setMapURL(layout.mapURL)
      setHoles(layout.holes)
    } else {
      updateHoleCount(18)
    }
  }, [layout]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalPar = holes.reduce((total, hole) => total + hole.par, 0)
  const numberOfZeroPars = holes.reduce((total, hole) => hole.par === 0 ? total + 1 : total, 0)

  const handleFinishClicked = () => {
    const inputtedLayout = {
      id: layout?.id ?? '',
      active: layout?.active ?? false,
      name: name,
      description: description,
      mapURL: mapURL,
      holes: holes,
      total: totalPar,
      allowedToEdit: layout?.allowedToEdit
    }
    handleFinish(inputtedLayout)
  }

  const handleCountDecrease = () => {
    if (holes.length > 1) {
      updateHoleCount(holes.length - 1)
    }
  }

  const handleCountIncrease = () => {
    updateHoleCount(holes.length + 1)
  }

  const handleHoleCountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newHoleCount = Number(event.target.value)
    updateHoleCount(newHoleCount)
  }

  const handleParChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const holeIndex = Number(event.target.name)
    const par = Number(event.target.value)

    // Temporarily accept zero to enable empty field while editing.
    if (par >= 0 && par < 100) {
      holes[holeIndex].par = par
      setHoles([...holes])
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
        value={holes.length === 0 ? '' : holes.length}
        error={holes.length === 0}
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

  const parInputs = holes.map((hole, index) => (
    <TextField
      key={'par' + index}
      className={classes.parInput}
      label={'Hole ' + (index + 1)}
      variant="outlined"
      value={hole.par === 0 ? '' : hole.par}
      error={hole.par === 0}
      name={String(index)}
      type="number"
      onChange={handleParChange}
    />
  ))

  return (
    <div id="editLayout" className={classes.page}>
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
          id="layoutNameInput"
          value={name}
          required
          onChange={e => setName(e.target.value)}
        />

        <TextField
          className={classes.formControl}
          label="Description"
          id="layoutDescInput"
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
            id="submitLayoutButton"
            className={classes.createButton}
            variant="contained"
            color="primary"
            onClick={handleFinishClicked}
            disabled={name.length === 0 || numberOfZeroPars > 0 || holes.length === 0}
          >
            {newLayout ? 'Create' : 'Update'}
          </Button>
        </Grid>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Typography className={classes.explanation} component="p" variant="caption">
            {allowedToEditExplanation + 'layout.'}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default EditLayout
