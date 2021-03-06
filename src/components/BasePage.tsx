import React, { useState } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { LocationDescriptor } from 'history'

import CssBaseline from '@material-ui/core/CssBaseline'
import Fab from '@material-ui/core/Fab'
import { makeStyles } from '@material-ui/core/styles'

import AddIcon from '@material-ui/icons/Add'

import PrivateRoute from '../PrivateRoute'
import AppBar from './AppBar'
import Games from './games/Games'
import NewGame from './newGame/NewGame'
import Players from './players/Players'
import Courses from './courses/Courses'
import Course from './courses/Course'
import NewSelection from './courses/NewSelection'
import NewCourse from './courses/NewCourse'
import NewLayout from './courses/NewLayout'
import Graphs from './graphs/Graphs'
import Competitions from './competitions/Competitions'
import Info from './info/Info'

import { appBarHeight } from './AppBar'

export const drawerWidth = 240
export const pageMaxWidth = 610

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    marginTop: appBarHeight,
    width: '100%',
    flexGrow: 1,
  },
  navLink: {
    textDecoration: 'none',
  },
  gamesFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 11,
  },
  coursesFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 2,
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },
}))

interface Props {
  location: Location
}

const BasePage: React.FC<Props> = (props) => {
  const classes = useStyles()

  const [editingGameCount, setEditingGameCount] = useState(0)
  const { location } = props

  const onEditGameToggle = (isEditing: boolean) => setEditingGameCount(prev => isEditing ? prev + 1 : prev - 1)

  let shouldRenderNewButton = editingGameCount === 0
  let newButtonPath: LocationDescriptor = '/'
  let newButtonClass = undefined
  let newButtonColor: "inherit" | "default" | "primary" | "secondary" | undefined = 'default'

  if (location.pathname === '/') {
    newButtonPath = '/games/new'
    newButtonClass = classes.gamesFab
    newButtonColor = 'primary'
  } else if (location.pathname.startsWith('/games/new')) {
    shouldRenderNewButton = false
  } else if (location.pathname.startsWith('/games')) {
    newButtonPath = '/games/new'
    newButtonClass = classes.gamesFab
    newButtonColor = 'primary'
  } else if (location.pathname.startsWith('/courses/new')) {
    shouldRenderNewButton = false
  } else if (location.pathname.startsWith('/courses/view/')) {
    newButtonPath = '/courses/new/layout/' + location.pathname.substring('/courses/view/'.length)
    newButtonClass = classes.coursesFab
    newButtonColor = 'inherit'
  } else if (location.pathname.startsWith('/courses')) {
    newButtonPath = '/courses/new'
    newButtonClass = classes.coursesFab
    newButtonColor = 'inherit'
  } else {
    shouldRenderNewButton = false
  }

  return (
    <div className={classes.root} id="basePage">
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
        <div className="content">
          <PrivateRoute exact path="/" render={(props) => (<Games {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/games" render={(props) => (<Games {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/games/view/:id" render={(props) => (<Games {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/games/new" component={NewGame} />
          <PrivateRoute exact path="/players" component={Players} />
          <PrivateRoute exact path="/courses" component={Courses} />
          <PrivateRoute exact path="/courses/view/:id" component={Course} />
          <PrivateRoute exact path="/courses/new" component={NewSelection} />
          <PrivateRoute exact path="/courses/new/course" component={NewCourse} />
          <PrivateRoute exact path="/courses/new/layout/:id" component={NewLayout} />
          <PrivateRoute exact path="/graphs" component={Graphs} />
          <PrivateRoute exact path="/competitions" component={Competitions} />
          <PrivateRoute exact path="/info" component={Info} />

          {/* TODO: Add a Fab button to continue inputting ongoing game */}
          {shouldRenderNewButton ? (
            <NavLink to={newButtonPath} className={classes.navLink} id="newButton">
              {/* Usage of 'any': https://material-ui.com/guides/typescript/#usage-of-component-property */}
              <Fab color={newButtonColor} aria-label="Add" className={newButtonClass}>
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
