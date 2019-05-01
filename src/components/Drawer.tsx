import React, { useState } from 'react'
import { Route, NavLink, withRouter } from 'react-router-dom'
import { LocationDescriptor } from 'history'

import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import { makeStyles } from '@material-ui/styles'

import AddIcon from '@material-ui/icons/Add'
import GroupIcon from '@material-ui/icons/Group'
import PlaceIcon from '@material-ui/icons/Place'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import InfoIcon from '@material-ui/icons/Info'
import BallotIcon from '@material-ui/icons/Ballot'
import DiscGolfBasket from './DiscGolfBasket'

import Games from './games/Games'
import Players from './players/Players'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    zIndex: theme.zIndex.drawer + 1,
    background: '#5cb85c',
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
  },
  navLink: {
    textDecoration: 'none',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
}))

// TODO: how to do this correctly
interface Props {
  theme: any,
  location: any
}

const ResponsiveDrawer: React.FC<Props> = (props) => {
  const classes = useStyles()

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    // this.setState(state => ({ mobileOpen: !state.mobileOpen }))
    setMobileOpen(!mobileOpen)
  }

  const { theme, location } = props

  const navButtonList = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
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
            <ListItemText primary="Players" />
          </ListItem>
        </NavLink>
        <NavLink to="/courses" className={classes.navLink}>
          <ListItem button>
            <ListItemIcon><PlaceIcon /></ListItemIcon>
            <ListItemText primary="Courses" />
          </ListItem>
        </NavLink>
      </List>
      <Divider />
      <List>
        <NavLink to="/graphs" className={classes.navLink}>
          <ListItem button>
            <ListItemIcon><InsertChartIcon /></ListItemIcon>
            <ListItemText primary="Graphs" />
          </ListItem>
        </NavLink>
        <NavLink to="/competitions" className={classes.navLink}>
          <ListItem button>
            <ListItemIcon><BallotIcon /></ListItemIcon>
            <ListItemText primary="Competitions" />
          </ListItem>
        </NavLink>
        <NavLink to="/info" className={classes.navLink}>
          <ListItem button>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="Info" />
          </ListItem>
        </NavLink>
      </List>
    </div>
  )

  const appBar = (
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
  )

  const navDrawer = (
    <nav className={classes.drawer}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {navButtonList}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {navButtonList}
        </Drawer>
      </Hidden>
    </nav>
  )

  let shouldRenderNewButton = true
  let newButtonPath: LocationDescriptor = '/'
  let newButtonColor = undefined
  switch (location.pathname) {
    case '/':
    case '/games':
      newButtonPath = '/games/new'
      newButtonColor = 'primary'
      break
    case '/courses':
      newButtonPath = '/courses/new'
      newButtonColor = 'secondary'
      break
    default:
      shouldRenderNewButton = false
      break
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      {appBar}
      {navDrawer}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className="content">
          <Route exact path="/" component={Games}/>
          <Route path="/games" component={Games}/>
          <Route path="/players" component={Players}/>

          {shouldRenderNewButton ? (
            <NavLink to={newButtonPath} className={classes.navLink}>
              {/* Usage of 'any': https://material-ui.com/guides/typescript/#usage-of-component-property */}
              <Fab color={newButtonColor as any} aria-label="Add" className={classes.fab}>
                <AddIcon />
              </Fab>
            </NavLink>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export { ResponsiveDrawer } // Used for testing.
// The component needs to be exported with withRouter() to access props.location:
export default withRouter(ResponsiveDrawer as any)
