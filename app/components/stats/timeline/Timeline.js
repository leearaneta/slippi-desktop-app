import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styles from '../GameProfile.scss'

import { PunishRow, SelfDestructRow } from './TimelineEvents'
import TimestampBox from './TimestampBox'
import {
  getYCoordinateFromTimestamp,
  svgWidth,
  rowHeight,
  tooltipWidth,
  tooltipTextX,
  tooltipOffsetX,
  punishPropTypes,
} from './constants'

const Timeline = ({ punishes, selfDestructs, players, uniqueTimestamps, handleMouseOver, currentTimestamp }) => {

  const [firstPlayer, secondPlayer] = _.sortBy(_.keys(players))

  const playerStyles = {
    [firstPlayer]: {
      text: {transform: `translate(${svgWidth*.1}, 0)`, textAnchor: 'start'},
      line: {x1: svgWidth*.375, x2: svgWidth*.45},
      tooltip: {
        text: {x: 0},
        percent: {x: tooltipTextX},
        rect: {x: -tooltipOffsetX},
      },
    },
    [secondPlayer]: {
      text: {transform: `translate(${svgWidth*.9}, 0)`, textAnchor: 'end'},
      line: {x1: svgWidth*.625, x2: svgWidth*.55},
      tooltip: {
        text: {x: -tooltipTextX},
        percent: {x: 0},
        rect: {x: -tooltipWidth + tooltipOffsetX},
      },
    },
  }

  const punishRows = punishes
    .map(punish =>
      <PunishRow
        key={`${punish.playerIndex}-${punish.startFrame}`}
        punish={punish}
        playerStyles={playerStyles}
        yCoordinate={getYCoordinateFromTimestamp(punish.timestamp, uniqueTimestamps)}
        handleMouseOver={handleMouseOver}
      />
    )

  const selfDestructRows = selfDestructs
    .map(selfDestruct =>
      <SelfDestructRow
        key={`${selfDestruct.playerIndex}-${selfDestruct.endFrame}`}
        selfDestruct={selfDestruct}
        playerStyles={playerStyles}
        yCoordinate={getYCoordinateFromTimestamp(selfDestruct.timestamp, uniqueTimestamps)}
        handleMouseOver={handleMouseOver}
      />
    )

  const timestampBoxes = uniqueTimestamps
    .map((timestamp, index) =>
      <TimestampBox
        key={timestamp}
        timestamp={timestamp}
        yCoordinate={(index+1) * rowHeight}
      />
    )

  return (
    <g>
      { currentTimestamp &&
        <rect
          x={0}
          y={getYCoordinateFromTimestamp(currentTimestamp, uniqueTimestamps) - (rowHeight/2)}
          width={svgWidth}
          height={rowHeight}
          className={styles['punish-hover']}
        />
      }
      { selfDestructRows }
      { punishRows }

      {/* divider */}
      <line
        x1={svgWidth / 2}
        x2={svgWidth / 2}
        y1="0"
        y2={(uniqueTimestamps.length+1) * rowHeight}
        stroke='rgba(255, 255, 255, 0.75)'
        strokeWidth='.1'
      />

      { timestampBoxes }
    </g>
  )
}

Timeline.propTypes = {
  punishes: PropTypes.arrayOf(punishPropTypes).isRequired,
  selfDestructs: PropTypes.arrayOf(PropTypes.object).isRequired,
  players: PropTypes.object.isRequired,
  uniqueTimestamps: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  currentTimestamp: PropTypes.string,
}

Timeline.defaultProps = {
  currentTimestamp: null,
}

export default React.memo(Timeline)