import React, { useEffect, useRef, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from 'recharts'

import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Grid, IconButton, Paper } from '@material-ui/core'

import Box from '@material-ui/core/Box/Box'
import EditLayout from './EditLayout'
import coursesService from '../../services/coursesService'
import CancellableModal from '../CancellableModal'
import baseService from '../../services/baseService'
import { CancelTokenSource } from 'axios'
import { birdieGreen, bogeyOrange, eagleYellow, holeInOneRed, overBogeyPurple, parGreen } from '../../constants/Colors'
import HoleInfoView from '../gameInput/HoleInfoView'

const useStyles = makeStyles((theme) => ({
  layoutPaper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  layoutParBox: {
    margin: theme.spacing(1),
  },
  editButton: {
    marginLeft: theme.spacing(1),
  },
  swipeableView: {
    height: '100%',
  },
}))

interface Props {
  layout: DetailedLayout,
  course: Course,
  handleLayoutUpdated: (layout: DetailedLayout) => void,
  handleLayoutDeleted: (layout: Layout) => void,
}

const LayoutPaper: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { layout, course, handleLayoutUpdated, handleLayoutDeleted } = props

  const [holeScoreDistribution, setHoleScoreDistribution] = useState<HoleScoreDistribution[]>()
  const [holeIndex, setHoleIndex] = useState(0)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [scoreDistributionModalOpen, setScoreDistributionModalOpen] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchHoleScoreDistribution = async () => {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const hsd = await coursesService.getLayoutScoreDistribution(layout.id, cancelTokenSourceRef.current)
      setHoleScoreDistribution(hsd)
    }
  
    fetchHoleScoreDistribution()
    return () => cancelTokenSourceRef.current?.cancel()
  }, [layout.id])

  const handleEditLayout = () => setEditModalOpen(true)

  const handleToggleLayoutActiveness = () => {
    layout.active = !layout.active
    handleUpdateLayoutActiveness(layout)
  }

  const handleUpdateLayoutActiveness = (updatedLayout: DetailedLayout) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.updateLayoutActiveness(updatedLayout, cancelTokenSourceRef.current).then(l => {
      handleLayoutUpdated(updatedLayout)
      setEditModalOpen(false)
    })
  }

  const handleUpdateLayout = (updatedLayout: DetailedLayout) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.updateLayout(updatedLayout, cancelTokenSourceRef.current).then(returnedLayout => {
      handleLayoutUpdated(returnedLayout)
      setEditModalOpen(false)
    })
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this layout? All games on this layout will be deleted as well.')) {
      return
    }

    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.deleteLayout(layout, cancelTokenSourceRef.current)
      .then(() => handleLayoutDeleted ? handleLayoutDeleted(layout) : null)
  }

  const editButton = layout.allowedToEdit ? (
    <IconButton data-cy="editLayoutButton" className={classes.editButton} onClick={handleEditLayout}>
      <EditIcon />
    </IconButton>
  ) : null

  const titleRow = (
    <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
    >
      <Typography data-cy="layoutName" variant="h6">
        {layout.name}

        <Button onClick={handleToggleLayoutActiveness}>
          {layout.active ? 'set inactive' : 'set active'}
        </Button>
      </Typography>

      {editButton}
    </Grid>
  )

  const holeInfoTable = (
    <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
    >
      {layout.holes.map((hole, index) => (
        <div key={'layout-par-' + index}>
          <Box className={classes.layoutParBox} fontWeight="fontWeightBold">
            {hole.number}
          </Box>
          <Box className={classes.layoutParBox}>
            {hole.par}
          </Box>
        </div>
      ))}
      <div>
        <Box className={classes.layoutParBox} fontWeight="fontWeightBold">
          Total
        </Box>
        <Box className={classes.layoutParBox}>
          {layout.holes.map(hole => hole.par).reduce((a, b) => a + b, 0)}
        </Box>
      </div>
    </Grid>
  )

  const data = holeScoreDistribution?.map(hsd => {
    return {
      holeNum: hsd.holeNum,
      holeInOneCount: hsd.holeInOneCount,
      eagleCount: hsd.eagleCount,
      birdieCount: hsd.birdieCount,
      parCount: hsd.parCount,
      bogeyCount: hsd.bogeyCount,
      overBogeyCount: hsd.overBogeyCount,
    }
  })

  const scoreDistributionGraph = layout.numberOfGamesUniversal > 0 && holeScoreDistribution && (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          stackOffset="expand"
          margin={{
            top: 10,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <XAxis dataKey="holeNum" />
          <Bar dataKey="holeInOneCount" stackId="a" fill={holeInOneRed} />
          <Bar dataKey="eagleCount" stackId="a" fill={eagleYellow} />
          <Bar dataKey="birdieCount" stackId="a" fill={birdieGreen} />
          <Bar dataKey="parCount" stackId="a" fill={parGreen} />
          <Bar dataKey="bogeyCount" stackId="a" fill={bogeyOrange} />
          <Bar dataKey="overBogeyCount" stackId="a" fill={overBogeyPurple} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <Paper data-cy="layoutPaper" className={classes.layoutPaper} key={'layout-' + layout.id}>
      {titleRow}

      {holeInfoTable}

      <Typography data-cy="layoutDesc">
        {layout.description}
      </Typography>

      <br />

      {layout.numberOfGamesUniversal > 0 && (
        <Typography variant="overline">
          {scoreDistributionGraph ?
            `Scores from all players (${layout.numberOfGamesUniversal} game${layout.numberOfGamesUniversal !== 1 ? 's' : ''}):`
          :
            'Loading...'}
        </Typography>
      )}

      {scoreDistributionGraph}

      {/* TODO */}
      {/* <Button size="small">Layout map</Button> */}

      <Button onClick={() => setScoreDistributionModalOpen(true)}>Slideshow</Button>

      <CancellableModal modalOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <EditLayout
          layout={layout}
          course={course}
          handleFinish={handleUpdateLayout}
          handleCancel={() => setEditModalOpen(false)}
          handleDelete={handleDelete}
        />
      </CancellableModal>

      <CancellableModal modalOpen={scoreDistributionModalOpen} onClose={() => setScoreDistributionModalOpen(false)}>
        <HoleInfoView
          layout={layout}
          holeIndex={holeIndex}
          setHoleIndex={setHoleIndex}
          swipeableViewStyle={classes.swipeableView}
          holeScoreDistribution={holeScoreDistribution}
          setHoleScoreDistribution={setHoleScoreDistribution}
        />
      </CancellableModal>

    </Paper>
  )
}

export default LayoutPaper
