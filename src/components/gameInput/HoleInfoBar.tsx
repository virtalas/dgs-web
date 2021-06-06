import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { dirtyBlue } from '../../constants/Colors'
import gamesService from '../../services/gamesService'
import baseService from '../../services/baseService'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: 0,
    color: 'white',
  },
  par: {
    margin: 'auto',
  },
  appBar: {
    background: dirtyBlue,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '25%',
      paddingRight: '25%',
    },
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
  game: Game,
}

const HoleInfoBar: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { showInfo, holeNum, par, game } = props

  const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null)
  const [redirect, setRedirect] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  if (redirect) {
    return <Redirect push to={'/games'} />
  }

  const handleClick = (event: MouseEvent): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteGame = () => {
    if (!window.confirm('Delete game?')) {
      return
    }

    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    gamesService.deleteGame(game, cancelTokenSourceRef.current).then(() => setRedirect(true))
  }

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography id="infoBarHoleNumber" variant="h6" color="inherit">
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
            <MenuItem onClick={handleDeleteGame} className={classes.deleteGame}>Delete game</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default HoleInfoBar
