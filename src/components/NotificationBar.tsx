import React from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

interface Props {
  open: boolean,
  severity: 'error' | 'warning' | 'info' | 'success',
  msg: string,
  onClose: () => void,
}

const NotificationBar: React.FC<Props> = (props) => {
  const { open, severity, msg, onClose } = props

  if (open) {
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
        <Alert onClose={onClose} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    )
  }

  return null
}

export default NotificationBar
