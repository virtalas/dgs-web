import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { sneakyGrey } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  // Centering image from: https://stackoverflow.com/a/18869078
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
}

const CourseListCard: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course } = props
  const coverPictureURL = course.photo?.thumbnailUrl
  const [redirect, setRedirect] = useState(false)

  if (redirect) {
    return <Redirect push to={'/courses/view/' + course.id} />
  }

  const handleClick = () => setRedirect(true)

  return (
    <Card className={classes.card}>
      <CardActionArea data-cy="courseCard" onClick={handleClick}>
        
        {coverPictureURL ? (
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
            {course.name}, {course.city}
          </Typography>

          <Typography variant="subtitle2" className={classes.gameCountText}>
            You played here {course.numberOfGames} {course.numberOfGames === 1 ? 'time' : 'times'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default CourseListCard
