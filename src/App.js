import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Abi from './ABI_Test.json'

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWallet] = useState('')
  const [balanceToken, setBalanceToken] = useState('');
  const [balanceBnb, setBalanceBnb] = useState('');
  const [message, setMessage] = useState('');
  const [messageBnb, setMessageBnb] = useState('');
  const [messageToken, setMessageToken] = useState('');
  const [toAddressToken, setToAddressToken] = useState('');
  const [toAddressBnb, setToAddressBbn] = useState('');
  const [quantityToken, setQuantityToken] = useState('');
  const [quantityBnb, setQuantityBnb] = useState('');

  useEffect(() => {
    connect();
  }, []);

  window.ethereum.on('accountsChanged', function (accounts) {
    connect();
  });

  async function connect(){
    if(!window.ethereum){
      return setMessage('MetaMask não esta instalada neste navegador.')
    }

    setMessage('Tentando conectar na MestaMask e obter saldo...')

    const genericErc20Abi = Abi;
    const tokenContractAddress = '0x842a432c39504b5EbB4D5Bd70A0BBb2BC7C4b4Aa';

    const address = await window.ethereum.send('eth_requestAccounts')
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider);

    const tokenContractWithSigner = contract.connect(signer);
    let balanceToken = await tokenContractWithSigner.balances(window.ethereum.selectedAddress);

    let balanceBnb = await provider.getBalance(address.result[0])
    //console.log(balance._hex)
    setBalanceToken(ethers.utils.formatEther(balanceToken._hex));
    setBalanceBnb(ethers.utils.formatEther(balanceBnb))
    setIsConnected(true)
    setWallet(address.result[0])
    setMessage('');
    console.log();
  }

  async function transferToken() {
    if(!window.ethereum){
      return setMessage('MetaMask não esta instalada neste navegador.')
    }

    setMessageToken(`Tentando transferir ${quantityToken} para ${toAddressToken}...`);

    const genericErc20Abi = Abi;
    const tokenContractAddress = '0x842a432c39504b5EbB4D5Bd70A0BBb2BC7C4b4Aa';
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner();

    const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider);

    const tokenContractWithSigner = contract.connect(signer);

    const tx = await tokenContractWithSigner.transferWithProfit(toAddressToken, ethers.utils.parseEther(quantityToken)).then((result) => {
      setMessageToken('Sucesso')
      console.log(result)
      connect()
    })
    .catch((error) => {
      if(error.code == -32603){
        setMessageToken("Saldo insuficiente")
      }
      if(error.code == 4001){
        setMessageToken("Transação rejeitada pelo usuário")
      }
      console.log(error)
    });

    console.log(tx);
  }

  async function transferBnb() {
    if(!window.ethereum){
      return setMessage('MetaMask não esta instalada neste navegador.')
    }

    setMessageBnb(`Tentando transferir ${quantityBnb} para ${toAddressBnb}...`);
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    const signer = provider.getSigner();
    ethers.utils.getAddress(toAddressBnb);//valida endereço
  
    const tx = await signer.sendTransaction({
      from: window.ethereum.selectedAddress,
      to: toAddressBnb,
      value: ethers.utils.parseEther(quantityBnb)
    }).then((result) => {
      setMessageBnb("Sucesso")
      console.log(result)
      connect()
    })
    .catch((error) => {
      if(error.code == -32603){
        setMessageBnb("Saldo insuficiente")
      }
      if(error.code == 4001){
        setMessageBnb("Transação rejeitada pelo usuário")
      }
    });
    
    console.log(tx)
    //setMessage(JSON.stringify(tx));
  }

  return (
    <div className="App">
      <header className="App-header">
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <ul className="navbar-nav">
          <p className="text text-light">{`Crypto Market Saldos:`}</p>
            {isConnected === true ? <p className="text text-light">{`BNB: ${balanceBnb} | Token: ${balanceToken}`}</p> : ''}
          </ul>
          {isConnected === true ? <p className="text text-light">Endereço: {walletAddress}</p> : <button className="btn btn-light" style={{cursor: 'pointer'}} onClick={evt => connect()}>Conectar com a MetaMask 🦊</button>}
        </div>
      </nav>
      </header>
      <div className='container-fluid'>
        <div className="container mt-3">
          {message === '' ? '' : <alert className="alert alert-warning">{message}</alert>}
        </div>
        <div className="container mt-3">
          <h2>Enviar BNB</h2>
            <div className="mb-3 mt-3">
              {messageBnb === '' ? '' : <alert className="alert alert-warning">{messageBnb}</alert>}
              <hr/>
              <label for="email">Endereço destino:</label>
              <input type="text" className="form-control" id="endereco" placeholder="Endereço destino" name="endereco" onChange={evt => setToAddressBbn(evt.target.value)} />
            </div>
            <div class="mb-3">
              <label for="pwd">Quantidade:</label>
              <input type="text" className="form-control" id="quantidade" placeholder="Quantidade" name="quantidade" onChange={evt => setQuantityBnb(evt.target.value)} />
            </div>
            <button type="submit" className="btn btn-success" onClick={evt => transferBnb()} >Pagar com BNB</button>
        </div>
        <div className="container mt-3">
          <hr/>
          <h2>Enviar Token</h2>
            <div className="mb-3 mt-3">
              {messageToken === '' ? '' : <alert className="alert alert-warning">{messageToken}</alert>}
              <hr/>
              <label for="email">Endereço destino:</label>
              <input type="text" className="form-control" id="endereco" placeholder="Endereço destino" name="endereco" onChange={evt => setToAddressToken(evt.target.value)} />
            </div>
            <div className="mb-3">
              <label for="pwd">Quantidade:</label>
              <input type="text" className="form-control" id="quantidade" placeholder="Quantidade" name="quantidade" onChange={evt => setQuantityToken(evt.target.value)} />
            </div>
            <button type="submit" className="btn btn-success" onClick={evt => transferToken()} >Pagar com Token</button>
        </div>
      </div>
    </div>
  );
}

export default App;
