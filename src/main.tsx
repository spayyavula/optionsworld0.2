import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { OptionsDataScheduler } from './services/optionsDataScheduler'
import { LearningService } from './services/learningService'
import { CommunityService } from './services/communityService'
import { StockChartsService } from './services/stockChartsService'

// Initialize the options data scheduler
const scheduler = OptionsDataScheduler.getInstance()
scheduler.start()

// Initialize learning data
LearningService.initializeDefaultData()

// Initialize community data
CommunityService.initializeData()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)