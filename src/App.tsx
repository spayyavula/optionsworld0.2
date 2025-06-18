import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import OptionsPortfolio from './pages/OptionsPortfolio'
import OptionsTrading from './pages/OptionsTrading'
import Orders from './pages/Orders'
import OptionsChain from './pages/OptionsChain'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import { OptionsProvider } from './context/OptionsContext'
import { TradingProvider } from './context/TradingContext'

function App() {
  return (
    <TradingProvider>
      <OptionsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<OptionsPortfolio />} />
            <Route path="/trading" element={<OptionsTrading />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/watchlist" element={<OptionsChain />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </OptionsProvider>
    </TradingProvider>
  )
}

export default App