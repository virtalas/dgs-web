import React, { useState } from 'react'

import TextField from '@material-ui/core/TextField'

const NewCourse: React.FC<{}> = () => {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')

  return (
    <div>
      <h2>New Course</h2>

      <TextField
        label="Course name"
        value={name}
      />
      <br />
      
      <TextField
        label="City"
        value={city}
      />
    </div>
  )
}

export default NewCourse
