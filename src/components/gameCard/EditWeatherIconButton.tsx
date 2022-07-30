import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ListItemIcon } from '@material-ui/core'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: 'center',
  },
  listRowButton: {
    height: 50,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  weatherImage: {
    width: 50,
    height: 50,
  },
  button: {
    height: 50,
    marginLeft: 10,
  },
}))

interface Props {
  chosenIconId: string | undefined,
  onIconChosen: (icon: WeatherIcon | undefined) => void,
}

const EditWeatherIconButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { chosenIconId, onIconChosen } = props

  const [dialogOpen, setDialogOpen] = useState(false)

  // TODO: move to backend?
  const icons = [
    {id: '01d', name: 'clear sky (day)'},
    {id: '01n', name: 'clear sky (night)'},
    {id: '02d', name: 'few clouds (day)'},
    {id: '02n', name: 'few clouds (night)'},
    {id: '03d', name: 'scattered clouds'},
    {id: '04d', name: 'broken clouds'},
    {id: '09d', name: 'shower rain'},
    {id: '10d', name: 'rain (day)'},
    {id: '10n', name: 'rain (night)'},
    {id: '11d', name: 'thunderstorm'},
    {id: '13d', name: 'snow'},
    {id: '50d', name: 'mist'},
  ]

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleIconChosen = (icon: WeatherIcon | undefined) => {
    setDialogOpen(false)
    onIconChosen(icon)
  }

  const tagList = icons.length > 0 ? (
    <List
      component="nav"
    >
      {icons.map(icon => (
        <ListItem key={icon.id}>
          <Button
            className={classes.listRowButton}
            onClick={() => handleIconChosen(icon)}
          >
            <ListItemIcon>
              <img
                className={classes.weatherImage}
                src={`https://openweathermap.org/img/wn/${icon.id}.png`}
                alt="Current weather on the course"
              />
            </ListItemIcon>

            {icon.name}
          </Button>
        </ListItem>
      ))}
    </List>
  ) : null

  const dialogContent = (
    <DialogContent>
      {tagList}
    </DialogContent>
  )

  const dialogActions = (
    <DialogActions>
      <Button onClick={() => setDialogOpen(false)} color="primary">
        Cancel
      </Button>
      {chosenIconId ? (
        <Button
          variant="text"
          color="secondary"
          onClick={() => handleIconChosen(undefined)}
        >
          Remove
        </Button>
      ) : null}
    </DialogActions>
  )

  return (
    <div>
      <Button
        className={classes.button}
        size="small"
        onClick={handleOpen}
      >
        {chosenIconId ? (
          <img
            className={classes.weatherImage}
            src={`https://openweathermap.org/img/wn/${chosenIconId}.png`}
            alt="Weather icon"
          />
        ) : (
          "Weather icon"
        )}
      </Button>

      <Dialog disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className={classes.dialogTitle}>Choose weather icon</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
    </div>
  )
}

export default EditWeatherIconButton
