import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {
  Grid,
  IconButton,
  // Table,
  // TableCell,
  // TableHead,
  // TableRow,
  // TableBody
} from '@material-ui/core'

import coursesService from '../../services/coursesService'
import LayoutPaper from './LayoutPaper'
import EditCourse from './EditCourse'
import CancellableModal from '../CancellableModal'
import baseService from '../../services/baseService'
import weatherService from '../../services/weatherService'
import { coverPhotoMaxHeight } from './CoursePhotoButton'
import { coverPhotoMaxWidth } from './CoursePhotoButton'
import { courseThumbnailMaxHeight } from './CoursePhotoButton'
import { pageMaxWidth } from '../BasePage'
import LoadingView from '../LoadingView'
import GamePhotos from '../gameCard/GamePhotos'
import ErrorView from '../ErrorView'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: pageMaxWidth,
    margin: theme.spacing(1),
    paddingBottom: theme.spacing(12),
    [theme.breakpoints.up('md')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  image: {
    width: coverPhotoMaxWidth,
    maxWidth: '100%',
    maxHeight: coverPhotoMaxHeight,
    borderRadius: 5,
    borderCollapse: 'separate',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    backgroundColor: 'lightgrey',
    width: '100%',
    height: courseThumbnailMaxHeight,
  },
  weatherContainer: {
    marginLeft: theme.spacing(1),
    width: 130,
    height: 40,
  },
  weatherFlexbox: {
    display: 'flex',
    alignItems: 'center',
  },
  weatherImage: {
    width: 50,
    height: 50,
  },
  temperature: {
    verticalAlign: 'center',
  },
  title: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  editCourseButton: {
    marginLeft: theme.spacing(1),
  },
  sectionTitle: {
    marginLeft: theme.spacing(2),
  },
  gamesButton: {
    margin: theme.spacing(2),
  },
  thumbnailContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'flex-start',
  },
  thumbnail: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

interface Props {
  match: any,
}

// TODO: Use ghosting after opening Accordion and fetching data
// TODO(?): Use accordion, because more than 2 layouts already makes scrolling tedious for high scores etc.

const Course: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { match } = props
  const courseId = match.params.id

  const [course, setCourse] = useState<DetailedCourse>()
  const [editCourseOpen, setEditCourseOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [localWeather, setLocalWeather] = useState<LocalWeather>()
  const [coursesRedirect, setCoursesRedirect] = useState(false)
  const [gamesRedirect, setGamesRedirect] = useState(false)
  const [isError, setIsError] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  const fetchLocalWeather = useCallback((forCourse: DetailedCourse) => {
    if (!forCourse.lat || !forCourse.lon) return
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    weatherService.getLocalWeather(courseId, cancelTokenSourceRef.current)
      .then(lw => setLocalWeather(lw))
  }, [courseId])

  useEffect(() => {
    setIsError(false)
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.getCourse(courseId, cancelTokenSourceRef.current)
      .then(fetchedCourse => {
        setCourse(fetchedCourse)
        fetchLocalWeather(fetchedCourse)
      })
      .catch(() => setIsError(true))

    return () => cancelTokenSourceRef.current?.cancel()
  }, [courseId, fetchLocalWeather])

  if (coursesRedirect) {
    return <Redirect to={'/courses'} />
  }

  if (gamesRedirect) {
    if (course) {
      return <Redirect push to={'/games/search?course_id=' + course.id} />
    }
  }

  const coverPictureURL = course?.photo?.url

  const handleEditCourse = () => setEditCourseOpen(true)

  const handleEditCourseFinished = async (course: Course) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    const updatedCourse = await coursesService.updateCourse(course, cancelTokenSourceRef.current)
    setCourse(updatedCourse)
    setEditCourseOpen(false)
    fetchLocalWeather(updatedCourse)
  }

  const handleLayoutUpdated = (layout: DetailedLayout) => {
    setImgError(false)
    if (course) {
      const layoutIndex = course.layouts.findIndex(l => l.id === layout.id)
      const layouts = [...course.layouts]
      layouts[layoutIndex] = layout
      course.layouts = layouts
      setCourse({...course, layouts: layouts})
    }
  }

  const handleDeleteCourse = () => {
    if (!window.confirm('Delete this course? All layouts and games on this course will be deleted as well.')) {
      return
    }

    if (course) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      coursesService.deleteCourse(course, cancelTokenSourceRef.current).then(() => setCoursesRedirect(true))
    }
  }

  const handleLayoutDeleted = (layout: Layout) => {
    if (course) {
      const updatedLayouts = course?.layouts.filter(l => l.id !== layout.id)
      setCourse({...course, layouts: updatedLayouts})
    }
  }

  const editCourseButton = course?.allowedToEdit ? (
    <IconButton id="editCourseButton" className={classes.editCourseButton} onClick={handleEditCourse}>
      <EditIcon />
    </IconButton>
  ) : null

  const editCourseModal = course?.allowedToEdit ? (
    <CancellableModal modalOpen={editCourseOpen} onClose={() => setEditCourseOpen(false)}>
      <EditCourse
        course={course}
        handleFinish={handleEditCourseFinished}
        handleCancel={() => setEditCourseOpen(false)}
        handleDelete={handleDeleteCourse}
      />
    </CancellableModal>
  ) : null

  const addPhotoButton = course?.allowedToEdit ? (
    <Button
      className={classes.photoPlaceholder}
      size="small"
      onClick={handleEditCourse}
    >
      Upload a picture
    </Button>
  ) : null

  const imageContainer = course ? (
    <div>
      {(course.photo && !imgError) ? (
        <img
          id="courseImage"
          className={classes.image}
          src={coverPictureURL}
          alt="Course map"
          onError={() => setImgError(true)}
        />
      ) : addPhotoButton}
    </div>
  ) : null

  const courseTitleRow = course ? (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Typography id="courseNameCity" className={classes.title} variant="h4">
        {course?.name}, {course?.city} {editCourseButton}
      </Typography>
    </Grid>
  ) : null

  const weatherIcon = (course && course.lat && course.lon) ? (
    <div className={classes.weatherContainer}>
      {localWeather ? (
        <div className={classes.weatherFlexbox}>
          <img
            className={classes.weatherImage}
            src={`https://openweathermap.org/img/wn/${localWeather.iconId}@2x.png`}
            alt="Current weather on the course"
          />

          <Typography className={classes.temperature} variant="caption">
            {localWeather.temperature} °C
          </Typography>
        </div>
      ) : null}
    </div>
  ) : null

  // const statsTable = (
  //   <Table size="small">
  //     <TableHead>
  //       <TableRow>
  //         <TableCell></TableCell>
  //         <TableCell>Me</TableCell>
  //         <TableCell>All</TableCell>
  //       </TableRow>
  //     </TableHead>
  //     <TableBody>
  //       <TableRow>
  //         <TableCell>Games played</TableCell>
  //         <TableCell>{course?.numberOfGames}</TableCell>
  //         <TableCell>x</TableCell>
  //       </TableRow>
  //       <TableRow>
  //         <TableCell>Latest game</TableCell>
  //         <TableCell>[x.x.x]</TableCell>
  //         <TableCell>[x.x.x]</TableCell>
  //       </TableRow>
  //       <TableRow>
  //         <TableCell>Average score</TableCell>
  //         <TableCell>x</TableCell>
  //         <TableCell>x</TableCell>
  //       </TableRow>
  //     </TableBody>
  //   </Table>
  // )

  const activeLayouts = course?.layouts.filter(layout => layout.active)
  const inactiveLayouts = course?.layouts.filter(layout => !layout.active)

  const coursePhotos = course && course.photos && (
    <GamePhotos
      photos={course.photos}
      setPhotos={(photos) => {
        course.photos = photos
        setCourse({...course})
      }}
      isEditing={false}
    />
  )

  if (!course) {
    return (
      <div id="coursePage" className={classes.page}>
        {isError ? (
          <ErrorView />
        ) : (
          <LoadingView />
        )}
      </div>
    )
  }

  return (
    <div id="coursePage" className={classes.page}>
      {imageContainer}
      
      {courseTitleRow}

      {weatherIcon}
      
      {editCourseModal}

      {/* TODO: */}
      {/* {statsTable} */}

      <Button className={classes.gamesButton} variant="outlined" onClick={() => setGamesRedirect(true)}>
        Show games
      </Button>

      <br />

      {activeLayouts && activeLayouts.length > 0 ? (
        <div>
          <br />
          <Typography className={classes.sectionTitle} variant="h5">Active layouts</Typography>
          <br />
        </div>
      ) : null}

      {activeLayouts?.map(layout => (
        <LayoutPaper
          key={'layout-paper-' + layout.id}
          layout={layout}
          course={course}
          handleLayoutUpdated={handleLayoutUpdated}
          handleLayoutDeleted={handleLayoutDeleted}
        />
      ))}

      {inactiveLayouts && inactiveLayouts.length > 0 && (
        <div>
          <br />
          <Typography className={classes.sectionTitle} variant="h5">Inactive layouts</Typography>
          <br />
        </div>
      )}

      {inactiveLayouts?.map(layout => (
        <LayoutPaper
          key={'layout-paper-' + layout.id}
          layout={layout}
          course={course}
          handleLayoutUpdated={handleLayoutUpdated}
          handleLayoutDeleted={handleLayoutDeleted}
        />
      ))}

      {course.photos.length > 0 && (
        <div>
          <br />
          <Typography className={classes.sectionTitle} variant="h5">Course photos</Typography>
          <br />
        </div>
      )}

      {coursePhotos}

      {/* TODO: */}
      {/* <Typography className={classes.sectionTitle} variant="h5">High scores</Typography>
      <Typography>[All scores] [My scores]</Typography> */}

      {/* TODO: */}
      {/* <Typography className={classes.sectionTitle} variant="h5">Development of high scores</Typography> */}
    </div>
  )
}

export default Course
