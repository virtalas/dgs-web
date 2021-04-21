import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Grid, IconButton, Table, TableCell, TableHead, TableRow, TableBody } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

import coursesService from '../../services/coursesService'
import LayoutPaper from './LayoutPaper'
import EditCourse from './EditCourse'
import CancellableModal from '../CancellableModal'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: 600,
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(1),    
  },
  image: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 5,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  editCourseButton: {
    marginLeft: theme.spacing(1),
  },
}))

interface Props {
  match: any,
}

// TODO: Current weather conditions?
// TODO: Use ghosting after opening Accordion and fetching data
// TODO: Upload cover picture
// TODO: Use accordion, because more than 2 layouts already makes scrolling tedious for high scores etc.

const Course: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { match } = props
  const courseId = match.params.id

  const [course, setCourse] = useState<Course>()
  const [editCourseOpen, setEditCourseOpen] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    coursesService.getCourse(courseId).then(c => setCourse(c))
  }, [courseId])

  const coverPictureURL = undefined // TODO: ability to upload a picture, course.coverPictureURL

  const handleEditCourse = () => setEditCourseOpen(true)

  const handleEditCourseFinished = (course: Course) => {
    coursesService.updateCourse(course).then((c) => {
      setCourse(c)
      setEditCourseOpen(false)
    })
  }

  const handleLayoutUpdated = (layout: Layout) => {
    setImgError(false)
    if (course) {
      const layoutIndex = course.layouts.findIndex(l => l.id === layout.id)
      const layouts = [...course.layouts]
      layouts[layoutIndex] = layout
      course.layouts = layouts
      setCourse({...course, layouts: layouts})
    }
  }

  const editCourseButton = (
    <IconButton id="editCourseButton" className={classes.editCourseButton} onClick={handleEditCourse}>
      <EditIcon />
    </IconButton>
  )

  const editCourseModal = (
    <CancellableModal modalOpen={editCourseOpen} onClose={() => setEditCourseOpen(false)}>
      <EditCourse
        course={course}
        handleFinish={handleEditCourseFinished}
        handleCancel={() => setEditCourseOpen(false)}
      />
    </CancellableModal>
  )

  return (
    <div id="coursePage" className={classes.page}>
      {course ? (
        <div className={classes.imageContainer}>
          {(coverPictureURL && !imgError) ? (
            <img
              id="courseImage"
              className={classes.image}
              src={coverPictureURL}
              alt="Course map"
              onError={() => setImgError(true)}
            />
          ) : (
            <Button
              className={classes.mapPlaceholder}
              size="small"
              onClick={handleEditCourse}
            >
              Upload a picture
            </Button>
          )}
        </div>
      ) : (
        <Skeleton className={classes.imageContainer} variant="rect" />
      )}

      
      {course ? (
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Typography id="courseNameCity" className={classes.title} variant="h4">
            {course?.name}, {course?.city} {editCourseButton}
          </Typography>
        </Grid>
      ) : (
        <Skeleton variant="text" width={200} height={40} />
      )}
      
      {editCourseModal}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>All</TableCell>
            <TableCell>My</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Games played</TableCell>
            <TableCell>x</TableCell>
            <TableCell>x</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Latest game</TableCell>
            <TableCell>[x.x.x]</TableCell>
            <TableCell>[x.x.x]</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Average score</TableCell>
            <TableCell>x</TableCell>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <br />

      <Typography component="p">
        On this course:
        <Button disabled size="small">All games</Button>
        <Button disabled size="small">My games</Button>
      </Typography>

      <br />

      <Typography variant="h5">Layouts</Typography>

      <br />

      {course?.layouts.map(layout => (
        <LayoutPaper
          key={'layout-paper-' + layout.id}
          layout={layout}
          course={course}
          handleLayoutUpdated={handleLayoutUpdated}
        />
      ))}

      <Typography variant="h5">High scores</Typography>
      <Typography>
        [All scores] [My scores]
      </Typography>

      <Typography variant="h5">Scores per hole</Typography>

      <Typography variant="h5">Development of high scores</Typography>
    </div>
  )
}

export default Course
