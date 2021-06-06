import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import CourseSelect from '../newGame/CourseSelect'

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(2),
  },
  navLink: {
    textDecoration: 'none',
  },
  paragraph: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

// TODO: Button next to 'New layout': 'Add as you play'

const NewSelection: React.FC<{}> = () => {
  const classes = useStyles()

  const [course, setCourse] = useState<Course>(
    { id: '', name: 'No courses', city: '', lat: undefined, lon: undefined, numberOfGames: 0 }
  )

  const newLayoutButtonDisabled = course.id.length === 0

  const newLayoutButton = (
    <Button id="newLayoutButton" variant="contained" color="primary" disabled={newLayoutButtonDisabled}>
      New Layout
    </Button>
  )

  return (
    <div className={classes.page}>
      <Typography className={classes.paragraph} variant="h5">
        New course
      </Typography>

      <Typography className={classes.paragraph}>
        Create a course and add layouts to it.
      </Typography>

      <NavLink className={classes.navLink} to="/courses/new/course">
        <Button id="newCourseButton" variant="contained" color="primary">New Course</Button>
      </NavLink>

      <br />
      <br />

      <Typography className={classes.paragraph} variant="h5">
        New layout for a course
      </Typography>
      
      <Typography className={classes.paragraph}>
        Add a new layout to a course.
      </Typography>

      <CourseSelect
        onCourseChange={setCourse}
      />

      <br />
      
      {newLayoutButtonDisabled ? newLayoutButton : (
        <NavLink className={classes.navLink} to={'/courses/new/layout/' + course.id}>
          {newLayoutButton}
        </NavLink>
      )}
    </div>
  )
}

export default NewSelection
