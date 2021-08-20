import React, { useRef, useState } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { LocationDescriptor } from 'history'

import CssBaseline from '@material-ui/core/CssBaseline'
import Fab from '@material-ui/core/Fab'
import { makeStyles } from '@material-ui/core/styles'

import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import Grow from '@material-ui/core/Grow'
import { Typography } from '@material-ui/core'

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
import SearchPage from './games/SearchPage'
import { useEffect } from 'react'
import { CancelTokenSource } from 'axios'
import baseService from '../services/baseService'
import gamesService from '../services/gamesService'

export const drawerWidth = 240
export const pageMaxWidth = 610

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
  },
  content: {
    marginTop: appBarHeight,
    width: '100%',
    flexGrow: 1,
  },
  navLink: {
    textDecoration: 'none',
  },
  bottomFabButton: {
    position: 'fixed',
    bottom: '10px',
    right: 'calc(10px + env(safe-area-inset-right))',
    zIndex: 11,
  },
  topFabButton: {
    position: 'fixed',
    bottom: '76px',
    right: 'calc(10px + env(safe-area-inset-right))',
    zIndex: 11,
  },
  coursesNewButtonFab: {
    position: 'fixed',
    bottom: '10px',
    right: 'calc(10px + env(safe-area-inset-right))',
    zIndex: 2,
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },
  continueGameText: {
    fontSize: 9,
    marginTop: 2,
  },
}))

interface Props {
  location: Location
}

const BasePage: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { location } = props

  const [editingGameCount, setEditingGameCount] = useState(0)
  const [unfinishedGameId, setUnfinishedGameId] = useState<string>()
  const [gameCreationAllowed, setGameCreationAllowed] = useState<boolean>()

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    const checkForUnfinishedGame = async () => {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const gameId = await gamesService.getUnfinishedGameId(cancelTokenSourceRef.current)

      if (gameId === undefined || gameId === null) {
        setGameCreationAllowed(true)
      } else {
        setUnfinishedGameId(gameId)
        setGameCreationAllowed(false)
      }
    }

    checkForUnfinishedGame()
  }, [])

  const onEditGameToggle = (isEditing: boolean) => setEditingGameCount(prev => isEditing ? prev + 1 : prev - 1)

  let shouldRenderNewButton = editingGameCount === 0
  let newButtonPath: LocationDescriptor = '/'
  let newButtonClass = undefined
  let newButtonColor: "inherit" | "default" | "primary" | "secondary" | undefined = 'default'

  let shouldRenderSearchButton = editingGameCount === 0
  let searchPath = '/'
  let searchButtonClass = undefined
  let searchButtonIcon = <SearchIcon />

  if (location.pathname === '/') {
    newButtonPath = '/games/new'
    newButtonClass = classes.bottomFabButton
    newButtonColor = 'primary'
    searchPath = '/games/search'
    searchButtonClass = classes.topFabButton
  } else if (location.pathname.startsWith('/games/new')) {
    shouldRenderNewButton = false
    shouldRenderSearchButton = false
  } else if (location.pathname.startsWith('/games/search')) {
    shouldRenderNewButton = false
    searchPath = '/games'
    searchButtonClass = classes.bottomFabButton
    searchButtonIcon = <CloseIcon />
  } else if (location.pathname.startsWith('/games')) {
    newButtonPath = '/games/new'
    newButtonClass = classes.bottomFabButton
    newButtonColor = 'primary'
    searchPath = '/games/search'
    searchButtonClass = classes.topFabButton
  } else if (location.pathname.startsWith('/courses/new')) {
    shouldRenderNewButton = false
    shouldRenderSearchButton = false
  } else if (location.pathname.startsWith('/courses/view/')) {
    shouldRenderSearchButton = false
    newButtonPath = '/courses/new/layout/' + location.pathname.substring('/courses/view/'.length)
    newButtonClass = classes.coursesNewButtonFab
    newButtonColor = 'inherit'
    // TODO: Search button for courses
  } else if (location.pathname.startsWith('/courses')) {
    shouldRenderSearchButton = false
    newButtonPath = '/courses/new'
    newButtonClass = classes.coursesNewButtonFab
    newButtonColor = 'inherit'
    // TODO: Search button for courses
  } else {
    shouldRenderNewButton = false
    shouldRenderSearchButton = false
  }

  return (
    <div className={classes.root} id="basePage">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>

      <CssBaseline />

      <AppBar />

      <main className={classes.content}>
        <div className="content">
          <PrivateRoute exact path="/" render={(props) => (<Games {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/games" render={(props) => (<Games {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/games/view/:id" render={(props) => (<Games {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/games/new" component={NewGame} />
          <PrivateRoute exact path="/games/search" render={(props) => (<SearchPage {...props} onEditToggle={onEditGameToggle} />)} />
          <PrivateRoute exact path="/players" component={Players} />
          <PrivateRoute exact path="/courses" component={Courses} />
          <PrivateRoute exact path="/courses/view/:id" component={Course} />
          <PrivateRoute exact path="/courses/new" component={NewSelection} />
          <PrivateRoute exact path="/courses/new/course" component={NewCourse} />
          <PrivateRoute exact path="/courses/new/layout/:id" component={NewLayout} />
          <PrivateRoute exact path="/graphs" component={Graphs} />
          <PrivateRoute exact path="/competitions" component={Competitions} />
          <PrivateRoute exact path="/info" component={Info} />

          {gameCreationAllowed && shouldRenderNewButton && (
            <Grow in={gameCreationAllowed && shouldRenderNewButton} {...{ timeout: 300 }}>
              <NavLink to={newButtonPath} className={classes.navLink} id="newButton">
                {/* Usage of 'any': https://material-ui.com/guides/typescript/#usage-of-component-property */}
                <Fab color={newButtonColor} aria-label="New game" className={newButtonClass}>
                  <AddIcon />
                </Fab>
              </NavLink>
            </Grow>
          )}

          {unfinishedGameId && shouldRenderNewButton && (
            <Grow in={unfinishedGameId !== undefined} {...{ timeout: 300 }}>
              <NavLink to={`/games/${unfinishedGameId}/input`} className={classes.navLink}>
                <Fab color={newButtonColor} aria-label="Continue game" className={newButtonClass}>
                  <Typography className={classes.continueGameText}>Continue game</Typography>
                </Fab>
              </NavLink>
            </Grow>
          )}

          {gameCreationAllowed !== undefined && shouldRenderSearchButton && (
            <Grow in={gameCreationAllowed !== undefined && shouldRenderSearchButton} {...{ timeout: 300 }}>
              <NavLink to={searchPath} className={classes.navLink} id="searchButton">
                <Fab color="default" aria-label="Search games" className={searchButtonClass}>
                  {searchButtonIcon}
                </Fab>
              </NavLink>
            </Grow>
          )}
        </div>
      </main>
    </div>
  )
}

export { BasePage } // Used for testing.
// The component needs to be exported with withRouter() to access props.location:
export default withRouter(BasePage as any)
