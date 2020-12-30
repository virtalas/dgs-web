import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import CourseSelect from '../newGame/CourseSelect'

const NewSelection: React.FC<{}> = () => {
  const [course, setCourse] = useState<Course>(
    { id: '', name: 'Loading...', city: '', pars: [], total: 0, layouts: [], popularity: 0 }
  )

  return (
    <div>
      <h2>New course</h2>

      <p>
        Layouts can then be added to the course.
      </p>

      <NavLink to="/courses/new/course">
        <Button>New Course</Button>
      </NavLink>

      <h2>New layout for a course</h2>
      
      <p>
        Add a new layout to a course.
      </p>

      <CourseSelect
        formControlStyle=""
        course={course}
        setCourse={setCourse}
      />
      <br />
      
      <NavLink to={'/courses/new/layout/' + course.id}>
        <Button>New Layout</Button>
      </NavLink>
    </div>
  )
}

export default NewSelection
