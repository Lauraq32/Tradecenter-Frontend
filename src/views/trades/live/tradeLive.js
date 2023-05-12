import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { CBadge } from '@coreui/react'
import format from 'date-fns/format'
import { io } from 'socket.io-client'
import { isSameDay } from 'date-fns'

const TradeLive = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [trades, setTrades] = useState([])

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
    // eslint-disable-next-line
  }, [])

  const updateTrades = useCallback((updatedTrades) => {
    setTrades((prevTrades) => {
      console.log(updatedTrades)
      const oldTrades = {}

      prevTrades.forEach((trade) => {
        oldTrades[trade._id] = trade
      })

      updatedTrades.forEach((trade) => {
        if (oldTrades[trade._id]) oldTrades[trade._id] = trade
      })

      const alreadySave = {}
      const newTrades = []

      updatedTrades.concat(prevTrades).forEach((trade) => {
        if (!alreadySave[trade._id]) {
          const newTrade = oldTrades[trade._id] ? oldTrades[trade._id] : trade
          newTrades.push(newTrade)

          alreadySave[trade._id] = true
        }
      })

      return newTrades
    })
  }, [])

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_URL}`)
    socket.on('connect', () => console.log(`Client connected: ${socket.id}`))

    socket.on('updateTrades', updateTrades)

    socket.on('disconnect', (reason) => console.log(`Client disconnected: ${reason}`))

    socket.on('connect_error', (reason) => console.log(`Client connect_error: ${reason}`))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
    }
  }, [updateTrades])

  useEffect(() => {
    fetchTrades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchTrades() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/trades`
      const token = localStorage.getItem('token')
      if (!token) return

      const options = {
        headers: {
          Authorization: token,
        },
      }
      const res = await axios.get(url, options)

      const newTrades = (res.data || []).filter(
        (trade) => isSameDay(today, new Date(trade.timestamp)) && trade.status === 'CLOSED',
      )

      setTrades(newTrades)
    } catch (error) {
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    if (status === 'CLOSED') return 'info'
    if (status === 'FILLED') return 'success'
  }

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
  }

  const today = Date.now()

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Trade Live</h4>
        <p className="card-description">{''}</p>
        <div className="table-responsive">
          <table className="table table-hover" color="dark">
            <thead>
              <tr>
                <th>Account</th>
                <th>Size</th>
                <th>Ticker</th>
                <th>Timestamp</th>
                <th>Price</th>
                <th>Status</th>
                <th>Stop</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {trades
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((trade) => {
                  return (
                    <tr key={trade._id}>
                      <td className="text-danger">{trade.account}</td>
                      <td>{trade.size}</td>
                      <td>{trade.ticker}</td>
                      <td>{formatDate(trade.timestamp)}</td>
                      <td>{trade.price.toFixed(2)}</td>
                      <td>
                        <CBadge color={getStatusColor(trade.status)}>{trade.status}</CBadge>
                      </td>
                      <td>{trade.stop.toFixed(2)}</td>
                      <td>{Math.round(trade.profit * 100) / 100}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TradeLive
