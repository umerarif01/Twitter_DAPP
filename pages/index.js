import Head from "next/head";
import Image from "next/image";
import Main from "./main";
import useBlockchain from "../hooks/use-blockchain";

export default function Home() {
  const { authProvider, signer } = useBlockchain();

  return (
    <div className="bg-black h-screen  text-white">
      <Head>
        <title>Twitter DAPP</title>
        <meta name="description" content="A Decentralized Twitter Clone" />
      </Head>

      <main className=""></main>
      {signer ? (
        <>
          <Main />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="mt-[200px]" />
          <h1 className="text-2xl font-bold md:text-4xl 2xl:text-5xl">
            A Decentralized Twitter Clone
          </h1>
          <Image width={250} height={250} alt="Twitter logo" src="/logo2.png" />
          <button
            className="bg-sky-500 my-4 p-3 rounded-md font-semibold animate-bounce"
            onClick={authProvider}
          >
            Connect Wallet
          </button>
          <p className="text-gray-500 text-xl">Switch to Rinkeby Testnet</p>
        </div>
      )}

      <footer className=""></footer>
    </div>
  );
}
