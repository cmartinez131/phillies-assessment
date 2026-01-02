import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import SalaryHistogram from './Histogram'
import AllSalaries from './AllSalaries'

interface Top125Stats {
  year: number
  count: number
  minimum: number
  maximum: number
  average: number
  median: number
}

interface Player {
  Player: string
  Salary: number
  Year: number
}

interface QualifyingOfferData {
  value: number
  top_125_stats: Top125Stats
  top_10_players: Player[]
}

function App() {
  const [data, setData] = useState<QualifyingOfferData | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
    fetchAllPlayers()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/qualifying-offer')
      setData(response.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch data')
      console.error(err)
    }
  }

  const fetchAllPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-all-rows')
      setAllPlayers(response.data)
    } catch (err) {
      console.error('Failed to fetch all players', err)
    }
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button onClick={fetchData}>Try Again</button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const yearPlayers = allPlayers
    .filter(p => p.Year === data.top_125_stats.year)
    .sort((a, b) => b.Salary - a.Salary)

  return (
    <>
      <h1>MLB Qualifying Offer Calculator</h1>
      
      <div className="container">
        <div className="left-column">
          <div className="card">
            <h2>{data.top_125_stats.year + 1} Qualifying Offer</h2>
            <div className="big-number">{formatCurrency(data.value)}</div>
            <p>Average of top 125 salaries ({data.top_125_stats.year} season)</p>
            <button onClick={fetchData}>Refresh</button>
          </div>

          <div className="card">
            <h3>Summary of Highest 125 Salaries</h3>
            <div className="stat-row">
              <div className="stat-label">Total Salaries Considered:</div>
              <div className="money-value">{data.top_125_stats.count}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Minimum:</div>
              <div className="money-value">{formatCurrency(data.top_125_stats.minimum)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Maximum:</div>
              <div className="money-value">{formatCurrency(data.top_125_stats.maximum)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Average:</div>
              <div className="money-value">{formatCurrency(data.top_125_stats.average)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Median:</div>
              <div className="money-value">{formatCurrency(data.top_125_stats.median)}</div>
            </div>
            <div className="stat-row highlight">
              <div className="stat-label">Qualifying Offer:</div>
              <div className="money-value">{formatCurrency(data.value)}</div>
            </div>
          </div>

          <div className="card histogram-card">
              <h3>Salary Distribution (Top 125)</h3>
              <SalaryHistogram players={yearPlayers} />
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <h3>Highest 10 Salaries in {data.top_125_stats.year}</h3>
            <div className="players-scroll">
              {data.top_10_players.map((player, index) => (
                <div key={index} className="player-row">
                  <div className="player-rank">#{index + 1}</div>
                  <div className="player-name">{player.Player}</div>
                  <div className="money-value">{formatCurrency(player.Salary)}</div>
                </div>
              ))}
            </div>
          </div>

          <AllSalaries 
              players={yearPlayers} 
              year={data.top_125_stats.year}
              formatCurrency={formatCurrency}
            />
        </div>
      </div>

      <footer>
        <p>Christopher Martinez | Georgia Institute of Technology | Phillies R&D</p>
      </footer>
    </>
  )
}

export default App