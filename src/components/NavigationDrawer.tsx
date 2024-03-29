import React from 'react'
import { NavLink } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'

import GroupIcon from '@material-ui/icons/Group'
import PlaceIcon from '@material-ui/icons/Place'
// import InsertChartIcon from '@material-ui/icons/InsertChart'
// import InfoIcon from '@material-ui/icons/Info'
// import BallotIcon from '@material-ui/icons/Ballot'
import ExitToApp from '@material-ui/icons/ExitToApp'
import DiscGolfBasket from './DiscGolfBasket'

import { drawerWidth } from './BasePage'

import { useAuth } from "../context/AuthContext"
import { coursesScrollPositionItem } from './courses/Courses'

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  navLink: {
    textDecoration: 'none',
    color: 'black',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    paddingLeft: 'env(safe-area-inset-left)',
  },
}))

interface Props {
  mobileOpen: boolean,
  handleDrawerToggle: () => void,
}

const NavigationDrawer: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { mobileOpen, handleDrawerToggle } = props
  const { handleLogout } = useAuth()

  const loggedOut = () => {
    if (handleLogout) handleLogout()
  }

  const handleCoursesClick = () => {
    sessionStorage.removeItem(coursesScrollPositionItem)
  }

  const navButtonList = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <NavLink to="/games" className={classes.navLink}>
          <ListItem button>
            <ListItemIcon><DiscGolfBasket /></ListItemIcon>
            <ListItemText primary="Games" />
          </ListItem>
        </NavLink>
        <NavLink to="/players" className={classes.navLink}>
          <ListItem button>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="Friends" />
          </ListItem>
        </NavLink>
        <NavLink to="/courses" className={classes.navLink} onClick={handleCoursesClick}>
          <ListItem button>
            <ListItemIcon><PlaceIcon /></ListItemIcon>
            <ListItemText primary="Courses" />
          </ListItem>
        </NavLink>
      </List>

      {/* TODO: */}
      {/* <Divider />
      <List>
        <NavLink to="/graphs" className={classes.navLink}>
          <ListItem button disabled>
            <ListItemIcon><InsertChartIcon /></ListItemIcon>
            <ListItemText primary="Graphs" />
          </ListItem>
        </NavLink>
        <NavLink to="/competitions" className={classes.navLink}>
          <ListItem button disabled>
            <ListItemIcon><BallotIcon /></ListItemIcon>
            <ListItemText primary="Competitions" />
          </ListItem>
        </NavLink>
        <NavLink to="/info" className={classes.navLink}>
          <ListItem button disabled>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="Info" />
          </ListItem>
        </NavLink>
      </List> */}

      <Divider />

      <List>
        <ListItem button onClick={loggedOut}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <nav className={classes.drawer}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div onClick={handleDrawerToggle}>
            {navButtonList}
          </div>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {navButtonList}
        </Drawer>
      </Hidden>
    </nav>
  )
}

export default NavigationDrawer
