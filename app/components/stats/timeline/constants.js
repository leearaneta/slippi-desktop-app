import PropTypes from 'prop-types'

export const svgWidth = 150
export const fontSize = svgWidth / 75
export const rowHeight = fontSize * 4
export const tooltipWidth = fontSize * 10
export const tooltipTextX = fontSize * 8.5
export const tooltipOffsetX = (tooltipWidth - tooltipTextX) / 2

export const textStyle = {
  fontSize: fontSize,
  dominantBaseline: 'middle',
  fill: "rgba(255, 255, 255, .8)",
}

export const isSelfDestruct = punishes => stock => {
  const punishEndedThisStock = punish =>
    punish.opponentIndex === stock.playerIndex
      && punish.didKill
      && punish.endFrame === stock.endFrame

  return stock.endFrame && !punishes.find(punishEndedThisStock)
}

export const getYCoordinateFromTimestamp = (timestamp, uniqueTimestamps) =>
  (uniqueTimestamps.indexOf(timestamp)+1) * rowHeight

export const playerPropTypes = PropTypes.shape({
  playerIndex: PropTypes.number.isRequired,
  characterId: PropTypes.number.isRequired,
  characterColor: PropTypes.number.isRequired,
})

export const punishPropTypes = PropTypes.shape({
  playerIndex: PropTypes.number.isRequired,
  openingType: PropTypes.string.isRequired,
  moves: PropTypes.array.isRequired,
  startPercent: PropTypes.number.isRequired,
  endPercent: PropTypes.number.isRequired,
})