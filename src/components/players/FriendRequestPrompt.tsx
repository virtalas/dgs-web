import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CancelTokenSource } from 'axios'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import playersService from '../../services/playersService'
import { friendRequestExplanation } from '../../constants/Strings'
import baseService from '../../services/baseService'

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}))

interface Props {
  player: Player
}

const FriendRequestPrompt: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { player } = props

  const [dialogOpen, setDialogOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  const handleOpen = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setDialogOpen(true)
  }

  const handleSendRequest = () => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    playersService.sendFriendRequest(player.id, cancelTokenSourceRef.current)
      .then(() => setSent(true))
      .catch(() => setError(true))
  }

  let dialogContentText = ''
  if (sent) {
    dialogContentText = player.firstName + ' will be notified!'
  } else if (error) {
    dialogContentText = 'Failed to send the friend request.'
  } else {
    dialogContentText = friendRequestExplanation
  }

  const dialogContent = (
    <DialogContent>
      <form className={classes.dialogContainer}>
        <Typography>{dialogContentText}</Typography>
      </form>
    </DialogContent>
  )

  const dialogActions = (
    <DialogActions>
      {(sent || error) ? (
        <Button onClick={() => setDialogOpen(false)} color="primary">
          Ok
        </Button>
      ) : (
        <div>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendRequest} color="primary">
            Send
          </Button>
        </div>
      )}
    </DialogActions>
  )

  let dialogTitleText = ''
  if (sent) {
    dialogTitleText = 'Request sent!'
  } else if (error) {
    dialogTitleText = 'Error'
  } else {
    dialogTitleText = `Send a friend request to ${player.firstName} ${player.lastName}?`
  }

  return (
    <div>      
      <Link href="" onClick={handleOpen}>
        {player.firstName}
      </Link>

      <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogTitleText}</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
    </div>
  )
}

export default FriendRequestPrompt
