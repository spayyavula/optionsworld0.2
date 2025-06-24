import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SeoHelmet from './components/SeoHelmet'
import Disclaimer from './components/Disclaimer'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AgentDashboard from './pages/AgentDashboard'
import Demo from './pages/Demo'
import OptionsPortfolio from './pages/OptionsPortfolio'
import OptionsTrading from './pages/OptionsTrading'
import Orders from './pages/Orders'
import OptionsChain from './pages/OptionsChain'
import RegimeAnalysis from './pages/RegimeAnalysis'
import Analytics from './pages/Analytics'
import OptionsArbitrage from './pages/OptionsArbitrage'
import OptionsLearning from './pages/OptionsLearning'
import TradingJournal from './pages/TradingJournal'
import OptionsStrategies from './pages/OptionsStrategies'
import Community from './pages/Community'
import Settings from './pages/Settings'
import OptionsDataManager from './pages/OptionsDataManager'
import Construction from './pages/Construction'
import { OptionsProvider } from './context/OptionsContext'
import { TradingProvider } from './context/TradingContext'
import { OptionsDataProvider } from './context/OptionsDataContext'

function App() {
  return (
    <TradingProvider>
      <SeoHelmet />
      <Disclaimer variant="banner" />
      <OptionsProvider>
        <OptionsDataProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/app" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/app/*" element={
              <Layout>
                <Routes>
                  <Route path="/portfolio" element={<OptionsPortfolio />} />
                  <Route path="/trading" element={<OptionsTrading />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/watchlist" element={<OptionsChain />} />
                  <Route path="/regime" element={<RegimeAnalysis />} />
                  <Route path="/arbitrage" element={<OptionsArbitrage />} />
                  <Route path="/learning" element={<OptionsLearning />} />
                  <Route path="/journal" element={<TradingJournal />} />
                  <Route path="/strategies" element={<OptionsStrategies />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/data-manager" element={<OptionsDataManager />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </OptionsDataProvider>
      </OptionsProvider>
    </TradingProvider>
  )
}

export default App