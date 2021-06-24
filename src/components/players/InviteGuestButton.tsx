import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import { friendRequestExplanation } from '../../constants/Strings'

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  inviteButton: {
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  player: Player,
}

const InviteGuestButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { player } = props

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpen = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setDialogOpen(true)
  }

  const link = window.location.origin + '/#/register/' + player.id + '?name=' + player.firstName

  const dialogContent = (
    <DialogContent>
      <form className={classes.dialogContainer}>
        <Typography component="p" gutterBottom>Send {player.firstName} the following link to allow them sign up as your friend:</Typography>
        <Typography gutterBottom>
          <Link href={link}>{link}</Link>
        </Typography>
        <Typography gutterBottom>{friendRequestExplanation}</Typography>
      </form>
    </DialogContent>
  )

  const dialogActions = (
    <DialogActions>
      <Button onClick={() => setDialogOpen(false)} color="primary">
        Ok
      </Button>
    </DialogActions>
  )

  return (
    <div>
      <Button className={classes.inviteButton} variant="outlined" onClick={handleOpen}>Invite</Button>

      <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Invite {player.firstName} to use Disc Golf Stats!</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
    </div>
  )
}

export default InviteGuestButton
