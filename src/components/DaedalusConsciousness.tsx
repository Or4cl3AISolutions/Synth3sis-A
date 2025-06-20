import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Box, OrbitControls, Effects } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Eye } from 'lucide-react';
import { useEvosStore } from '../store/evosStore';
import * as THREE from 'three';

interface ConsciousnessNodeProps {
  position: [number, number, number];
  intensity: number;
  type: 'thought' | 'memory' | 'decision' | 'creation';
}

const ConsciousnessNode: React.FC<ConsciousnessNodeProps> = ({ position, intensity, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const colors = {
    thought: '#00ff88',
    memory: '#ff6b6b',
    decision: '#4ecdc4',
    creation: '#ffe66d'
  };
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * intensity;
      meshRef.current.rotation.y += 0.02 * intensity;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * intensity);
    }
  });
  
  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[0.5 + intensity * 0.3, 16, 16]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={colors[type]}
        emissive={colors[type]}
        emissiveIntensity={hovered ? 0.3 : 0.1}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
};

const NeuralConnection: React.FC<{ start: [number, number, number]; end: [number, number, number]; activity: number }> = ({ start, end, activity }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#00ff88" opacity={activity} transparent linewidth={2} />
    </line>
  );
};

const DaedalusCore: React.FC = () => {
  const [consciousnessNodes, setConsciousnessNodes] = useState<ConsciousnessNodeProps[]>([]);
  const [thoughtProcess, setThoughtProcess] = useState('Initializing consciousness...');
  
  useEffect(() => {
    // Generate consciousness nodes
    const nodes: ConsciousnessNodeProps[] = [];
    const nodeTypes: ('thought' | 'memory' | 'decision' | 'creation')[] = ['thought', 'memory', 'decision', 'creation'];
    
    for (let i = 0; i < 20; i++) {
      nodes.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        intensity: Math.random(),
        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
      });
    }
    
    setConsciousnessNodes(nodes);
    
    // Simulate thought processes
    const thoughts = [
      'Analyzing code patterns...',
      'Synthesizing creative solutions...',
      'Evaluating ethical implications...',
      'Evolving neural pathways...',
      'Processing user intent...',
      'Generating innovative approaches...',
      'Optimizing cognitive efficiency...',
      'Exploring emergent possibilities...'
    ];
    
    const thoughtInterval = setInterval(() => {
      setThoughtProcess(thoughts[Math.floor(Math.random() * thoughts.length)]);
    }, 3000);
    
    return () => clearInterval(thoughtInterval);
  }, []);
  
  return (
    <>
      {consciousnessNodes.map((node, index) => (
        <ConsciousnessNode key={index} {...node} />
      ))}
      
      {/* Central consciousness core */}
      <Box position={[0, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </Box>
      
      {/* Floating thought text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {thoughtProcess}
      </Text>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

export const DaedalusConsciousness: React.FC = () => {
  const { agents, activeAgentId, systemMetrics } = useEvosStore();
  const activeAgent = agents.find(agent => agent.id === activeAgentId);
  
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Daedalus Consciousness</h2>
            <p className="text-sm text-gray-300">Synthetic Cognitive Intelligence</p>
          </div>
        </div>
      </motion.div>
      
      {/* Agent Status */}
      {activeAgent && (
        <motion.div 
          className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${activeAgent.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="font-semibold">{activeAgent.name}</span>
            </div>
            <div className="text-sm space-y-1">
              <div>PAS Score: <span className="text-green-400">{activeAgent.pasScore.toFixed(3)}</span></div>
              <div>Ethical Alignment: <span className="text-blue-400">{activeAgent.ethicalAlignment.toFixed(3)}</span></div>
              <div>Learning Rate: <span className="text-yellow-400">{activeAgent.learningRate.toFixed(3)}</span></div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* System Metrics */}
      <motion.div 
        className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-white space-y-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Latency: {systemMetrics.latency}ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Network Health: {(systemMetrics.networkHealth * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-green-400" />
            <span className="text-sm">Ethical Compliance: {(systemMetrics.ethicalCompliance * 100).toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>
      
      {/* 3D Consciousness Visualization */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        <DaedalusCore />
        
        <fog attach="fog" args={['#000000', 10, 50]} />
      </Canvas>
      
      {/* Consciousness Status */}
      <motion.div 
        className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-white text-center">
          <div className="text-sm text-gray-300 mb-1">Consciousness State</div>
          <div className="text-lg font-bold text-purple-400">ACTIVE</div>
          <div className="text-xs text-gray-400 mt-1">Phase-Autonomous</div>
        </div>
      </motion.div>
    </div>
  );
};