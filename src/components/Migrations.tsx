import Button from '@material-ui/core/Button/Button'
import React from 'react'
import baseService from '../services/baseService'

const Migrations: React.FC<{}> = () => {
  const runMigrations = () => {
    baseService.runMigrations()
      .then(() => window.alert('DONE'))
      .catch((e) => window.alert('ERROR: ' + e))
  }

  return (
    <div style={{margin: 50}}>
      <Button onClick={runMigrations}>Run migrations</Button>
      <br />
      <br />
      Do not press unless you know what you're doing.
    </div>
  )
}

export default Migrations
