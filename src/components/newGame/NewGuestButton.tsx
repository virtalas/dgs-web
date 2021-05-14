import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

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
  setPlayers: (players: Player[]) => void,
  players: Player[],
  setAllPlayers: (players: Player[]) => void,
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
    const inputtedName = event.target.value as string
    setGuestName(inputtedName)
    // Check for availability (no identical names allowed):
    playersService.playerNameAvailable(inputtedName).then((available: boolean) => {
      // Also check locally (newly added guests):
      setGuestNameError(allPlayers.filter(player => player.firstName === inputtedName).length > 0 || !available)
    })
  }

  const handleAddGuest = () => {
    setDialogOpen(false)
    const newGuest = {
      id: 'temp-id-' + guestName, // Unique ID needed for updating the selection list.
      firstName: guestName,
      lastName: '',
      friendStatus: undefined,
      guest: true,
      admin: false,
    }
    setPlayers([...players, newGuest])
    setAllPlayers([...allPlayers, newGuest])
  }

  // TODO: On mobile, popup size changes when error appears. Fix width?
  const dialogContent = (
    <DialogContent>
      <form className={classes.dialogContainer}>
        <TextField
          id="standard-basic"
          label="Name"
          error={guestNameError}
          value={guestName}
          helperText={guestNameError ?
            'There already exists a player with this name' : 'Check for existing guests first'}
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
