import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface Player {
  Salary: number
}

interface Props {
  players: Player[]
}

export default function SalaryHistogram({ players }: Props) {
  const top125 = players.slice(0, 125)
  const min = Math.min(...top125.map(p => p.Salary))
  const max = Math.max(...top125.map(p => p.Salary))
  const binSize = (max - min) / 10
  const bins = Array(10).fill(0)

  top125.forEach(player => {
    const binIndex = Math.min(Math.floor((player.Salary - min) / binSize), 9)
    bins[binIndex]++
  })

  const labels = Array(10).fill(0).map((_, i) => {
    const start = min + (binSize * i)
    const end = min + (binSize * (i + 1))
    return `${(start / 1000000).toFixed(0)}-${(end / 1000000).toFixed(0)}M`
  })

  const data = {
    labels,
    datasets: [{
      label: 'Players',
      data: bins,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  }

  return (
    <div className="chart-wrapper">
      <Bar 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { 
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: { 
              beginAtZero: true, 
              ticks: { stepSize: 5 },
              title: {
                display: true,
                text: 'Number of Players'
              }
            } 
          },
        }}
      />
    </div>
  )
}