import { useMoralis } from "react-moralis";
import useInchDex from "../../hooks/useInchDex.js";
import React, { useState, useEffect, useMemo } from "react";
import TokenModal from "../modals/tokenmodal.js";

const nativeAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const chainIds = {
  "0x1": "eth",
  "0x38": "bsc",
  "0x89": "polygon",
};

export default function DEX({ chain, fromTokenArg, customTokens = {} }) {
  const { trySwap, tokenList, getQuote } = useInchDex(chain);
  const { chainId, isAuthenticated, Moralis } = useMoralis();

  const [fromModal, setFromModal] = useState({
    isOpened: false,
  });
  const [toModal, setToModal] = useState({
    isOpened: false,
  });
  const [currentTrade, setCurrentTrade] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [quote, setQuote] = useState();
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();

  function handleChangeFromAmount(event) {
    setFromAmount(event.target.value);
  }

  const tokens = useMemo(() => {
    return { ...customTokens, ...tokenList };
  }, [customTokens, tokenList]);

  useEffect(() => {
    if (toToken && fromAmount) {
      if (fromToken) setCurrentTrade({ fromToken, toToken, fromAmount, chain });
      else
        setCurrentTrade({
          fromToken: fromTokenArg,
          toToken,
          fromAmount,
          chain,
        });
    }
  }, [toToken, fromToken, fromAmount, chain]);

  useEffect(() => {
    if (currentTrade) getQuote(currentTrade).then((quote) => setQuote(quote));
  }, [currentTrade]);

  useEffect(() => {
    setFromToken(null);
    setToToken(null);
    setQuote(null);
  }, [chain]);

  function doSwap() {
    const swapHistory = Moralis.Object.extend("SwapHistory");
    const history = new swapHistory();

    console.log(history);

    history
      .save({
        fromToken: currentTrade.fromToken,
        toToken: currentTrade.toToken,
        sold: quote.fromTokenAmount,
        got: quote.toTokenAmount,
        gas: quote.estimatedGas,
        chain: chain,
      })
      .then(
        (history) => {
          console.log("object saved", history.id);
        },
        (error) => {
          console.log("Failed to create new object", error.message);
        }
      );

    console.log("here");

    trySwap(currentTrade);
  }

  return (
    <div className="dex">
      {fromModal.isOpened ? (
        <TokenModal
          setToken={setFromToken}
          closeModal={() => setFromModal({ isOpened: false })}
          tokens={tokens}
        />
      ) : null}
      {toModal.isOpened ? (
        <TokenModal
          setToken={setToToken}
          closeModal={() => setToModal({ isOpened: false })}
          tokens={tokens}
        />
      ) : null}
      <div className="wrapper">
        <header>Cryptocurrency Exchange</header>
        <div className="form">
          <div className="amount">
            <p>Enter Amount</p>
            <input
              onChange={handleChangeFromAmount}
              type="text"
              value={fromAmount}
              placeholder="Amount"
            />
          </div>
          <div className="drop-list">
            <div className="from">
              <p>From</p>
              <button
                onClick={() => setFromModal({ isOpened: true })}
                className="btn select-box p-0"
              >
                {fromToken ? (
                  <div>
                    <img
                      src={fromToken.logoURI}
                      alt="flag"
                      width={"32px"}
                      height={"32px"}
                    />
                    <span className="ms-2">{fromToken.symbol}</span>
                  </div>
                ) : (
                  <div>
                    <img
                      src={fromTokenArg.logoURI}
                      alt="flag"
                      width={"32px"}
                      height={"32px"}
                    />
                    <span className="ms-2">{fromTokenArg.symbol}</span>
                  </div>
                )}
              </button>
              {/* <small className="text-muted">
                Balance: 0 <span id="from-coin"></span>
              </small> */}
            </div>
            <div className="icon my-3">➜</div>
            <div className="to">
              <p>To</p>
              <button
                onClick={() => setToModal({ isOpened: true })}
                className="btn select-box"
              >
                {toToken ? (
                  <div>
                    <img
                      src={toToken.logoURI}
                      alt="flag"
                      width={"32px"}
                      height={"32px"}
                    />
                    <span className="ms-2">{toToken.symbol}</span>
                  </div>
                ) : (
                  <small className="text-muted">Select a token</small>
                )}
              </button>
              {/* <small className="text-muted">
                Balance: 0 <span id="to-coin"></span>
              </small> */}
            </div>
          </div>
          <div className="exchange-rate">
            {quote ? (
              <div>
                <div className="d-flex justify-content-between">
                  <small>Estimated Gas:</small>
                  <small>{quote.estimatedGas}</small>
                </div>
                <div className="d-flex justify-content-between">
                  <small>Price:</small>
                  <small>
                    {fromAmount} {quote.fromToken.symbol} ={" "}
                    {parseFloat(
                      Moralis?.Units?.FromWei(
                        quote?.toTokenAmount,
                        quote?.toToken?.decimals
                      )
                    ).toFixed(6)}{" "}
                    {quote.toToken.symbol}
                  </small>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <button
            onClick={doSwap}
            className="btn btn-primary btn-exchange"
            disabled={
              !fromAmount ||
              !toToken ||
              chainIds[chainId] !== chain ||
              !isAuthenticated
            }
          >
            {chainIds[chainId] !== chain ? (
              <span>Switch the network to {chain}</span>
            ) : (
              <span>Transfer</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
