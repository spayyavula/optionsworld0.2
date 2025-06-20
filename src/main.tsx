import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { OptionsDataScheduler } from './services/optionsDataScheduler'
import { LearningService } from './services/learningService'

// Initialize the options data scheduler
const scheduler = OptionsDataScheduler.getInstance()
scheduler.start()

// Initialize learning data
LearningService.initializeDefaultData()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)