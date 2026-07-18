import React, { useState, useEffect } from 'react';
import { ExoskeletonService } from '../services/api';
import { ExoSessionLiveState } from '../types';
import { io, Socket } from 'socket.io-client';
import { Play, Pause, Square, AlertOctagon, RotateCcw } from 'lucide-react';

interface LiveSessionViewProps {
  sessionId: number;
  onBack: () => void;
}

export default function LiveSessionView({ sessionId, onBack }: LiveSessionViewProps) {
  const [exoState, setExoState] = useState<ExoSessionLiveState | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch initial state
    const fetchState = async () => {
      try {
        const res = await ExoskeletonService.getState(sessionId);
        setExoState(res.data);
      } catch (e: any) {
        if (e.response && e.response.status === 404) {
          // Auto-init if not exists
          try {
            await ExoskeletonService.initSession(sessionId, 300); // Default 5 mins for now
            const res2 = await ExoskeletonService.getState(sessionId);
            setExoState(res2.data);
          } catch (initErr) {
            setError('Failed to initialize exoskeleton session.');
          }
        } else {
          setError('Failed to fetch exoskeleton state.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchState();

    // 2. Setup WebSocket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_session', sessionId);
    });

    newSocket.on('exo:state_update', (data: ExoSessionLiveState) => {
      if (data.session_id === sessionId) {
        setExoState(data);
      }
    });

    return () => {
      newSocket.emit('leave_session', sessionId);
      newSocket.disconnect();
    };
  }, [sessionId]);

  const handleAction = async (action: 'start' | 'pause' | 'resume' | 'stop' | 'emergencyStop') => {
    try {
      if (action === 'start') await ExoskeletonService.start(sessionId);
      if (action === 'pause') await ExoskeletonService.pause(sessionId);
      if (action === 'resume') await ExoskeletonService.resume(sessionId);
      if (action === 'stop') await ExoskeletonService.stop(sessionId);
      if (action === 'emergencyStop') await ExoskeletonService.emergencyStop(sessionId);
    } catch (e: any) {
      alert(`Action failed: ${e.response?.data?.message || e.message}`);
    }
  };

  if (loading) return <div className="p-8">Connecting to hardware...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!exoState) return <div className="p-8">State unavailable.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
          ← Back to Sessions
        </button>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Live Session Control</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {exoState.state === 'emergency_stop' && (
            <div className="absolute inset-0 bg-red-500/10 animate-pulse border-2 border-red-500 rounded-2xl pointer-events-none" />
          )}
          
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">System State</h2>
          
          <div className="text-5xl font-black mb-2 capitalize" style={{
            color: exoState.state === 'running' ? '#10b981' : 
                   exoState.state === 'emergency_stop' ? '#ef4444' : 
                   exoState.state === 'paused' ? '#f59e0b' : '#3b82f6'
          }}>
            {exoState.state}
          </div>
          
          <div className="text-slate-500 font-medium">Motor: {exoState.motor_state}</div>
        </div>

        {/* Timer Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {exoState.state === 'countdown' ? 'Starting In' : 'Elapsed Time'}
          </h2>
          
          {exoState.state === 'countdown' ? (
            <div className="text-7xl font-black text-amber-500">{exoState.countdown_remaining}</div>
          ) : (
            <div className="text-7xl font-black text-slate-800 dark:text-white font-mono">
              {Math.floor((exoState.elapsed_seconds || 0) / 60).toString().padStart(2, '0')}:
              {((exoState.elapsed_seconds || 0) % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Exoskeleton Controls</h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {(exoState.state === 'pending' || exoState.state === 'stopped') && (
            <button 
              onClick={() => handleAction('start')}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95"
            >
              <Play className="w-6 h-6 fill-current" />
              START
            </button>
          )}

          {exoState.state === 'running' && (
            <button 
              onClick={() => handleAction('pause')}
              className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95"
            >
              <Pause className="w-6 h-6 fill-current" />
              PAUSE
            </button>
          )}

          {exoState.state === 'paused' && (
            <button 
              onClick={() => handleAction('resume')}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-6 h-6" />
              RESUME
            </button>
          )}

          {(exoState.state === 'running' || exoState.state === 'paused' || exoState.state === 'countdown') && (
            <button 
              onClick={() => handleAction('stop')}
              className="flex items-center gap-2 px-8 py-4 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-slate-500/30 hover:scale-105 active:scale-95"
            >
              <Square className="w-6 h-6 fill-current" />
              STOP
            </button>
          )}

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-4" />

          {/* Emergency Stop - Always available unless already emergency stopped or completed */}
          {exoState.state !== 'emergency_stop' && exoState.state !== 'completed' && (
            <button 
              onClick={() => handleAction('emergencyStop')}
              className="flex items-center gap-2 px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-2xl transition-all shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 w-full justify-center"
            >
              <AlertOctagon className="w-8 h-8" />
              EMERGENCY STOP
            </button>
          )}
          
          {exoState.state === 'emergency_stop' && (
            <button 
              onClick={() => handleAction('start')}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 w-full justify-center"
            >
              <RotateCcw className="w-6 h-6" />
              RESTART SYSTEM
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
