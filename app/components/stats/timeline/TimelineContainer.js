import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Timeline from './Timeline'
import MiniTimeline from './MiniTimeline'
import Header from './Header'
import { isSelfDestruct, svgWidth, rowHeight } from './constants' 
import { convertFrameCountToDurationString } from '../../../utils/time'

export default class TimelineContainer extends Component {

  static propTypes = {
    game: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    const gameStats = this.props.game.getStats()
    this.punishes = _
      .get(gameStats, 'conversions')
      .map(punish => ({ ...punish, timestamp: convertFrameCountToDurationString(punish.startFrame) }))

    this.stocks = _
      .get(gameStats, 'stocks')
      .map(stock => ({ ...stock, timestamp: convertFrameCountToDurationString(stock.endFrame) }))

    this.timelineRef = React.createRef()

    this.state = {
      currentTimestamp: null,
    }
  }

  componentDidMount() {
    this.heightRatio = this.timelineRef.current.scrollHeight / (this.uniqueTimestamps.length+1)
  }

  get players() {
    const gameSettings = this.props.game.getSettings()
    const players = _.get(gameSettings, 'players') || []
    return _.keyBy(players, 'playerIndex')
  }

  get uniqueTimestamps() {
    const punishTimestamps = this.punishes.map(punish => punish.timestamp)

    const stockTimestamps = this.stocks
      .filter(isSelfDestruct(this.punishes))
      .map(stock => stock.timestamp)
    
    const allTimestamps = [ ...punishTimestamps, ...stockTimestamps ]
    return _(allTimestamps)
      .sortBy()
      .sortedUniq()
      .value()
  }

  damageReducer = (acc, current) => {
    let currentDamage;
    if (current.type === 'punish') {
      const punish = current
      let opponentDamage;
      if (punish.didKill) {
        const stocks = acc.currentDamage[punish.opponentIndex].stocks - 1
        opponentDamage = { ...acc.currentDamage[punish.opponentIndex], stocks: stocks, percent: 0 }
      } else {
        opponentDamage = { ...acc.currentDamage[punish.opponentIndex], percent: punish.endPercent }
      }
      currentDamage = { ...acc.currentDamage, [punish.opponentIndex]: opponentDamage }
    }  
    if (current.type === 'sd') {
      const sd = current
      const stocks = acc.currentDamage[sd.playerIndex].stocks - 1
      const playerDamage = { ...acc.currentDamage[sd.playerIndex], stocks: stocks, percent: 0 }
      currentDamage = { ...acc.currentDamage, [sd.playerIndex]: playerDamage }
    }
    const damageByTimestamp = { ...acc.damageByTimestamp, [current.timestamp]: currentDamage }
    return { damageByTimestamp: damageByTimestamp, currentDamage: currentDamage }
  }

  get initialDamage() {
    const [firstPlayer, secondPlayer] = _.keys(this.players)
    return {
      [firstPlayer]: {
        stocks: 4,
        percent: 0,
      },
      [secondPlayer]: {
        stocks: 4,
        percent: 0,
      },
    }
  }

  get damageByTimestamp() {
    const punishes = this.punishes.map(punish => ({ ...punish, type: 'punish' }))
    const selfDestructs = this.stocks
      .filter(isSelfDestruct(this.punishes))
      .map(stock => ({ ...stock, type: 'sd' }))
    const allEvents = _.sortBy([ ...punishes, ...selfDestructs ], 'timestamp')
    const initialState = {
      damageByTimestamp: {},
      currentDamage: this.initialDamage,
    }
    return allEvents
      .reduce(this.damageReducer, initialState)
      .damageByTimestamp
  }

  handleScroll = () => {
    const timestampIndex = Math.ceil(this.timelineRef.current.scrollTop / this.heightRatio)
    const timestamp = this.uniqueTimestamps[timestampIndex]
    if (timestamp !== this.state.currentTimestamp)
      this.setState({currentTimestamp: timestamp})
  }

  onPunishMouseOver = punish => {
    const y = this.uniqueTimestamps.indexOf(punish.timestamp) * this.heightRatio
    this.timelineRef.current.scrollTo({top: y, behavior: "smooth"})
    this.setState({currentTimestamp: punish.timestamp})
  }
  
  render() {
    return (
      <div style={{display: "flex"}}>
        <div style={{flex: 10, overflow: "hidden"}}>
          <Header
            players={this.players}
            currentDamage={_.get(this.damageByTimestamp, this.state.currentTimestamp, this.initialDamage)}
          />
          <div 
            style={{overflow: "scroll", overflowX: "hidden"}}
            onScroll={_.debounce(this.handleScroll, 500)}
            ref={this.timelineRef}
          >
            <div style={{height: "45rem"}}>
              <svg
                viewBox={`0 0 ${svgWidth} ${(this.uniqueTimestamps.length+1) * rowHeight}`}
                style={{background: "#2D313A"}}
              >
                <Timeline
                  punishes={this.punishes}
                  stocks={this.stocks}
                  players={this.players}
                  uniqueTimestamps={this.uniqueTimestamps}
                  currentTimestamp={this.state.currentTimestamp}
                />
              </svg>
            </div>
          </div>
        </div>
        <div style={{flex: 2, height: "50rem"}}>
          <MiniTimeline
            players={this.players}
            punishes={this.punishes}
            onPunishMouseOver={this.onPunishMouseOver}
            currentTimestamp={this.state.currentTimestamp}
          />
        </div>
      </div>
    )
  }

}