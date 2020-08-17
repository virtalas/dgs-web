import React, { useState } from 'react'

import AppBar from '@material-ui/core/AppBar'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import NavigationDrawer from './NavigationDrawer'
import { drawerWidth } from './BasePage'

export const appBarHeight = 64

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginLeft: drawerWidth,
    zIndex: theme.zIndex.drawer + 1,
    background: '#5cb85c',
    height: appBarHeight,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

const AppTopBar: React.FC = () => {
  const classes = useStyles()

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            Disc Golf Stats
          </Typography>
        </Toolbar>
      </AppBar>
      <NavigationDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
    </div>
  )
}

export default AppTopBar
