import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Card, CardContent, CardActionArea } from '@material-ui/core'

import { sneakyGrey } from '../../constants/Colors'
import { Redirect } from 'react-router-dom'

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
    // Center mapPlaceholderText vertically:
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  mapPlaceholderText: {
    color: sneakyGrey,
  },
}))

interface Props {
  course: Course,
}

// TODO: Picture: Use course.picture (IRL pic uploaded to server), or if it's empty, use the mapURL from the active layout.

const CourseCard: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course } = props
  const coverPictureURL = course.layouts.filter(layout => layout.active)[0].mapURL
  const [redirect, setRedirect] = useState(false)

  if (redirect) {
    return <Redirect to={'/courses/view/' + course.id} />
  }

  const handleClick = () => setRedirect(true)

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleClick}>
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={coverPictureURL}
            alt="Course map"
          />
        </div>

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
