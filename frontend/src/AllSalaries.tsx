import { useState } from 'react'

interface Player {
  Player: string
  Salary: number
  Year: number
}

interface Props {
  players: Player[]
  year: number
  formatCurrency: (value: number) => string
}

export default function AllSalaries({ players, year, formatCurrency }: Props) {
  const [filter, setFilter] = useState(10)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const getFilteredPlayers = () => {
    const sorted = [...players].sort((a, b) => 
      sortOrder === 'desc' ? b.Salary - a.Salary : a.Salary - b.Salary
    )
    return filter === -1 ? sorted : sorted.slice(0, filter)
  }

  return (
    <div className="card">
      <div className="all-salaries-header">
        <h3>All Salaries ({year})</h3>
        <div className="controls">
          <div className="filter-buttons">
            <button className={filter === 10 ? 'active' : ''} onClick={() => setFilter(10)}>
              Show 10
            </button>
            <button className={filter === 50 ? 'active' : ''} onClick={() => setFilter(50)}>
              Show 50
            </button>
            <button className={filter === 125 ? 'active' : ''} onClick={() => setFilter(125)}>
              Show 125
            </button>
            <button className={filter === -1 ? 'active' : ''} onClick={() => setFilter(-1)}>
              All
            </button>
          </div>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} 
            className="sort-button"
          >
            Sort {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
          </button>
        </div>
      </div>
      <div className="all-players-scroll">
        {getFilteredPlayers().map((player, index) => (
          <div key={index} className="player-row">
            <span className="player-rank">#{index + 1}</span>
            <span className="player-name">{player.Player}</span>
            <span className="money-value">{formatCurrency(player.Salary)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}