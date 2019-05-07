import React from 'react'
import { makeStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles((theme) => ({
  root: {
  },
  menuButton: {
    marginRight: 0,
    color: 'white',
  },
  par: {
    margin: 'auto'
  },
}))

interface Props {}

const HoleInfoBar: React.FC<Props> = (props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null)

  const handleClick = (event: MouseEvent): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Hole X
          </Typography>
          <Typography variant="h6" color="inherit" className={classes.par}>
            Par X
          </Typography>
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick as any}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Menu id="simple-menu" anchorEl={anchorEl as any} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default HoleInfoBar