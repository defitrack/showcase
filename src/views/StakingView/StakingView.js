import React, {useEffect} from 'react';
import FarmingView from "../FarmingView/FarmingView";
import useStakingViewHooks from "./hooks/stakingview-hooks";
import tw from "twin.macro";
import ReactGA from "react-ga";

export default function StakingView() {
    const tokenViewHooks = useStakingViewHooks()

    const {
        token,
        activeFarmingElement,
    } = tokenViewHooks

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, [])


    const detail = function () {
        if (token == null) {
            return <></>
        }

        if (activeFarmingElement !== null) {
            return (
                <>
                    <FarmingView token={token} farmingElement={activeFarmingElement}/>
                </>
            );
        } else {
            return (
                <></>
            );
        }
    }();

    if (token !== null) {
        return <>
            <div tw="mx-4 mt-4 flex flex-wrap lg:mx-64">
                {detail}
            </div>
        </>;
    } else {
        return (
            <></>
        )
    }
};