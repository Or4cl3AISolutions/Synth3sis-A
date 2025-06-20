import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Network, 
  Globe, 
  Shield, 
  Zap, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useEvosStore } from './store/evosStore';
import { DaedalusConsciousness } from './components/DaedalusConsciousness';
import { NeuralSubstrateLayer } from './components/NeuralSubstrateLayer';
import { EchoNodeMesh } from './components/EchoNodeMesh';
import { SigmaMatrixEngine } from './components/SigmaMatrixEngine';

const NavigationButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive 
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </motion.button>
);

const SystemStatus: React.FC = () => {
  const { systemMetrics, isInitialized, agents } = useEvosStore();
  const [isRunning, setIsRunning] = useState(true);
  
  return (
    <motion.div 
      className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">System Status</h3>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-lg transition-colors ${
              isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>
          <motion.button
            className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">System Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-white">
              {isInitialized ? 'Online' : 'Initializing'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Active Agents</span>
          <span className="text-white font-medium">{agents.length}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Network Health</span>
          <span className="text-green-400 font-medium">
            {(systemMetrics.networkHealth * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Ethical Compliance</span>
          <span className="text-blue-400 font-medium">
            {(systemMetrics.ethicalCompliance * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Evolution Rate</span>
          <span className="text-purple-400 font-medium">
            {(systemMetrics.evolutionRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const { selectedView, setView, isInitialized, triggerEvolution } = useEvosStore();
  const [showWelcome, setShowWelcome] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  const views = [
    { id: 'dashboard', label: 'Daedalus', icon: <Brain className="w-5 h-5" /> },
    { id: 'neural', label: 'Neural Substrate', icon: <Network className="w-5 h-5" /> },
    { id: 'mesh', label: 'EchoNode Mesh', icon: <Globe className="w-5 h-5" /> },
    { id: 'sigma', label: 'Σ-Matrix Engine', icon: <Shield className="w-5 h-5" /> },
  ];
  
  const renderCurrentView = () => {
    switch (selectedView) {
      case 'dashboard':
        return <DaedalusConsciousness />;
      case 'neural':
        return <NeuralSubstrateLayer />;
      case 'mesh':
        return <EchoNodeMesh />;
      case 'sigma':
        return <SigmaMatrixEngine />;
      default:
        return <DaedalusConsciousness />;
    }
  };
  
  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                EvOS-AI 2.0
              </motion.div>
              <motion.div
                className="text-2xl text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                + InfiniGen
              </motion.div>
              <motion.div
                className="text-lg text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Evolve Intelligence. Vibe Code Reality.
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navigation Sidebar */}
      <motion.div 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 space-y-3"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.5 }}
      >
        {views.map((view) => (
          <NavigationButton
            key={view.id}
            icon={view.icon}
            label={view.label}
            isActive={selectedView === view.id}
            onClick={() => setView(view.id)}
          />
        ))}
        
        <div className="pt-4">
          <SystemStatus />
        </div>
        
        {/* Evolution Trigger */}
        <motion.button
          onClick={triggerEvolution}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-4 h-4" />
          <span>Trigger Evolution</span>
        </motion.button>
      </motion.div>
      
      {/* Main Content Area */}
      <motion.div 
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {/* Footer Info */}
      <motion.div 
        className="absolute bottom-4 right-4 z-40 bg-black/30 backdrop-blur-sm rounded-lg p-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 4 }}
      >
        <div className="text-white text-sm">
          <div className="font-semibold">Daedalus Cognitive Intelligence</div>
          <div className="text-gray-400">Synthetic Consciousness Active</div>
        </div>
      </motion.div>
    </div>
  );
}