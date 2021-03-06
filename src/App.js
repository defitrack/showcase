import "tailwindcss/dist/base.css";
import "styles/globalStyles.css";

import React from "react";
import {Web3Provider} from '@ethersproject/providers'
import {createWeb3ReactRoot, Web3ReactProvider} from "@web3-react/core";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

/*
 * This is the entry point component of this project. You can change the below exported default App component to any of
 * the prebuilt landing page components by uncommenting their import and export lines respectively.
 * See one of the landing page components to better understand how to import and render different components (Always
 * make sure if you are building your own page, the root component should be the AnimationRevealPage component. You can
 * disable the animation by using the disabled prop.
 *
 * The App component below is using React router to render the landing page that you see on the live demo website
 * and the component previews.
 *
 */
import AddressDashboardView from "./views/DashboardView/AddressDashboardView";
import TokenView from "../src/views/TokenView/TokenView";
import StakingView from "../src/views/StakingView/StakingView";
import PoolingView from "../src/views/PoolingView";
import CustomHeader from "./components/Header/CustomHeader";
import LandingView from "./views/LandingView/LandingView";
import Web3DashboardView from "./views/DashboardView/Web3DashboardView.js";
import FooterV2 from "./components/Footer/FooterV2";
import ReactGA from "react-ga";
import ConnectView from "./views/ConnectView/LandingView";
import ProtocolsView from "./views/ProtocolsView/ProtocolsView";
import ServiceLandingPage from "./demos/ServiceLandingPage";
import ProtocolView from "./views/ProtocolsView/ProtocolView";
import useProtocolsviewHooks from "./views/ProtocolsView/hooks/protocolsview-hooks";
import TermsOfService from "./pages/TermsOfService";
import TermsOfServiceView from "./views/TermsOfServiceView/TermsOfServiceView";

function getLibrary(provider) {
    const library = new Web3Provider(
        provider,
        typeof provider.chainId === 'number'
            ? provider.chainId
            : typeof provider.chainId === 'string'
                ? parseInt(provider.chainId)
                : 'any'
    )
    library.pollingInterval = 15_000
    library.detectNetwork().then((network) => {
        const networkPollingInterval = 15000
        if (networkPollingInterval) {
            console.debug('Setting polling interval', networkPollingInterval)
            library.pollingInterval = networkPollingInterval
        }
    })
    return library
}

const ga = 'UA-175320212-1'

export default function App() {
    ReactGA.initialize(ga);
    const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <Router>
                    <Switch>
                        <Route path="/dashboard">
                            <div tw="w-full bg-defaultBackground">
                                <CustomHeader/>
                                <Web3DashboardView/>
                                <FooterV2/>
                            </div>
                        </Route>
                        <Route exact path="/protocols">
                            <CustomHeader/>
                            <ProtocolsView/>
                            <FooterV2/>
                        </Route>
                        <Route exact path="/protocols/:protocol">
                            <CustomHeader/>
                            <ProtocolView/>
                            <FooterV2/>
                        </Route>
                        <Route path="/defi-hub">
                            <CustomHeader showUserLink={false}/>
                            <ConnectView/>
                            <FooterV2/>
                        </Route>
                        <Route path="/terms-of-service">
                            <CustomHeader showUserLink={false} />
                            <TermsOfServiceView  />
                            <FooterV2 />
                        </Route>
                        <Route path="/test">
                            <ServiceLandingPage/>
                        </Route>
                        <Route path="/account/:user">
                            <CustomHeader/>
                            <AddressDashboardView/>
                            <FooterV2/>
                        </Route>
                        <Route path="/tokens/:network/:token">
                            <CustomHeader/>
                            <TokenView/>
                            <FooterV2/>
                        </Route>
                        <Route path="/staking/:network/:protocol/:selectedStakingId">
                            <CustomHeader/>
                            <StakingView/>
                            <FooterV2/>
                        </Route>
                        <Route exact path="/pooling/:network/:protocol/:selectedPoolingMarketId">
                            <CustomHeader/>
                            <PoolingView/>
                            <FooterV2/>
                        </Route>
                        <Route>
                            <CustomHeader expanded={true} showUserLink={false}/>
                            <LandingView/>
                            <FooterV2/>
                        </Route>
                    </Switch>
                </Router>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    );
}
