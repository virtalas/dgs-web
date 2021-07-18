import { useEffect, useState } from 'react'

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
  }

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions())
      }
  
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])
  
    return {
        windowHeight: windowDimensions.height,
        windowWidth: windowDimensions.width,
    }
  }

export const getUserLocation = (completion?: (lat: number | undefined, lon: number | undefined) => void) => {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = Number(position.coords.latitude)
    const lon = Number(position.coords.longitude)
    if (completion) completion(lat, lon)
  }, error => {
    console.log('Failed to access location:', error)
    if (completion) completion(undefined, undefined)
  })
}
