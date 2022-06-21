import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import {SectionHeading, Subheading as SubheadingBase} from "components/misc/Headings.js";
import {PrimaryButton as PrimaryButtonBase} from "components/misc/Buttons.js";
import StatsIllustrationSrc from "images/stats-illustration.svg";
import {ReactComponent as SvgDotPattern} from "images/dot-pattern.svg";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto relative`;
const TextColumn = styled(Column)(props => [
    tw`md:w-7/12 mt-16 md:mt-0`,
    props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
    `background-image: url("${props.imageSrc}");`,
    tw`rounded bg-contain bg-no-repeat bg-center h-full`
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
    SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;
const PrimaryButton = tw(PrimaryButtonBase)`mt-8 md:mt-10 text-sm inline-block mx-auto md:mx-0`;

const DecoratorBlob = styled(SvgDotPattern)(props => [
    tw`w-20 h-20 absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 fill-current text-primary-500 -z-10`
]);

export default function ConnectWalletSection({
                                                 login,
                                                 imageSrc = StatsIllustrationSrc,
                                                 imageCss = null,
                                                 imageContainerCss = null,
                                                 imageInsideDiv = true,
                                                 textOnLeft = true
                                             }) {
    return (
        <Container>
            <TwoColumn css={!imageInsideDiv && tw`md:items-center`}>
                <ImageColumn css={imageContainerCss}>
                    <Image imageSrc={imageSrc} css={imageCss}/>
                    <DecoratorBlob/>
                </ImageColumn>
                <TextColumn textOnLeft={textOnLeft}>
                    <TextContent>
                        <Subheading>Enable your wallet to access this feature.</Subheading>
                        <Heading>Connect your web3 wallet.</Heading>
                        <Description>
                            In order to manage your own account, you can log in using your web3 wallet.
                        </Description>

                        <PrimaryButton onClick={login}>
                            Connect
                        </PrimaryButton>
                    </TextContent>
                </TextColumn>
            </TwoColumn>
        </Container>
    );
};


export function ChangeNetworkSectionOld({currentNetwork, requiredChainId}) {
    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="text-center hero-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">
                            Network Change Required
                        </h1>
                        <p className="mb-5">
                            In order to indulge yourself in this amazing experience, you'll have to change your
                            network to {currentNetwork.name}.
                        </p>
                        <button className="btn btn-primary" onClick={
                            (e) => {
                                function decimalToHex(d, padding) {
                                    let hex = Number(d).toString(16);
                                    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

                                    while (hex.length < padding) {
                                        hex = "0" + hex;
                                    }

                                    return hex;
                                }


                                let chainId = decimalToHex(requiredChainId);
                                window.ethereum.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{chainId: "0x" + chainId}], // chainId must be in hexadecimal numbers
                                })
                            }
                        }>Change Network
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}