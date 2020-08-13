/**
 * Adds a listener function onOrientationChange that is called whenever
 * the screen orientation of the device changes.
 */
export const addOrientationListener = (onOrientationChange: Function) => {
  window.addEventListener('resize', function listener() {
    onOrientationChange()
    window.removeEventListener('resize', listener, true)
  }, true)
}
