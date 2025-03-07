import React, { useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'

import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'

import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import YamProvider from './contexts/YamProvider'
import TransactionProvider from './contexts/Transactions'

import useModal from './hooks/useModal'

import Farms from './views/Farms'

import { getEthChainInfo } from './utils/getEthChainInfo'

import theme from './theme'

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (
    <Providers>
      <Router>
        <TopBar
          onPresentMobileMenu={handlePresentMobileMenu}
          showButton={true}
        />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Switch>
          <Route exact path="/">
            <Redirect to="/farms" />
          </Route>
          <Route path="/farms">
            <Farms />
          </Route>
        </Switch>
      </Router>
      <Disclaimer />
    </Providers>
  )
}

// https://infura.io/docs/gettingStarted/chooseaNetwork
// https://www.anyblockanalytics.com/news/overview-ethereum-blockchain-networks/
const Providers: React.FC = ({ children }) => {
  const { chainId, rpcUrl } = getEthChainInfo()

  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider
        chainId={chainId}
        connectors={{
          walletconnect: { rpcUrl },
        }}
      >
        <YamProvider>
          <TransactionProvider>
            <FarmsProvider>
              <ModalsProvider>{children}</ModalsProvider>
            </FarmsProvider>
          </TransactionProvider>
        </YamProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

const Disclaimer: React.FC = () => {
  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(
    <DisclaimerModal onConfirm={markSeen} />,
  )

  useEffect(() => {
    const seenDisclaimer = true // localStorage.getItem('disclaimer')
    if (!seenDisclaimer) {
      onPresentDisclaimerModal()
    }
  }, [])

  return <div />
}

export default App
