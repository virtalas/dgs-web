import React, { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { sneakyGrey } from '../../constants/Colors'
import { useEffect } from 'react'
import { CancelTokenSource } from 'axios'
import baseService from '../../services/baseService'
import photosService from '../../services/photosService'
import { CourseSort } from '../../types/enums/CourseSort'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  // Centering image from: https://stackoverflow.com/a/18869078
  // Center image vertically inside imageContainer
  image: {
    maxHeight: '1000%',
    maxWidth: '100%',
    width: '100%',
    height: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  imageContainer: {
    height: 100,
    width: '100%',
    overflow: 'hidden',
    display: 'inline-block',
    position: 'relative',
  },
  mapPlaceholder: {
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '100%',
  },
  cardContent: {
  },
  gameCountText: {
    color: sneakyGrey,
  },
}))

interface Props {
  course: ListCourse,
  beingSortedBy: CourseSort,
}

const CourseListCard: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course, beingSortedBy } = props
  const [coverPictureURL, setCoverPictureUrl] = useState<string>()
  const [redirect, setRedirect] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const fetchThumbnailUrls = async () => {
      if (!course.photo) return
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      // TODO: Fetch only thumbnail photo.
      const urls = await photosService.getPhotoUrls([course.photo?.thumbnailKey], cancelTokenSourceRef.current)
      if (!urls || urls.length === 0) return
      setCoverPictureUrl(urls[0])
    }

    fetchThumbnailUrls()
    return () => cancelTokenSourceRef.current?.cancel()
  }, [course.photo])

  if (redirect) {
    return <Redirect push to={'/courses/view/' + course.id} />
  }

  const handleClick = () => setRedirect(true)

  const gameCountText = course.numberOfGames > 0 ?
    `You have played here ${course.numberOfGames} ${course.numberOfGames === 1 ? 'time' : 'times'}` :
    `You haven't played here yet`

  return (
    <Card className={classes.card}>
      <CardActionArea data-cy="courseCard" onClick={handleClick}>
        
        {course.photo ? (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              src={coverPictureURL}
              alt=""
            />
          </div>
        ) : null}

        <CardContent className={classes.cardContent}>
          <Typography variant="h5">
            {beingSortedBy === CourseSort.byCity ? `${course.city}, ${course.name}` : `${course.name}, ${course.city}`}
          </Typography>

          <Typography variant="subtitle2" className={classes.gameCountText}>
            {gameCountText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default CourseListCard
