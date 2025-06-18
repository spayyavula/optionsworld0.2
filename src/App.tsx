import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import OptionsPortfolio from './pages/OptionsPortfolio'
import OptionsTrading from './pages/OptionsTrading'
import Orders from './pages/Orders'
import OptionsChain from './pages/OptionsChain'
import RegimeAnalysis from './pages/RegimeAnalysis'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import { OptionsProvider } from './context/OptionsContext'
import { TradingProvider } from './context/TradingContext'

function App() {
  return (
    <TradingProvider>
      <OptionsProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
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
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </OptionsProvider>
    </TradingProvider>
  )
}

export default App