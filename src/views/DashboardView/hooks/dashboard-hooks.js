import {useEffect, useState} from 'react';
import {useDashboardFilterHooks} from "./useDashboardFilterHooks";
import useDashboardProtocolHooks from "./useDashboardProtocolHooks";
import useDashboardWalletHooks from "./useDashboardWalletHooks";
import useDashboardScanningProgressHooks from "./useDashboardScanningProgressHooks";
import useDashboardStakingHooks from "./useDashboardStakingHooks.js";
import useDashboardLendingHooks from "./useDashboardLendingHooks";
import useDashboardClaimableHooks from "./useDashboardClaimableHooks";
import useDashboardBorrowingHooks from "./useDashboardBorrowingHooks";
import useDashboardLPHooks from "./useDashboardLPHooks";
import useDashboardNetworkHooks from "./useDashboardNetworkHooks";

export default function useDashboardHooks(account) {

    const useDashboardFilter = useDashboardFilterHooks()
    const {protocols} = useDashboardProtocolHooks();
    const {networks} = useDashboardNetworkHooks();
    const {balanceElements} = useDashboardWalletHooks(account, networks);
    const {
        setDoneScanning,
        doneScanning,
        setTotalScanning,
        totalScanning
    } = useDashboardScanningProgressHooks();

    const {stakings} = useDashboardStakingHooks(account, protocols, {setTotalScanning, setDoneScanning});
    const {lendings} = useDashboardLendingHooks(account, protocols, {setTotalScanning, setDoneScanning});
    const {claimables} = useDashboardClaimableHooks(account, protocols, {setTotalScanning, setDoneScanning});
    const {borrowings} = useDashboardBorrowingHooks(account, protocols, {setTotalScanning, setDoneScanning});
    const {lps} = useDashboardLPHooks(account, protocols, {setTotalScanning, setDoneScanning});

    function totalStaking(protocol) {
        if (stakings == null || stakings.length === 0) {
            return 0.0;
        } else {
            return stakings
                .filter(smallValueFilter)
                .filter(staking => {
                    return protocol == null || staking.protocol.name === protocol.name
                })
                .map(staking => staking.dollarValue).reduce((a, b) => a + b, 0)
        }
    }

    function totalClaimables(protocol) {
        if (claimables == null || claimables.length === 0) {
            return 0.0;
        } else {
            return claimables
                .filter(claimable => {
                    return protocol == null || claimable.protocol.name === protocol.name
                })
                .map(claimable => claimable.claimableToken.dollarValue).reduce((a, b) => a + b, 0)
        }
    }

    function totalWalletBalance() {
        if (balanceElements == null || balanceElements.length === 0) {
            return 0.0;
        } else {
            return balanceElements
                .map(balanceElement => balanceElement.dollarValue).reduce((a, b) => a + b, 0)
        }
    }

    function totalBalance() {
        return totalWalletBalance() + totalLending() + totalStaking() + totalPooling();
    }

    function totalPooling(protocol) {
        if (lps == null || lps.length === 0) {
            return 0.0
        } else {
            return lps
                .filter(smallValueFilter)
                .filter(lp => {
                    return protocol == null || lp.protocol.name === protocol.name
                })
                .map(lp => lp.dollarValue)
                .reduce((a, b) => a + b, 0);
        }
    }

    function totalLending(protocol) {
        if (lendings == null || lendings.length === 0) {
            return 0.0;
        } else {
            return lendings
                .filter(smallValueFilter)
                .filter(lending => {
                    return protocol == null || lending.protocol.name === protocol.name
                })
                .map(lending => lending.dollarValue).reduce((a, b) => a + b, 0)
        }
    }

    function totalBorrowing() {
        if (borrowings == null || borrowings.length === 0) {
            return 0;
        } else {
            return borrowings
                .filter(smallValueFilter)
                .map(borrowing => borrowing.dollarValue).reduce((a, b) => a + b, 0)
        }
    }

    function getUniqueNetworks() {
        let activeNetworks = lendings.map(lending => lending.network).concat(
            borrowings.map(borrowing => borrowing.network)
        ).concat(
            stakings.map(staking => staking.network)
        ).concat(
            balanceElements.map(balanceElement => balanceElement.network)
        ).concat(
            lps.map(lp => lp.network)
        ).concat(
            claimables.map(claimable => claimable.network)
        );

        if (activeNetworks.length > 0) {
            return Array.from(
                new Set(
                    activeNetworks
                        .map(network => network.name)
                        .map(id => {
                            return activeNetworks.find(proto => id === proto.name)
                        })
                )
            )
        } else {
            return  []
        }
    }

    function getUniqueProtocols() {
        let activeProtocols = lendings.map(lending => lending.protocol).concat(
                borrowings.map(borrowing => borrowing.protocol)
            ).concat(
                stakings.map(staking => staking.protocol)
            ).concat(
                lps.map(lp => lp.protocol)
            ).concat(
                claimables.map(claimable => claimable.protocol)
            )
        ;

        const set = Array.from(
            new Set(
                activeProtocols
                    .map(proto => proto.name)
                    .map(id => {
                        return activeProtocols.find(proto => id === proto.name)
                    })
            )
        )

        return set.map(proto => {
            return {
                ...proto,
                totalDollarValue:  totalLending(proto) + totalStaking(proto) + totalPooling(proto)
            }
        })
    }

    let smallValueFilter = element => {
        if (useDashboardFilter.hideSmallValues) {
            return element.dollarValue > 1
        } else {
            return true;
        }
    }

    const [searchAddress, setSearchAddress] = useState(null);

    return {
        searchAddress: searchAddress,
        setSearchAddress: setSearchAddress,
        address: account,
        usedProtocols: getUniqueProtocols(),
        usedNetworks: getUniqueNetworks(),
        totalScanning: totalScanning,
        doneScanning: doneScanning,
        balanceElements: balanceElements.filter(smallValueFilter),
        lps: lps.filter(smallValueFilter),
        lendings: lendings.filter(smallValueFilter),
        borrowings: borrowings.filter(smallValueFilter),
        stakings: stakings.filter(smallValueFilter),
        claimables: claimables,
        totalClaimables: totalClaimables(),
        totalWalletBalance: totalWalletBalance(),
        totalBalance: totalBalance(),
        totalStaking: totalStaking(),
        totalStakingForProtocol: totalStaking,
        totalPooling: totalPooling(),
        totalPoolingForProtocol: totalPooling,
        totalLending: totalLending(),
        totalLendingForProtocol: totalLending,
        totalBorrowing: totalBorrowing(),
        totalBorrowingForProtocol: totalBorrowing,
        ...useDashboardFilter
    }
}