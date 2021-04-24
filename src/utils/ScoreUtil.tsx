export const calculateTotalScore = (throws: number[], obs: number[]): number => {
    let total = 0
    for (let holeIndex = 0; holeIndex < throws.length; holeIndex++) {
      if (throws[holeIndex] !== 0) {
        total += throws[holeIndex]
        total += obs[holeIndex]
      }
    }
    return total
}

export const calculateToPar = (throws: number[], total: number, holes: Hole[]): number => {
    let courseTotal = 0
    for (let holeIndex = 0; holeIndex < throws.length; holeIndex++) {
      if (throws[holeIndex] !== 0) {
        courseTotal += holes[holeIndex].par
      }
    }
    return total - courseTotal
}
