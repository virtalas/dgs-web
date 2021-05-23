import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Card, CardContent, CardActionArea } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  image: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '100%',
  },
}))

interface Props {
  course: Course,
}

const CourseCard: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course } = props
  const coverPictureURL = course.layouts.find(layout => layout.active)?.mapURL
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
              alt="Course map"
            />
          </div>
        ) : null}

        <CardContent>
          <Typography variant="h5">
            {course.name}, {course.city}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default CourseCard
