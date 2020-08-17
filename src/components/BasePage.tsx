import React from 'react'
import { Route, NavLink, withRouter } from 'react-router-dom'
import { LocationDescriptor } from 'history'

import CssBaseline from '@material-ui/core/CssBaseline'
import Fab from '@material-ui/core/Fab'
import { makeStyles } from '@material-ui/styles'

import AddIcon from '@material-ui/icons/Add'

import AppBar from './AppBar'
import Games from './Games'
import NewGame from './newGame/NewGame'
import Players from './players/Players'
import Courses from './courses/Courses'
import Graphs from './graphs/Graphs'
import Competitions from './competitions/Competitions'
import Info from './info/Info'

import { appBarHeight } from './AppBar'

export const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    marginTop: appBarHeight,
    flexGrow: 1,
  },
  navLink: {
    textDecoration: 'none',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
    zIndex: 2,
  },
}))

interface Props {
  location: Location
}

const BasePage: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { location } = props

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
      // TODO: Enable new player (login user) creation.
    // case '/players':
    //   newButtonPath = '/players/new'
    //   newButtonColor = 'secondary'
    default:
      shouldRenderNewButton = false
      break
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
        <div className="content">
          <Route exact path="/" component={Games} />
          <Route exact path="/games" component={Games} />
          <Route exact path="/games/new" component={NewGame} />
          <Route path="/players" component={Players} />
          <Route path="/courses" component={Courses} />
          <Route path="/graphs" component={Graphs} />
          <Route path="/competitions" component={Competitions} />
          <Route path="/info" component={Info} />

          {shouldRenderNewButton ? (
            <NavLink to={newButtonPath} className={classes.navLink} id="newButton">
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

export { BasePage } // Used for testing.
// The component needs to be exported with withRouter() to access props.location:
export default withRouter(BasePage as any)
