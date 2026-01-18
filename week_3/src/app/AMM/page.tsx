"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { 
  AMM_ABI, AMM_CONTRACT_ADDRESS, 
  TSC_CONTRACT_ABI, TSC_CONTRACT_ADDRESS, 
  GSC_CONTRACT_ABI, GSC_CONTRACT_ADDRESS 
} from "../../constants";

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function AMMPage() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [activeTab, setActiveTab] = useState<"swap" | "pool">("swap");
  const [swapDirection, setSwapDirection] = useState<"TSC_TO_GSC" | "GSC_TO_TSC">("TSC_TO_GSC");
  const [inputValue, setInputValue] = useState("");
  
  const [liqTSC, setLiqTSC] = useState("");
  const [liqGSC, setLiqGSC] = useState("");

  const { data: tscReserve } = useReadContract({
    address: AMM_CONTRACT_ADDRESS, abi: AMM_ABI, functionName: "TscReserve",
    query: { refetchInterval: 2000 } 
  });
  const { data: gscReserve } = useReadContract({
    address: AMM_CONTRACT_ADDRESS, abi: AMM_ABI, functionName: "GscReserve",
    query: { refetchInterval: 2000 }
  });

  const { writeContract, data: hash, isPending: isWalletLoading } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const isLoading = isWalletLoading || isConfirming;

  useEffect(() => {
    if (isConfirmed) {
      setInputValue("");
      setLiqTSC("");
      setLiqGSC("");
    }
  }, [isConfirmed]);

  const calculateOutput = (val: string) => {
    if (!val || !tscReserve || !gscReserve) return "0.00";
    
    try {
      const amountIn = parseEther(val);
      const resTSC = tscReserve as bigint;
      const resGSC = gscReserve as bigint;

      let reserveIn, reserveOut;

      if (swapDirection === "TSC_TO_GSC") {
        reserveIn = resTSC;
        reserveOut = resGSC;
      } else {
        reserveIn = resGSC;
        reserveOut = resTSC;
      }

      const newReserveIn = reserveIn + amountIn;
      const numerator = reserveIn * reserveOut;
      const newReserveOut = numerator / newReserveIn;
      const amountOut = reserveOut - newReserveOut;

      return formatEther(amountOut);
    } catch (e) {
      return "0.00";
    }
  };

  const handleApprove = (token: "TSC" | "GSC") => {
    const contract = token === "TSC" ? TSC_CONTRACT_ADDRESS : GSC_CONTRACT_ADDRESS;
    const abi = token === "TSC" ? TSC_CONTRACT_ABI : GSC_CONTRACT_ABI;
    
    writeContract({
      address: contract,
      abi: abi,
      functionName: "approve",
      args: [AMM_CONTRACT_ADDRESS, parseEther("1000000")] 
    });
  };

  const handleSwap = () => {
    if (!inputValue) return;

    if (swapDirection === "TSC_TO_GSC") {
      writeContract({
        address: AMM_CONTRACT_ADDRESS,
        abi: AMM_ABI,
        functionName: "swapTscForGsc",
        args: [parseEther(inputValue)]
      });
    } else {
      writeContract({
        address: AMM_CONTRACT_ADDRESS,
        abi: AMM_ABI,
        functionName: "swapGscForTsc",
        args: [parseEther(inputValue)]
      });
    }
  };

  const handleAddLiquidity = () => {
    if (!liqTSC || !liqGSC) return;
    writeContract({
      address: AMM_CONTRACT_ADDRESS,
      abi: AMM_ABI,
      functionName: "intializingLiquidityPool", 
      args: [parseEther(liqTSC), parseEther(liqGSC)]
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex justify-center pt-20">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-slate-800">Automated Market Maker</h1>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button onClick={() => setActiveTab("swap")} className={`px-4 py-1 rounded text-xs font-bold transition ${activeTab === "swap" ? "bg-white shadow text-black" : "text-gray-400"}`}>Swap</button>
              <button onClick={() => setActiveTab("pool")} className={`px-4 py-1 rounded text-xs font-bold transition ${activeTab === "pool" ? "bg-white shadow text-black" : "text-gray-400"}`}>Pool</button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs mb-5">
            {isConnected ? (
              <>
                <span className="font-mono text-slate-600">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button onClick={() => disconnect()} className="text-red-500 font-semibold hover:underline">Disconnect</button>
              </>
            ) : (
              <span className="text-slate-400">Wallet not connected</span>
            )}
          </div>

          {!isConnected ? (
             <button onClick={() => connect({ connector: connectors[0] })} className="w-full bg-black text-white py-4 rounded-xl font-bold">Connect Wallet</button>
          ) : (
            <>
              {activeTab === "swap" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                    <button onClick={() => { setSwapDirection("TSC_TO_GSC"); setInputValue(""); }} className={`rounded-lg py-2.5 text-sm font-bold transition-all ${swapDirection === "TSC_TO_GSC" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>TSC → GSC</button>
                    <button onClick={() => { setSwapDirection("GSC_TO_TSC"); setInputValue(""); }} className={`rounded-lg py-2.5 text-sm font-bold transition-all ${swapDirection === "GSC_TO_TSC" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>GSC → TSC</button>
                  </div>
                  <div className="bg-white border p-4 rounded-2xl relative">
                    <label className="text-xs font-bold text-gray-400 uppercase">You Pay</label>
                    <div className="flex justify-between mt-2">
                      <input type="number" placeholder="0.0" value={inputValue} onChange={e => setInputValue(e.target.value)} className="text-3xl font-bold w-full outline-none" />
                      <span className={`px-2 py-1 rounded font-bold text-sm h-fit ${swapDirection === "TSC_TO_GSC" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {swapDirection === "TSC_TO_GSC" ? "TSC" : "GSC"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center -my-3 text-gray-300 relative z-10">↓</div>
                  <div className="bg-slate-50 border p-4 rounded-2xl">
                    <label className="text-xs font-bold text-gray-400 uppercase">You Receive (Est.)</label>
                    <div className="flex justify-between mt-2">
                      <span className="text-3xl font-bold text-slate-800">{calculateOutput(inputValue).slice(0, 8)}</span>
                      <span className={`px-2 py-1 rounded font-bold text-sm h-fit ${swapDirection === "TSC_TO_GSC" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                        {swapDirection === "TSC_TO_GSC" ? "GSC" : "TSC"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => handleApprove(swapDirection === "TSC_TO_GSC" ? "TSC" : "GSC")} className="bg-gray-100 text-xs font-bold py-2 rounded-lg hover:bg-gray-200">
                       1. Approve {swapDirection === "TSC_TO_GSC" ? "TSC" : "GSC"}
                     </button>
                     <button onClick={handleSwap} disabled={isLoading || !inputValue} className="bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50 flex justify-center items-center">
                        {isLoading ? <Spinner /> : "2. Swap"}
                     </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-100">
                    <strong>Admin Only:</strong> Only the contract owner can initialize the pool.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border p-3 rounded-xl">
                        <label className="text-xs font-bold text-gray-400">Amount TSC</label>
                        <input type="number" value={liqTSC} onChange={e => setLiqTSC(e.target.value)} placeholder="0" className="w-full text-xl font-bold outline-none" />
                    </div>
                    <div className="border p-3 rounded-xl">
                        <label className="text-xs font-bold text-gray-400">Amount GSC</label>
                        <input type="number" value={liqGSC} onChange={e => setLiqGSC(e.target.value)} placeholder="0" className="w-full text-xl font-bold outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleApprove("TSC")} className="bg-indigo-50 text-indigo-600 text-xs font-bold py-3 rounded-lg hover:bg-indigo-100">Approve TSC</button>
                    <button onClick={() => handleApprove("GSC")} className="bg-emerald-50 text-emerald-600 text-xs font-bold py-3 rounded-lg hover:bg-emerald-100">Approve GSC</button>
                  </div>

                  <button onClick={handleAddLiquidity} disabled={isLoading} className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center">
                    {isLoading ? <Spinner /> : "Initialize Liquidity"}
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}