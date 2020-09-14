import React from 'react'
import { NavLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { gameInputBlue } from './GameInput'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: 0,
    color: 'white',
  },
  par: {
    margin: 'auto',
  },
  appBar: {
    background: gameInputBlue,
  },
  navLink: {
    textDecoration: 'none',
    color: 'black',
  },
  deleteGame: {
    color: 'red',
  }
}))

interface Props {
  showInfo: boolean,
  holeNum: number,
  par: number,
}

const HoleInfoBar: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { showInfo, holeNum, par } = props
  const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null)

  const handleClick = (event: MouseEvent): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            {showInfo ? 'Hole ' + holeNum : null}
          </Typography>
          <Typography variant="h6" color="inherit" className={classes.par}>
            {showInfo ? 'Par ' + par : null}
          </Typography>
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick as any}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl as any} open={Boolean(anchorEl)} onClose={handleClose}>
            <NavLink to="/" className={classes.navLink}>
              <MenuItem onClick={handleClose}>Home page</MenuItem>
            </NavLink>
            <MenuItem onClick={handleClose} className={classes.deleteGame}>Delete game</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default HoleInfoBar
