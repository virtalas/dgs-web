import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

import Modal from '@material-ui/core/Modal/Modal'

const useStyles = makeStyles((theme) => ({
  modal: {
    alignItems: 'center',
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    maxHeight: '75%',
    position: 'absolute',
    top: '12%', // Half of the remaining space from (100 - maxHeight)%, thus centering element.
    width: '100%',
    overflow: 'scroll',
    display: 'block',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}))

interface Props {
  modalOpen: boolean,
  onClose: () => void,
}

const CancellableModal: React.FC<Props> = (props) => {
  const { modalOpen, onClose } = props
  
  const classes = useStyles()

  return (
    <Modal
      className={classes.modal}
      open={modalOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalOpen}>
        <div className={classes.container}>
          {props.children}
        </div>
      </Fade>
    </Modal>
  )
}

export default CancellableModal
