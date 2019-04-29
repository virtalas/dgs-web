import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import { Route, NavLink, HashRouter, Router } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'

import Drawer from './Drawer'
import { ResponsiveDrawer } from './Drawer'
import Games from './games/Games'
import Players from './players/Players'

describe.only('<Drawer />', () => {

  const location = {pathname: '/'}
  const classes = {toolbar: ''}
  const theme = {direction: ''}

  it('renders content', () => {
    const drawer = shallow(<ResponsiveDrawer location={location} classes={classes} theme={theme} />)

    expect(drawer.find(Route).at(0).props().component).to.equal(Games)
    expect(drawer.find(Route).at(0).props().path).to.equal('/')

    expect(drawer.find(Route).at(1).props().component).to.equal(Games)
    expect(drawer.find(Route).at(1).props().path).to.equal('/games')

    expect(drawer.find(Route).at(2).props().component).to.equal(Players)
    expect(drawer.find(Route).at(2).props().path).to.equal('/players')

  })

  it('renders new game button when on games page', () => {
    location.pathname = '/games'
    const drawer = shallow(<ResponsiveDrawer location={location} classes={classes} theme={theme} />)
    expect(drawer.find(Fab).parent().props().to).to.equal('/games/new')
  })

  it('renders new course button when on courses page', () => {
    location.pathname = '/courses'
    const drawer = shallow(<ResponsiveDrawer location={location} classes={classes} theme={theme} />)
    expect(drawer.find(Fab).parent().props().to).to.equal('/courses/new')
  })

  it('renders correct component when navigating', () => {
    location.pathname = '/games'
    const drawer = shallow(<ResponsiveDrawer location={location} classes={classes} theme={theme} />)

    drawer.find(NavLink).at(1).simulate('click')
    // TODO check that Games component renderes
  })
})
