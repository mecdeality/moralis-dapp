import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMemo, useEffect, useState } from "react";

const chainLogo = {
  eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  bsc: "https://www.pngall.com/wp-content/uploads/10/Binance-Coin-Crypto-Logo-PNG-Images.png",
  polygon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

export default function History() {
  const { Moralis } = useMoralis();

  const [histories, setHistories] = useState();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function getHistories() {
      const swapHistory = Moralis.Object.extend("SwapHistory");
      const query = new Moralis.Query(swapHistory);
      const histories = await query.find();
      setHistories(histories);
    }
    getHistories();
  }, []);

  if (histories) console.log(histories);

  return (
    <div style={{ width: "850px", marginTop: "130px" }}>
      <h5>📜Exchange History</h5>
      <div className="wrapper p-0 w-100 table-responsive">
        <table className="table table-borderless table-striped">
          <thead className="table-primary ">
            <tr>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Sold</th>
              <th scope="col">Got</th>
              <th scope="col">Gas</th>
              <th scope="col">Date</th>
              <th scope="col">Chain</th>
            </tr>
          </thead>
          <tbody>
            {histories ? (
              histories.map((h) => (
                <tr key={h.attributes.id}>
                  <td>
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                      }}
                      src={h.attributes.fromToken.logoURI}
                    />
                    <span>{h.attributes.fromToken.symbol}</span>
                  </td>
                  <td>
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                      }}
                      src={h.attributes.toToken.logoURI}
                    />
                    <span>{h.attributes.toToken.symbol}</span>
                  </td>
                  <td>
                    <span className="badge bg-danger">
                      {Moralis.Units.FromWei(
                        h.attributes.sold,
                        h.attributes.fromToken.decimals
                      )}{" "}
                      {h.attributes.fromToken.symbol}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-success">
                      {Number.parseFloat(
                        Moralis.Units.FromWei(
                          h.attributes.got,
                          h.attributes.toToken.decimals
                        )
                      ).toFixed(3)}{" "}
                      {h.attributes.toToken.symbol}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {h.attributes.gas}
                    </span>
                  </td>
                  <td>
                    <span>
                      {h.attributes.createdAt.toDateString()}
                      {", "}
                      {h.attributes.createdAt.toLocaleTimeString()}
                    </span>
                  </td>
                  <td>
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                      }}
                      src={chainLogo[h.attributes.chain]}
                    />
                    <span>{h.attributes.chain}</span>
                  </td>
                </tr>
              ))
            ) : (
              // <tr>
              <td colspan="7" className="bg-white">
                <div className="text-center my-4">
                  <i
                    className="fa fa-folder-open-o"
                    style={{ fontSize: "64px", opacity: "0.2" }}
                    aria-hidden="true"
                  ></i>
                  <br />
                  <span
                    className="text-center"
                    style={{ fontSize: "16px", opacity: "0.2" }}
                    aria-hidden="true"
                  >
                    No Data
                  </span>
                </div>
              </td>
              // </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
