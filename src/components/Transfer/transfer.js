import React, { useState, useEffect, useMemo } from "react";
import Identicon from "identicon.js";
import { useMoralis, useNativeBalance } from "react-moralis";
import { useERC20Balance } from "../../hooks/useERC20Balance";
import Select from "react-select";
// import SelectAsset from "./selectasset";

const initialUserState = {
  id: "",
  address: "",
};

const addressFormatter = (str) => {
  if (str) {
    return `${str.slice(0, 6)}...${str.slice(str.length - 6)}`;
  }
  return "";
};

const fromWeiFormatter = (balance, decimal, fixed) => {
  if (!balance) return;
  while (balance.length <= decimal) {
    balance = "0" + balance;
  }
  return Number(
    parseFloat(
      balance.substring(decimal) +
        "." +
        balance.substring(balance.length - decimal, balance.length)
    )
  ).toFixed(fixed);
};

export default function Transfer() {
  const { enableWeb3, isAuthUndefined, isAuthenticated, user, Moralis } =
    useMoralis();
  const { data: balance, nativeToken } = useNativeBalance();
  const { assets } = useERC20Balance();

  const [userData, setUserData] = useState({
    id: "",
    address: "",
  });
  const [toAddress, setToAddress] = useState();
  const [amount, setAmount] = useState();
  const [asset, setAsset] = useState();
  const [assetOptions, setAssetOptions] = useState([
    {
      value: "NONE",
      label: <span>NONE</span>,
    },
  ]);
  const [fullAssets, setFullAssets] = useState();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      enableWeb3();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!assets || !balance) return;
    const arr = [
      ...assets,
      {
        balance: balance.balance,
        decimals: nativeToken.decimals,
        name: nativeToken.name,
        symbol: nativeToken.symbol,
        token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    ];
    setFullAssets(arr);
  }, [balance.formatted, assets, nativeToken]);

  useEffect(() => {
    if (fullAssets && fullAssets.length) {
      const arr = [...fullAssets];
      const options = [];

      arr.forEach((i) => {
        options.push({
          value: i.token_address,
          label: (
            <div className="d-flex justify-content-between">
              <div>
                <img
                  src={
                    i.logo || "https://etherscan.io/images/main/empty-token.png"
                  }
                  height="24px"
                  width="24px"
                />
                <span className="ms-1">{i.symbol}</span>
              </div>
              <span className="text-muted">
                {fromWeiFormatter(i.balance, Number(i.decimals), 3)}
              </span>
            </div>
          ),
        });
      });
      setAssetOptions(options);
    }
  }, [fullAssets]);

  useEffect(() => {
    if (isAuthenticated) {
      setUserData({
        id: user.id,
        address: user.attributes.accounts[0],
      });
    } else {
      setUserData(initialUserState);
    }
  }, [isAuthenticated]);

  function handleChange(asset) {
    const token = fullAssets.find(
      (token) => token.token_address === asset.value
    );
    setAsset(token);
  }

  async function transfer() {
    let options = {};
    switch (asset.token_address) {
      case "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee":
        options = {
          type: "native",
          amount: Moralis.Units.ETH(amount),
          receiver: toAddress,
        };
        break;
      default:
        options = {
          type: "erc20",
          amount: Moralis.Units.Token(amount, asset.decimals),
          receiver: toAddress,
          contractAddress: asset.token_address,
        };
    }

    setIsPending(true);
    let res = await Moralis.transfer(options);
    setIsPending(false);
    console.log(res);
  }

  return (
    <div style={{ marginTop: "130px" }} className="wrapper p-0">
      {isAuthUndefined ? (
        <div className="text-center">
          <span
            style={{ cursor: "pointer" }}
            className="text-info font-weight-bold navbar-text"
          >
            <img
              width="18px"
              src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
            />
          </span>
        </div>
      ) : isAuthenticated && userData.address != "" ? (
        <div
          style={{ borderBottom: "1px solid #ebebeb" }}
          className="mb-2 p-4 pb-2"
        >
          <div className="text-center mb-1">
            <img
              className="mx-2 rounded"
              width="40"
              height="40"
              src={`data:image/png;base64,${new Identicon(
                userData.address,
                30
              ).toString()}`}
              alt=""
            />
          </div>
          <div className="text-center">
            <span style={{ fontSize: "18px" }}>
              {addressFormatter(userData.address)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <span
            style={{ cursor: "pointer" }}
            className="text-info font-weight-bold navbar-text"
          >
            <img
              width="18px"
              src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
            />
          </span>
        </div>
      )}

      <div className="p-4">
        <div class="form-group mb-2">
          <label for="input-address">Address:</label>
          <input
            type="email"
            class="form-control"
            id="input-address"
            placeholder="Public address of a wallet"
            onChange={(e) => {
              setToAddress(`${e.target.value}`);
            }}
          />
        </div>
        <div class="form-group mb-2">
          <label for="input-amount">Amount:</label>
          <input
            class="form-control"
            id="input-amount"
            placeholder="Amount"
            onChange={(e) => {
              setAmount(`${e.target.value}`);
            }}
          />
        </div>
        <div class="form-group mb-3">
          <label for="asset">Asset:</label>
          <Select
            placeholder="Select asset"
            options={assetOptions}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          class="btn btn-primary w-100"
          onClick={() => transfer()}
          disabled={!amount || !toAddress || !asset || !isAuthenticated}
        >
          {isPending ? (
            <img
              width="18px"
              src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
            />
          ) : (
            <span>Transfer</span>
          )}
        </button>
      </div>
    </div>
  );
}
