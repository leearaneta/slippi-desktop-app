import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import { MiniTimelinePunish, MiniTimelineSelfDestruct } from './MiniTimelineEvents'
import { punishPropTypes, getCumulativeComboDamage } from './constants'

const MiniTimeline = ({ punishes, selfDestructs, players, handleMouseOver, currentTimestamp }) => {
  
  const height = _.maxBy(punishes, 'endFrame').endFrame

  const width = _(punishes)
    .map(getCumulativeComboDamage)
    .map(_.last)
    .max()
    * 2

  const origin = width / 2
  
  const playerIndices = _.keys(players).map(key => parseInt(key, 10))
  const xPositions = _.mapValues(players, player =>
    playerIndices.indexOf(player.playerIndex) === 0 ? "left" : "right"
  )

  const miniTimelinePunishes = punishes.map((punish, index) =>
    <MiniTimelinePunish
      key={`${xPositions[punish.playerIndex]}-punish-${index}`}
      punish={punish}
      xPosition={xPositions[punish.playerIndex]}
      origin={origin}
      handleMouseOver={handleMouseOver}
    />
  )

  const miniTimelineSelfDestructs = selfDestructs.map((selfDestruct, index) =>
    <MiniTimelineSelfDestruct
      key={`${xPositions[selfDestruct.playerIndex]}-sd-${index}`}
      selfDestruct={selfDestruct}
      xPosition={xPositions[selfDestruct.playerIndex]}
      origin={origin}
      handleMouseOver={handleMouseOver}
    />
  )

  const currentEvent = [ ...punishes, ...selfDestructs ].find(event => event.timestamp === currentTimestamp)

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      { miniTimelinePunishes }
      { miniTimelineSelfDestructs }
      { currentTimestamp &&
        <rect
          x={xPositions[currentEvent.playerIndex] === "left" ? 0 : origin}
          y={currentEvent.yFrame}
          width={origin}
          height={currentEvent.type === 'punish' ? currentEvent.endFrame - currentEvent.startFrame : 100}
          opacity={.25}
          fill="#E9EAEA"
        />
      }
    </svg>   
  )
}

MiniTimeline.propTypes = {
  punishes: PropTypes.arrayOf(punishPropTypes).isRequired,
  selfDestructs: PropTypes.array.isRequired,
  players: PropTypes.object.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  currentTimestamp: PropTypes.string,
}

MiniTimeline.defaultProps = {
  currentTimestamp: null,
}

export default MiniTimeline