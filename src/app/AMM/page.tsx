"use client";
import { useState } from "react";

export default function AMMPage() {
  const [activeTab, setActiveTab] = useState<"swap" | "pool">("swap");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex justify-center pt-20">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Market Maker</h1>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button onClick={() => setActiveTab("swap")} className={`px-4 py-1 rounded text-xs font-bold transition ${activeTab === "swap" ? "bg-white shadow text-black" : "text-gray-400"}`}>Swap</button>
              <button onClick={() => setActiveTab("pool")} className={`px-4 py-1 rounded text-xs font-bold transition ${activeTab === "pool" ? "bg-white shadow text-black" : "text-gray-400"}`}>Pool</button>
            </div>
          </div>

          {activeTab === "swap" ? (
            /* SWAP UI */
            <div className="space-y-2">
              <div className="bg-white border p-4 rounded-2xl">
                <div className="flex justify-between mb-2">
                  <input type="number" placeholder="0.0" value={input1} onChange={e => setInput1(e.target.value)} className="text-3xl font-bold w-full outline-none" />
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold text-sm h-fit">MUSD</span>
                </div>
              </div>
              
              <div className="flex justify-center -my-4 relative z-10"><div className="bg-slate-100 border-4 border-white p-2 rounded-xl">↓</div></div>

              <div className="bg-white border p-4 rounded-2xl">
                <div className="flex justify-between mb-2">
                  <input type="number" placeholder="0.0" value={input2} onChange={e => setInput2(e.target.value)} className="text-3xl font-bold w-full outline-none" />
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold text-sm h-fit">TGLD</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 mt-4">Swap</button>
            </div>
          ) : (
            /* POOL UI */
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-xl">
                Provide liquidity to earn trading fees.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-3 rounded-xl">
                    <label className="text-xs font-bold text-gray-400">Amount MUSD</label>
                    <input type="number" placeholder="0" className="w-full text-xl font-bold outline-none" />
                </div>
                <div className="border p-3 rounded-xl">
                    <label className="text-xs font-bold text-gray-400">Amount TGLD</label>
                    <input type="number" placeholder="0" className="w-full text-xl font-bold outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-indigo-100 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-200">Approve MUSD</button>
                <button className="bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-200">Approve TGLD</button>
              </div>
              <button className="w-full bg-black text-white py-4 rounded-xl font-bold">Add Liquidity</button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}