import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import { Route, NavLink, HashRouter, BrowserRouter as Router } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import { unwrap } from "@material-ui/core/test-utils"
import { createShallow } from '@material-ui/core/test-utils'

import Drawer from './Drawer'
import { ResponsiveDrawer } from './Drawer'
import Games from './games/Games'
import Players from './players/Players'

const ResponsiveDrawerNaked = unwrap(Drawer)

describe.only('<Drawer />', () => {

  const location = {pathname: '/'}
  const classes = {toolbar: ''}
  const theme = {direction: ''} // TODO delete

  it('renders content', () => {
    // const drawer = shallow(<ResponsiveDrawerNaked location={location} classes={classes} />)
    // const drawer = createShallow()(<Router><Route path="/"><Drawer classes={classes} /></Route></Router>)
    // console.log(drawer.debug())

    // expect(drawer.find(Route).at(0).props().component).to.equal(Games)
    // expect(drawer.find(Route).at(0).props().path).to.equal('/')

    // expect(drawer.find(Route).at(1).props().component).to.equal(Games)
    // expect(drawer.find(Route).at(1).props().path).to.equal('/games')

    // expect(drawer.find(Route).at(2).props().component).to.equal(Players)
    // expect(drawer.find(Route).at(2).props().path).to.equal('/players')

  })

  // it('renders new game button when on games page', () => {
  //   location.pathname = '/games'
  //   const drawer = createShallow()(<Router><Drawer.WrappedComponent location={location} classes={classes} /></Router>)
  //   // console.log(drawer.dive().dive().dive().debug())
  //   expect(drawer.find(Fab).parent().props().to).to.equal('/games/new')
  // })

  // it('renders new course button when on courses page', () => {
  //   location.pathname = '/courses'
  //   const drawer = createShallow()(<ResponsiveDrawer location={location} />)
  //   console.log(drawer.debug())
  //   expect(drawer.find(Fab).parent().props().to).to.equal('/courses/new')
  // })

  // it('renders correct component when navigating', () => {
  //   location.pathname = '/games'
  //   const drawer = shallow(<ResponsiveDrawer location={location} classes={classes} theme={theme} />)

  //   drawer.find(NavLink).at(1).simulate('click')
  //   // TODO check that Games component renderes
  // })
})
