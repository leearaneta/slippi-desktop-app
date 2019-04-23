import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import styles from '../GameProfile.scss'
import { svgWidth, fontSize, rowHeight } from './constants'
import getLocalImage from '../../../utils/image'

const stockSize = fontSize * 2

const renderPercent = percent => {
  const gb = Math.max(255-percent, 100)
  const percentFill = `rgb(255, ${gb}, ${gb}, .85)`
  return (
    <text
      fontSize={stockSize}
      strokeWidth={fontSize/3}
      fill={percentFill}
      className={styles['percent']}
    >
      {Math.trunc(percent)}%
    </text>
  )
}

const renderStock = (player, stocksRemaining) => (stockNumber, index) => {
  const imageName = `stock-icon-${player.characterId}-${player.characterColor}.png`
  return (
    <image
      key={`${imageName} ${stocksRemaining} ${index}`}
      opacity={stockNumber > stocksRemaining ? .5 : 1}
      xlinkHref={getLocalImage(imageName)}
      height={stockSize}
      width={stockSize}
      x={stockSize*index}
      y={-stockSize}
    />
  )
}

const renderStockCount = (player, stocksRemaining) => {
  const renderPlayerStock = renderStock(player, stocksRemaining)

  const stockIcons = _
    .range(1, player.startStocks+1)
    .map(renderPlayerStock)

  return <g>{stockIcons}</g>
}

const Header = ({ players, currentDamage }) => {
  const [firstPlayer, secondPlayer] = _.sortBy(_.keys(players))
  const playerStyles = {
    [firstPlayer]: {
      stocks: {transform: `translate(${svgWidth*.375 - 4*stockSize}, ${stockSize/2.5})`},
      percent: {transform: `translate(${svgWidth*.45}, 0)`, textAnchor: 'end'},
    },
    [secondPlayer]: {
      stocks: {transform: `translate(${svgWidth*.625}, ${stockSize/2.5})`},
      percent: {transform: `translate(${svgWidth*.55}, 0)`},
    },
  }

  const stocksAndPercent = _.keys(players).map(playerIndex =>
    <g key={`${playerIndex}-header`} transform={`translate(0, ${rowHeight/2})`}>
      <g { ...playerStyles[playerIndex].stocks }>
        { renderStockCount(players[playerIndex], currentDamage[playerIndex].stocks) }
      </g>
      <g { ...playerStyles[playerIndex].percent }>
        { renderPercent(currentDamage[playerIndex].percent) }
      </g>
    </g>
  )
  return (
    <svg viewBox={`0 0 ${svgWidth} ${rowHeight}`}>
      { stocksAndPercent }
    </svg>
  )
}

Header.propTypes = {
  players: PropTypes.object.isRequired,
  currentDamage: PropTypes.object.isRequired,
}

export default Header