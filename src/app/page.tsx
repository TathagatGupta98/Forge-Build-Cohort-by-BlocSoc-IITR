"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">

      <div className="absolute top-6 right-6">
        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg"
          >
            Connect Wallet
          </button>
        ) : (
          <button 
            onClick={() => disconnect()}
            className="bg-white border text-red-500 px-4 py-2 rounded-full font-bold text-sm hover:bg-red-50 transition shadow-sm"
          >
            {address?.slice(0,6)}...{address?.slice(-4)} (Disconnect)
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          The Future of <span className="text-indigo-600">Stablecoins</span>
        </h1>
        <p className="max-w-md text-slate-500 text-lg">
          Mint algorithmic stablecoins, provide liquidity, and swap assets on the Sepolia Testnet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
          
          <Link href="/TSC" className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1 transition duration-300">
            <h3 className="font-bold text-xl text-slate-800">Tathagat Stable Coin Vault</h3>
            <p className="text-m text-gray-400 mt-2">Mint Stablecoins (1:10000)</p>
          </Link>
          
          <Link href="/GSC" className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1 transition duration-300">
            
            <h3 className="font-bold text-xl text-slate-800">Gold Stable Coin Vault</h3>
            <p className="text-m text-gray-400 mt-2">Mint Gold Coins (1:1000)</p>
          </Link>

          <Link href="/AMM" className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-black hover:-translate-y-1 transition duration-300">
            
            <h3 className="font-bold text-xl text-slate-800">Exchange</h3>
            <p className="text-m text-gray-400 mt-2">Swap Tokens & Add to Liquidity Pool</p>
          </Link>

        </div>
      </div>
    </main>
  );
}