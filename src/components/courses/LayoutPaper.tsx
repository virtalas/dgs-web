import React, { useEffect, useRef, useState } from 'react'

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
}))

interface Props {
  layout: Layout,
  course: Course,
  handleLayoutUpdated: (layout: Layout) => void,
  handleLayoutDeleted: (layout: Layout) => void,
}

const LayoutPaper: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { layout, course, handleLayoutUpdated, handleLayoutDeleted } = props
  const [modalOpen, setModalOpen] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel())

  const handleEditLayout = () => setModalOpen(true)

  const handleToggleLayoutActiveness = () => {
    layout.active = !layout.active
    handleUpdateLayoutActiveness(layout)
  }

  const handleUpdateLayoutActiveness = (updatedLayout: Layout) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.updateLayoutActiveness(updatedLayout, cancelTokenSourceRef.current).then(l => {
      handleLayoutUpdated(updatedLayout)
      setModalOpen(false)
    })
  }

  const handleUpdateLayout = (updatedLayout: Layout) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.updateLayout(updatedLayout, cancelTokenSourceRef.current).then(l => {
      handleLayoutUpdated(updatedLayout)
      setModalOpen(false)
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
        justify="flex-start"
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
        justify="flex-start"
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

  return (
    <Paper data-cy="layoutPaper" className={classes.layoutPaper} key={'layout-' + layout.id}>
      {titleRow}

      {holeInfoTable}

      <Typography data-cy="layoutDesc">
        {layout.description}
      </Typography>

      <Button disabled size="small">Layout map</Button>

      <CancellableModal modalOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <EditLayout
          layout={layout}
          course={course}
          handleFinish={handleUpdateLayout}
          handleCancel={() => setModalOpen(false)}
          handleDelete={handleDelete}
        />
      </CancellableModal>
    </Paper>
  )
}

export default LayoutPaper
