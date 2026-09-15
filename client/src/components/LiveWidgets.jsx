import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Shield, TrendingUp, Sun, Flame, Award } from 'lucide-react';

export const LiveCricketWidget = () => {
  const [score, setScore] = useState({
    match: 'India vs Pakistan (T20 World Cup)',
    batting: 'IND',
    runs: 168,
    wickets: 4,
    overs: '18.2',
    status: 'India batting, Kohli 74*(42)',
  });

  useEffect(() => {
    // Connect to WebSocket to simulate socket updates
    const socketBackend = import.meta.env.VITE_API_BASE_URL || 'https://idea-news-backend.onrender.com';
    const socket = io(socketBackend);

    socket.on('cricket_score', (data) => {
      setScore(data);
    });

    // Local backup simulation if server is offline or not broadcasting
    const interval = setInterval(() => {
      setScore((prev) => {
        const overs = parseFloat(prev.overs);
        if (overs >= 20) {
          return {
            ...prev,
            overs: '0.1',
            runs: 0,
            wickets: 0,
            status: 'Innings break / New innings started!',
          };
        }

        const ballCount = Math.floor(overs * 6) + 1;
        const newOvers = (Math.floor(ballCount / 6) + (ballCount % 6) / 10).toFixed(1);

        // Add random runs or wicket
        const addedRuns = Math.random() > 0.6 ? Math.floor(Math.random() * 7) : 0;
        const gotWicket = Math.random() > 0.95 ? 1 : 0;

        return {
          ...prev,
          runs: prev.runs + addedRuns,
          wickets: Math.min(prev.wickets + gotWicket, 10),
          overs: newOvers,
          status: gotWicket
            ? 'WICKET! Bowled out!'
            : `India batting, Kohli ${74 + Math.floor(prev.runs * 0.1)}*(48)`,
        };
      });
    }, 4000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-1 px-4 text-xs font-semibold flex items-center justify-between shadow-inner">
      <div className="flex items-center gap-2 truncate">
        <Award className="h-4 w-4 text-yellow-300 animate-bounce" />
        <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black text-[9px] mr-1">LIVE CRICKET</span>
        <span className="font-bold hidden sm:inline">{score.match}:</span>
        <span>{score.batting} - {score.runs}/{score.wickets} in {score.overs} overs</span>
      </div>
      <div className="text-[11px] opacity-90 hidden md:block italic">
        {score.status}
      </div>
    </div>
  );
};

export const MarketWidget = () => {
  const [rates, setRates] = useState({
    nifty: { value: 23465.40, change: 112.50, isUp: true },
    sensex: { value: 77124.90, change: 345.80, isUp: true },
    gold: { value: 72150, change: -240, isUp: false },
    petrol: { value: 96.72, change: 0.00, isUp: true },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRates((prev) => {
        const niftyOffset = (Math.random() - 0.48) * 15;
        const sensexOffset = niftyOffset * 3.2;
        const goldOffset = (Math.random() - 0.5) * 100;
        return {
          nifty: {
            value: +(prev.nifty.value + niftyOffset).toFixed(2),
            change: +(prev.nifty.change + niftyOffset).toFixed(2),
            isUp: prev.nifty.change + niftyOffset >= 0,
          },
          sensex: {
            value: +(prev.sensex.value + sensexOffset).toFixed(2),
            change: +(prev.sensex.change + sensexOffset).toFixed(2),
            isUp: prev.sensex.change + sensexOffset >= 0,
          },
          gold: {
            value: Math.round(prev.gold.value + goldOffset),
            change: Math.round(prev.gold.change + goldOffset),
            isUp: prev.gold.change + goldOffset >= 0,
          },
          petrol: prev.petrol,
        };
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-1.5 px-4 text-[11px] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <TrendingUp className="h-3 w-3 text-red-500" />
          <span className="font-semibold text-slate-200">NIFTY 50:</span>
          <span>{rates.nifty.value}</span>
          <span className={rates.nifty.isUp ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
            {rates.nifty.isUp ? '+' : ''}{rates.nifty.change} ({rates.nifty.isUp ? '▲' : '▼'})
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-semibold text-slate-200">SENSEX:</span>
          <span>{rates.sensex.value}</span>
          <span className={rates.sensex.isUp ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
            {rates.sensex.isUp ? '+' : ''}{rates.sensex.change} ({rates.sensex.isUp ? '▲' : '▼'})
          </span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Flame className="h-3 w-3 text-yellow-500" />
          <span className="font-semibold text-slate-200">GOLD (24k/10g):</span>
          <span className="text-yellow-400 font-medium">₹{rates.gold.value}</span>
          <span className={rates.gold.isUp ? 'text-green-400' : 'text-red-400'}>
            {rates.gold.isUp ? '▲' : '▼'} {Math.abs(rates.gold.change)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-semibold text-slate-200">PETROL (Delhi):</span>
          <span className="text-blue-400">₹{rates.petrol.value}/L</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-slate-400">
        <Sun className="h-3.5 w-3.5 text-yellow-500 animate-spin-slow" />
        <span>New Delhi: 34°C, Sunny</span>
      </div>
    </div>
  );
};
