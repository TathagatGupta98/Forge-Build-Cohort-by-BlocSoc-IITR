"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { GSC_CONTRACT_ABI, GSC_CONTRACT_ADDRESS } from "../../constants";

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function TGLDPage() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { writeContract, data: hash, isPending: isWalletLoading } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const isLoading = isWalletLoading || isConfirming;
  const [mode, setMode] = useState<"mint" | "burn">("mint");
  const [inputValue, setInputValue] = useState("");
  const EXCHANGE_RATE = 1000; 

  useEffect(() => {
    if (isConfirmed) setInputValue("");
  }, [isConfirmed]);

  const calculateOutput = (val: string) => {
    if (!val) return "0.00";
    const num = parseFloat(val);
    if (isNaN(num)) return "0.00";
    return mode === "mint" ? (num * EXCHANGE_RATE).toFixed(4) : (num / EXCHANGE_RATE).toFixed(4);
  };

  const handleTransaction = async () => {
    if (!inputValue) return;
    if (mode === "mint") {
      writeContract({
        address: GSC_CONTRACT_ADDRESS,
        abi: GSC_CONTRACT_ABI,
        functionName: 'deposit',
        value: parseEther(inputValue)
      });
    } else {
      writeContract({
        address: GSC_CONTRACT_ADDRESS,
        abi: GSC_CONTRACT_ABI,
        functionName: 'redeem',
        args: [parseEther(inputValue)]
      });
    } 
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 font-bold text-sm transition">
        ← Back to Home
      </Link>

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-emerald-50">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-900">Gold Stable Coin Vault</h1>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            1 ETH = {EXCHANGE_RATE} GSC
          </div>
        </div>

        {!isConnected ? (
          <div className="flex flex-col gap-3 py-10">
            {connectors.map((connector) => (
              <button key={connector.uid} onClick={() => connect({ connector })} className="w-full rounded-xl bg-slate-900 py-3 text-white font-bold hover:bg-slate-800 transition">
                Connect {connector.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs">
              <span className="font-mono text-emerald-800">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <button onClick={() => disconnect()} className="text-emerald-600 font-semibold hover:underline">Disconnect</button>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              <button onClick={() => { setMode("mint"); setInputValue(""); }} className={`rounded-lg py-2.5 text-sm font-bold transition-all ${mode === "mint" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>Deposit ETH</button>
              <button onClick={() => { setMode("burn"); setInputValue(""); }} className={`rounded-lg py-2.5 text-sm font-bold transition-all ${mode === "burn" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>Redeem GSC</button>
            </div>

            <div className="relative space-y-2">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-4">
                <label className="text-xs font-semibold text-slate-400 uppercase">You Send</label>
                <div className="flex items-center justify-between mt-1">
                  <input type="number" placeholder="0.0" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full text-3xl font-bold text-slate-900 outline-none" />
                  <span className="ml-2 font-bold text-slate-500">{mode === "mint" ? "ETH" : "GSC"}</span>
                </div>
              </div>
              <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-100 bg-white p-2 text-slate-400 shadow-sm z-10">↓</div>
              <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <label className="text-xs font-semibold text-slate-400 uppercase">You Receive</label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-3xl font-bold text-slate-900">{calculateOutput(inputValue)}</span>
                  <span className={`ml-2 font-bold ${mode === "mint" ? "text-emerald-600" : "text-emerald-600"}`}>{mode === "mint" ? "GSC" : "ETH"}</span>
                </div>
              </div>
            </div>

            <button onClick={handleTransaction} disabled={!inputValue || isLoading} className={`w-full flex items-center justify-center rounded-xl py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] ${mode === "mint" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-700"} ${(isLoading || !inputValue) ? "opacity-50 cursor-not-allowed" : ""}`}>
              {isLoading ? <><Spinner />Processing...</> : (mode === "mint" ? "Mint Tokens" : "Burn Tokens")}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}