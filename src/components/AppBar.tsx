import React, { useState } from 'react'

import AppBar from '@material-ui/core/AppBar'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import NavigationDrawer from './NavigationDrawer'
import { drawerWidth } from './BasePage'
import { grassGreen } from '../constants/Colors'
import NotificationsButton from './NotificationsButton'

export const appBarHeight = 64

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginLeft: drawerWidth,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: grassGreen,
    background: grassGreen,
    height: appBarHeight,
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  notificationsButton: {
    marginRight: 0,
  },
}))

const AppTopBar: React.FC = () => {
  const classes = useStyles()

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Disc Golf Stats
          </Typography>

          <div className={classes.notificationsButton}>
            <NotificationsButton />
          </div>
        </Toolbar>
      </AppBar>
      <NavigationDrawer mobileOpen={mobileOpen} handleDrawerToggle={() => setMobileOpen(!mobileOpen)} />
    </div>
  )
}

export default AppTopBar
