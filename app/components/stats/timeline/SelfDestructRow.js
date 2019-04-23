import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, playerPropTypes } from './constants'

const SelfDestructRow = ({ player, playerStyles, yCoordinate }) => {
  const text = <text { ...textStyle } fill='#FF695E'> self destructs </text>
  return (
    <g transform={`translate(0, ${yCoordinate})`}>
      <g { ...playerStyles[player.playerIndex].text }> {text} </g>
    </g>
  )
}

SelfDestructRow.propTypes = {
  stock: PropTypes.shape({ count: PropTypes.number }).isRequired,
  player: playerPropTypes.isRequired,
  playerStyles: PropTypes.object.isRequired,
  yCoordinate: PropTypes.number.isRequired,
}

export default SelfDestructRow
