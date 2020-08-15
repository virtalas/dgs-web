import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'

import playersService from '../../services/playersService'

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}))

interface Props {
  setPlayers: any,
  players: Player[],
  setAllPlayers: any,
  allPlayers: Player[],
}

const NewGuestButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { setPlayers, players, setAllPlayers, allPlayers } = props

  const [dialogOpen, setDialogOpen] = useState(false)
  const [guestNameError, setGuestNameError] = useState(false)
  const [guestName, setGuestName] = useState('')

  const handleOpen = () => {
    setGuestName('')
    setDialogOpen(true)
  }

  const handleGuestNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGuestName(event.target.value as string)
    // Check for availability (no identical names allowed)
    playersService.playerNameAvailable(event.target.value as string).then((available: boolean) => {
      setGuestNameError(!available)
    })
  }

  const handleAddGuest = () => {
    setDialogOpen(false)
    // Add guest to players with empty ID. Backend should then later create the player when creating the game.
    const newGuest = {
      id: 'temp-id-' + guestName, // Unique ID needed for updating the selection list.
      firstName: guestName,
      guest: true,
    }
    setPlayers([...players, newGuest])
    setAllPlayers([...allPlayers, newGuest])
  }

  const dialogContent = (
    <DialogContent>
      <form className={classes.dialogContainer}>
        <TextField
          id="standard-basic"
          label="Name"
          error={guestNameError}
          value={guestName}
          helperText={guestNameError ?
            'There already exists a guest with this name' : 'Check for existing guests first'}
          onChange={handleGuestNameChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
      </form>
    </DialogContent>
  )

  const dialogActions = (
    <DialogActions>
      <Button onClick={() => setDialogOpen(false)} color="primary">
        Cancel
      </Button>
      <Button onClick={handleAddGuest} color="primary" disabled={guestNameError}>
        Ok
      </Button>
    </DialogActions>
  )

  return (
    <div>
      <Button onClick={handleOpen}>New guest</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New guest</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
    </div>
  )
}

export default NewGuestButton
