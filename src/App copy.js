import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Abi from './ABI.json'

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWallet] = useState('')
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    connect();
  }, []);

  async function connect(){
    if(!window.ethereum){
      return setMessage('MetaMask não esta instalada neste navegador.')
    }

    const genericErc20Abi = Abi;
    const tokenContractAddress = '0x3eAFE49a902B829557F7E60035f867AfEe3A3313';
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner();

    const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider);

    const tokenContractWithSigner = contract.connect(signer);

    const tx = tokenContractWithSigner.transfer("0xCb94e7b58242fcb31870cf298823976E4aCe0971", 1);
    console.log(tx);

    /*console.log(contract)
    const transfer = await contract.transfer("0xCb94e7b58242fcb31870cf298823976E4aCe0971", 1);
    const data = await transfer.encodeABI();
    if(window.ethereum.chainId === '0x61'){
      window.ethereum
      .request({
      method: 'eth_sendTransaction',
      params: [
          {
              from: window.ethereumethereum.selectedAddress,
              to: "0x90890046cd2243777604dC2d6808d85992e1021c",
              gasPrice: '1000000',
              gas: 10,
              data: data, 
      
          },
      ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  } else {
    window.ethereum.request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x61'}]})
  }*/

    /*const address = await window.ethereum.enable()
    console.log(address)
    const signer = provider.getSigner();
    console.log(signer)*/
    // const balance = (await contract.balanceOf(await provider.getBalance(address[0]))).toString();
    // console.log(balance);

    /*setMessage('Tentando conectar na MestaMask e obter saldo...')

    await window.ethereum.send('eth_requestAccounts')

    const address = await window.ethereum.enable() 
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let balance = await provider.getBalance(address[0])
    setBalance(ethers.utils.formatEther(balance.toString()));
    setIsConnected(true)
    setWallet(address[0])
    setMessage('');
    console.log();*/
  }

  async function transfer() {
  
    if(!window.ethereum){
      return setMessage('MetaMask não esta instalada neste navegador.')
    }
  
    setMessage(`Tentando transferir ${quantity} para ${toAddress}...`);
  
    await window.ethereum.send('eth_requestAccounts');
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    const signer = provider.getSigner();
    ethers.utils.getAddress(toAddress);//valida endereço
  
    const tx = await signer.sendTransaction({
      from: window.ethereum.selectedAddress,
      to: toAddress,
      value: ethers.utils.parseEther(quantity)
    })
  
    setMessage(JSON.stringify(tx));
  }

  return (
    <div className="App">
      <header className="App-header">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <p className="text text-light">Crypto Market </p>
            {isConnected === true ? <p className="text text-light"> | Saldo: {balance}</p> : ''}
          </ul>
          {isConnected === true ? <p className="text text-light">Endereço conectado: {walletAddress}</p> : <button className="btn btn-light" style={{cursor: 'pointer'}} onClick={evt => connect()}>Conectar com a MetaMask 🦊</button>}
        </div>
      </nav>
      </header>
      <div className='container-fluid'>
      <div class="container mt-3">
        <h2>Faça uma transação</h2>
          <div class="mb-3 mt-3">
            {message === '' ? '' : <alert className="alert alert-warning">{message}</alert>}
            <hr/>
            <label for="email">Endereço destino:</label>
            <input type="text" class="form-control" id="endereco" placeholder="Endereço destino" name="endereco" onChange={evt => setToAddress(evt.target.value)} />
          </div>
          <div class="mb-3">
            <label for="pwd">Quantidade:</label>
            <input type="text" class="form-control" id="quantidade" placeholder="Quantidade" name="quantidade" onChange={evt => setQuantity(evt.target.value)} />
          </div>
          <button type="submit" class="btn btn-success" onClick={evt => transfer()} >Enviar</button>
      </div>
      </div>
    </div>
  );
}

export default App;
