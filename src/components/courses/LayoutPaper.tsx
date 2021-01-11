import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Grid, IconButton, Paper } from '@material-ui/core'

import Box from '@material-ui/core/Box/Box'
import EditLayout from './EditLayout'
import coursesService from '../../services/coursesService'
import CancellableModal from '../CancellableModal'

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
}

const LayoutPaper: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { layout, course, handleLayoutUpdated } = props
  const [modalOpen, setModalOpen] = useState(false)

  const handleEditLayout = () => setModalOpen(true)

  const handleUpdateLayout = (updatedLayout: Layout) => {
    coursesService.updateLayout(updatedLayout).then(l => {
      handleLayoutUpdated(updatedLayout)
      setModalOpen(false)
    })
  }

  return (
    <Paper className={classes.layoutPaper} key={'layout-' + layout.id}>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Typography variant="h6">
          {layout.name}
          {layout.active ? ' (current)' : null}
        </Typography>

        <IconButton className={classes.editButton} onClick={handleEditLayout}>
          <EditIcon />
        </IconButton>
      </Grid>

      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        {layout.pars.map((par, index) => (
          <div key={'layout-par-' + index}>
            <Box className={classes.layoutParBox} fontWeight="fontWeightBold">
              {index + 1}
            </Box>
            <Box className={classes.layoutParBox}>
              {par}
            </Box>
          </div>
        ))}
        <div>
          <Box className={classes.layoutParBox} fontWeight="fontWeightBold">
            Total
          </Box>
          <Box className={classes.layoutParBox}>
            {layout.total}
          </Box>
        </div>
      </Grid>

      <Typography>
        {layout.description}
      </Typography>

      <Button disabled size="small">Layout map</Button>

      <CancellableModal modalOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <EditLayout
          layout={layout}
          course={course}
          handleFinish={handleUpdateLayout}
          handleCancel={() => setModalOpen(false)}
        />
      </CancellableModal>
    </Paper>
  )
}

export default LayoutPaper
