import React, { useEffect, useState, useRef } from 'react'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CancellableModal from '../CancellableModal'
import CourseSelect from '../newGame/CourseSelect'
import Button from '@material-ui/core/Button'
import DisableableButton from '../DisableableButton'
import coursesService from '../../services/coursesService'
import baseService from '../../services/baseService'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

interface ProblemHoles {
  player: Player,
  problemHoleThrows: number[],
  problemHoleNumbers: number[],
  problemHoleObs: number[],
}

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(1),
  },
  problemHoleBox: {
    margin: theme.spacing(1),
    color: 'red',
  },
  cancelButton: {
    marginRight: theme.spacing(2),
  },
}))

interface Props {
  open: boolean,
  setOpen: (open: boolean) => void,
  game: Game,
  onLayoutChosen: (layout: Layout) => void,
}

const ChangeLayoutModal: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { open, setOpen, game, onLayoutChosen } = props

  const [course, setCourse] = useState<Course>()
  const [detailedCourse, setDetailedCourse] = useState<DetailedCourse>()
  const [layout, setLayout] = useState<Layout>()
  const [problemHoles, setProblemHoles] = useState<ProblemHoles[]>()
  const [holeCountMore, setHoleCountMore] = useState<boolean>()

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    if (!layout || !course) return

    if (!detailedCourse) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      coursesService.getCourse(course.id, cancelTokenSourceRef.current)
        .then(fetchedCourse => setDetailedCourse(fetchedCourse))
      return
    }

    const detailedLayout = detailedCourse.layouts.find(l => l.id === layout.id)
    if (!detailedLayout) return

    if (game.layout.holes.length < detailedLayout.holes.length) {
      // No problems
      setProblemHoles(undefined)
      setHoleCountMore(true)
      return
    } else if (game.layout.holes.length === detailedLayout.holes.length) {
      // No problems
      setProblemHoles(undefined)
      setHoleCountMore(false)
      return
    }

    // The new layout has less holes than the current layout of the game!

    let i = detailedLayout.holes.length
    setProblemHoles(game.scores.map(playerScores => {
      return {
        player: playerScores.player,
        problemHoleThrows: playerScores.strokes.slice(i),
        problemHoleNumbers: game.layout.holes.slice(i).map(hole => hole.number),
        problemHoleObs: playerScores.obs.slice(i),
      }
    }))

    return () => cancelTokenSourceRef.current?.cancel()
  }, [layout, course, detailedCourse, game.layout.holes, game.scores])

  const handleCloseModal = () => {
    setOpen(false)
    setCourse(undefined)
    setDetailedCourse(undefined)
    setLayout(undefined)
    setProblemHoles(undefined)
    setHoleCountMore(undefined)
  }

  const handleChangeButtonClicked = () => {
    if (!layout) return
    onLayoutChosen(layout)
    handleCloseModal()
  }

  const onCourseChange = (selectedCourse?: Course) => {
    if (!selectedCourse) return
    setCourse(selectedCourse)
    setDetailedCourse(undefined)
    setProblemHoles(undefined)
    setHoleCountMore(undefined)
  }

  const problemHoleTable = problemHoles ? problemHoles.map(problemHolesForPlayer => (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <div>
        <Box className={classes.problemHoleBox} fontWeight="fontWeightBold">
          Holes
        </Box>

        <Box className={classes.problemHoleBox}>
          {problemHolesForPlayer.player.firstName}
        </Box>
      </div>

      {problemHolesForPlayer.problemHoleThrows.map((throws, index) => (
        <div key={'layout-par-' + index}>
          <Box className={classes.problemHoleBox} fontWeight="fontWeightBold">
            {problemHolesForPlayer.problemHoleNumbers[index]}
          </Box>

          <Box className={classes.problemHoleBox}>
            {throws}
            {problemHolesForPlayer.problemHoleObs[index] > 0 ? '+' + problemHolesForPlayer.problemHoleObs[index] : null}
          </Box>
        </div>
      ))}
    </Grid>
  )) : null

  return (
    <CancellableModal modalOpen={open} onClose={handleCloseModal}>
      <div className={classes.page}>
        <Typography variant="h6">Change layout</Typography>

        <br />

        <CourseSelect
          layout={layout}
          setLayout={setLayout}
          onCourseChange={onCourseChange}
          chooseNearest={false}
        />

        <br />

        {course && !detailedCourse ? (
          <Typography>
            Checking...
          </Typography>
        ) : null}

        {holeCountMore ? (
          <Typography>
            Since the selected layout has more holes, new scores (with '0') will be added to the end of the game.
          </Typography>
        ) : null}

        {problemHoles ? (
          <Typography>
            The selected layout has fewer holes than this game's current layout.
            The following scores will be lost:
          </Typography>
        ) : null}

        <br />

        {problemHoleTable}

        <br />

        <Button className={classes.cancelButton} variant="contained" color="default" onClick={() => setOpen(false)}>
          Cancel
        </Button>

        <DisableableButton disabled={!layout || !course || !detailedCourse} onClick={handleChangeButtonClicked}>
          Change layout
        </DisableableButton>
      </div>
    </CancellableModal>
  )
}

export default ChangeLayoutModal
