import "./App.css";

import { ChakraProvider } from "@chakra-ui/react";
import ConnectWalletButton from "./ConnectWalletButton";

function App() {
  return (
    <ChakraProvider>
      <div className="App" style={{ marginTop: 20 }}>
        <ConnectWalletButton infuraId={process.env.REACT_APP_INFURA_ID} provider={process.env.REACT_APP_INFURA_URL} network='rinkeby' />
      </div>
    </ChakraProvider>
  );
}

export default App;
