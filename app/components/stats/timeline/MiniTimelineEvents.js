import React from 'react'
import PropTypes from 'prop-types'

import { punishPropTypes, getCumulativeComboDamage } from './constants'

const basePropTypes = {
  xPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  origin: PropTypes.number.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
}

const MiniTimelineEvent = ({ event, xPosition, origin, handleMouseOver, children }) =>
  <g
    onMouseOver={() => handleMouseOver(event)}
    onFocus={() => handleMouseOver(event)}
  >
    {/* invisible rectangle to trigger onMouseOver */}
    <rect
      x={xPosition === "left" ? 0 : origin}
      y={event.yFrame}
      width={origin}
      height={100}
      opacity="0"
    />
    { children }
  </g>

MiniTimelineEvent.propTypes = { ...basePropTypes, event: PropTypes.object.isRequired }

export const MiniTimelinePunish = ({ punish, xPosition, origin, handleMouseOver }) => {

  const cumulativeComboDamage = getCumulativeComboDamage(punish)
  const moves = punish.moves.map((move, index) => (
    <line
      key={xPosition + move.frame}
      y1={move.frame}
      y2={move.frame}
      x1={origin}
      x2={origin + (cumulativeComboDamage[index] * (xPosition === "left" ? -1 : 1))}
      stroke='white'
      strokeWidth={10}
    />
  ))
    
  return (
    <MiniTimelineEvent
      event={punish}
      xPosition={xPosition}
      origin={origin}
      handleMouseOver={handleMouseOver}
    >
      { punish.didKill &&
        <rect
          x={xPosition === "left" ? origin : 0}
          y={punish.startFrame}
          width={origin}
          height={punish.endFrame - punish.startFrame}
          fill='#FF695E'
          opacity={.5}
        />
      }
      { moves }
    </MiniTimelineEvent>
  )
}

MiniTimelinePunish.propTypes = { ...basePropTypes, punish: punishPropTypes.isRequired }

export const MiniTimelineSelfDestruct = ({ selfDestruct, xPosition, origin, handleMouseOver }) =>
  <MiniTimelineEvent
    event={selfDestruct}
    xPosition={xPosition}
    origin={origin}
    handleMouseOver={handleMouseOver}
  >
    <text> x </text>
  </MiniTimelineEvent>

MiniTimelineSelfDestruct.propTypes = {
  selfDestruct: PropTypes.object.isRequired,
  xPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  origin: PropTypes.number.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
}

MiniTimelineSelfDestruct.propTypes = { ...basePropTypes, selfDestruct: PropTypes.object.isRequired }
