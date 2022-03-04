import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Twitter from "../artifacts/contracts/Tweets.sol/Tweets.json";

function useBlockchain() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);

  const ContractAddress = "0x8A0aC0776340b69A8E4BADFef6fD9616290d3d3b";

  useEffect(() => {
    async function load() {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
      const addresses = await p.listAccounts();

      if (addresses.length) {
        const s = p.getSigner(addresses[0]);
        setSigner(s);
        const a = await s.getAddress();
        setAddress(a);
        const b = ethers.utils
          .formatEther((await s.getBalance()).toString())
          .substring(0, 6);
        setBalance(b);
        const c = new ethers.Contract(ContractAddress, Twitter.abi, s);
        setContract(c);
      }
    }

    load();
  }, []);

  async function authProvider() {
    await provider.send("eth_requestAccounts", []);
    const s = provider.getSigner();
    setSigner(s);
    const a = await s.getAddress();
    setAddress(a);
    const b = ethers.utils
      .formatEther((await s.getBalance()).toString())
      .substring(0, 6);
    setBalance(b);
    const c = new ethers.Contract(ContractAddress, Twitter.abi, s);
    setContract(c);
  }

  return { provider, signer, address, balance, contract, authProvider };
}

export default useBlockchain;
