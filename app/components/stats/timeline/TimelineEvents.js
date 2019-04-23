import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import { svgWidth, rowHeight, fontSize, textStyle, punishPropTypes } from './constants'
import { getMoveName } from '../../../utils/moves'
import Tooltip from './Tooltip'

const baseProps = {
  yCoordinate: PropTypes.number.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
}

const TimelineEvent = ({ event, yCoordinate, handleMouseOver, children }) => 
  <g
    onMouseOver={() => handleMouseOver(event)}
    onFocus={() => handleMouseOver(event)}
    transform={`translate(0, ${yCoordinate})`}
  >
    {/* invisible rectangle to trigger onMouseOver */}
    <rect
      x={0}
      y={-(rowHeight/2)}
      width={svgWidth}
      height={rowHeight}
      opacity={0}
    />
    { children }
  </g>

TimelineEvent.propTypes = { ...baseProps, event: PropTypes.object.isRequired, children: PropTypes.array.isRequired }

export class PunishRow extends Component {

  static propTypes = { ...baseProps, playerStyles: PropTypes.object.isRequired, punish: punishPropTypes.isRequired }

  constructor(props) {
    super(props)
    this.state = {
      hover: false,
    }
  }

  getMoveTextFill(amountOfMoves) {
    const red = Math.max(255 - 50*(amountOfMoves-1), 0)
    const green = Math.max(255 - 10*(amountOfMoves-1), 200)
    return `rgb(${red}, ${green}, 255, 1)`
  }

  renderPunishText(punish) {
    const { moves, openingType } = punish
    const damageDone = _.sumBy(moves, 'damage')
  
    const moveText = moves.length > 1
      ? `${moves.length} moves`
      : getMoveName(_.last(moves).moveId)
  
    let killText = ''
    if (punish.didKill) {
      killText += 'and takes a stock'
      if (moves.length > 1) {
      // if there's only one move in the combo, the move name is already mentioned in moveText
        killText += ` with ${getMoveName(_.last(moves).moveId)}`
      }
    }
  
    return (
      <g>
        <text { ...textStyle }>
          deals {Math.trunc(damageDone)}% with
          <tspan fill={this.getMoveTextFill(moves.length)}> {moveText} </tspan>
          from a {openingType.replace('-', ' ')}
        </text>
        { punish.didKill && <text y={fontSize} { ...textStyle }> {killText} </text> }
      </g>
    )
  }

  render() {
    const { punish, playerStyles, yCoordinate, handleMouseOver } = this.props
    const text = this.renderPunishText(punish)
    const { text: playerTextStyle, line: playerLineStyle, tooltip: tooltipStyle } = playerStyles[punish.playerIndex]

    return (
      <TimelineEvent
        event={punish}
        playerStyle={playerStyles}
        yCoordinate={yCoordinate}
        handleMouseOver={handleMouseOver}
      >
        { punish.openingType !== 'trade' &&
          <line
            { ...playerLineStyle }
            stroke='rgba(255, 255, 255, 0.7)'
            strokeWidth={.1}
          />
        }
        <g
          onMouseOver={() => this.setState({hover: true})}
          onMouseOut={() => this.setState({hover: false})}
          onFocus={() => this.setState({hover: true})}
          onBlur={() => this.setState({hover: false})}
          { ...playerTextStyle }
        > 
          {this.state.hover && punish.moves.length > 1 && <Tooltip punish={punish} tooltipStyle={tooltipStyle}/>}
          {text} 
        </g>
      </TimelineEvent>
    )
  }
}


export const SelfDestructRow = ({ selfDestruct, playerStyles, yCoordinate, handleMouseOver }) => 
  <TimelineEvent
    event={selfDestruct}
    playerStyle={playerStyles}
    yCoordinate={yCoordinate}
    handleMouseOver={handleMouseOver}
  >
    <g { ...playerStyles[selfDestruct.playerIndex].text }>
      <text { ...textStyle } fill='#FF695E'> self destructs </text>
    </g>
  </TimelineEvent>

SelfDestructRow.propTypes = { ...baseProps, playerStyles: PropTypes.object.isRequired, selfDestruct: PropTypes.object.isRequired }