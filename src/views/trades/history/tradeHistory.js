import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CBadge } from '@coreui/react'
import format from 'date-fns/format'

const TradeHistory = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [trades, setTrades] = useState([])
  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [navigate, token])

  useEffect(() => {
    fetchTrades()
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
      axios
        .get(url, options)
        .then((response) => {
          setTrades(response.data)
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            navigate('/')
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    if (status === 'CLOSED') return 'info'
  }

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'MM/dd/yyyy')
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Trade History</h4>
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
                .filter((trade) => trade.status === 'CLOSED')
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

export default TradeHistory
