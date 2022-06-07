import { useMoralis } from "react-moralis";

const styles = {
  connector: {
    width: "100px",
    textAlign: "center",
    cursor: "pointer",
  },
  connectorNotAllowed: {
    width: "100px",
    textAlign: "center",
    cursor: "not-allowed",
    opacity: "0.4",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    width: "50px",
  },
};

export default function AuthModal(props) {
  const { logout, authenticate, user } = useMoralis();

  const connectMetamask = async () => {
    // let checkUser = user;
    // if (!checkUser) {
    try {
      await authenticate({ signingMessage: "Connect a wallet" });
    } catch (error) {
      console.log(error);
    }
    // }
    props.closeModal();
  };

  return (
    <div className="modal d-block mt-5" tabIndex="-1" role="dialog">
      <div className="modal-dialog" style={{ width: "300px" }} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Connect Wallet</h5>
            <button
              onClick={props.closeModal}
              type="button"
              className="close btn p-1"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true" className="h4">
                &times;
              </span>
            </button>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-around flex-wrap">
              <div
                onClick={connectMetamask}
                className="mb-4"
                style={styles.connector}
              >
                <img
                  style={styles.icon}
                  src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
                />
                <span>Metamask</span>
              </div>
              <div className="mb-4" style={styles.connectorNotAllowed}>
                <img
                  style={styles.icon}
                  src="https://api.nuget.org/v3-flatcontainer/walletconnect.core/1.6.6/icon"
                />
                <span>WalletConnect</span>
              </div>
              <div className="mb-4" style={styles.connectorNotAllowed}>
                <img
                  style={styles.icon}
                  src="https://trustwallet.com/assets/images/media/assets/trust_platform.svg"
                />
                <span>TrustWallet</span>
              </div>
              <div className="mb-4" style={styles.connectorNotAllowed}>
                <img
                  style={styles.icon}
                  src="http://medishares.oss-cn-hongkong.aliyuncs.com/logo/math/Logo_Icon_black.png"
                />
                <span>MathWallet</span>
              </div>
              <div className="mb-4" style={styles.connectorNotAllowed}>
                <img
                  style={styles.icon}
                  src="https://s2.coinmarketcap.com/static/img/coins/200x200/5947.png"
                />
                <span>TokenPocket</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
