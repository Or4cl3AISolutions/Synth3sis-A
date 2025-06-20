import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Text, OrbitControls, Ring } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Shield, Scale, Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useEvosStore } from '../store/evosStore';
import * as THREE from 'three';

interface EthicalDecisionNode {
  id: string;
  position: [number, number, number];
  decisionType: 'ethical' | 'autonomy' | 'negotiation' | 'validation';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  confidence: number;
}

const DecisionNode: React.FC<EthicalDecisionNode> = ({ 
  id, 
  position, 
  decisionType, 
  status, 
  confidence 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const colors = {
    ethical: '#4ade80',
    autonomy: '#3b82f6',
    negotiation: '#f59e0b',
    validation: '#8b5cf6'
  };
  
  const statusColors = {
    pending: '#6b7280',
    approved: '#10b981',
    rejected: '#ef4444',
    under_review: '#f59e0b'
  };
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      
      // Pulsing effect based on confidence
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 * confidence;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.5, 0.5, 0.5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={colors[decisionType]}
          emissive={statusColors[status]}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          transparent
          opacity={0.8}
        />
      </Box>
      
      {/* Status indicator ring */}
      <Ring
        args={[0.6, 0.8, 16]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color={statusColors[status]}
          transparent
          opacity={0.6}
        />
      </Ring>
      
      {hovered && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`${decisionType.toUpperCase()}\n${status.replace('_', ' ').toUpperCase()}\nConfidence: ${(confidence * 100).toFixed(0)}%`}
        </Text>
      )}
    </group>
  );
};

const EthicalValidationMatrix: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [decisions, setDecisions] = useState<EthicalDecisionNode[]>([]);
  
  useEffect(() => {
    // Generate ethical decision nodes
    const newDecisions: EthicalDecisionNode[] = [];
    const types: ('ethical' | 'autonomy' | 'negotiation' | 'validation')[] = 
      ['ethical', 'autonomy', 'negotiation', 'validation'];
    const statuses: ('pending' | 'approved' | 'rejected' | 'under_review')[] = 
      ['pending', 'approved', 'rejected', 'under_review'];
    
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 3 + (i % 4) * 1.5;
      const height = Math.sin(angle * 2) * 2;
      
      newDecisions.push({
        id: `decision-${i}`,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        decisionType: types[i % types.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        confidence: 0.6 + Math.random() * 0.4
      });
    }
    
    setDecisions(newDecisions);
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={meshRef}>
      {decisions.map((decision) => (
        <DecisionNode key={decision.id} {...decision} />
      ))}
      
      {/* Central Sigma Matrix Core */}
      <Sphere position={[0, 0, 0]} args={[1, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff00ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        Σ-Matrix Core
      </Text>
    </group>
  );
};

const EthicalMetrics: React.FC<{ 
  ethicalScore: number; 
  autonomyLevel: number; 
  consensusStatus: boolean;
}> = ({ ethicalScore, autonomyLevel, consensusStatus }) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Ethical Validation</span>
          <span>{(ethicalScore * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${ethicalScore * 100}%` }}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Autonomy Level</span>
          <span>{(autonomyLevel * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${autonomyLevel * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {consensusStatus ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        )}
        <span className="text-sm">
          Consensus: {consensusStatus ? 'Reached' : 'In Progress'}
        </span>
      </div>
    </div>
  );
};

export const SigmaMatrixEngine: React.FC = () => {
  const { sigmaMatrix, systemMetrics } = useEvosStore();
  const [activeNegotiations, setActiveNegotiations] = useState(3);
  const [recentDecisions, setRecentDecisions] = useState([
    { id: 1, type: 'Code Evolution', status: 'approved', time: '2 min ago' },
    { id: 2, type: 'Resource Allocation', status: 'under_review', time: '5 min ago' },
    { id: 3, type: 'Agent Collaboration', status: 'approved', time: '8 min ago' },
  ]);
  
  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-900 via-pink-900 to-black relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Σ-Matrix Orchestration Engine</h2>
            <p className="text-sm text-gray-300">Ethical Validation & Agent Negotiation</p>
          </div>
        </div>
      </motion.div>
      
      {/* Ethical Metrics */}
      <motion.div 
        className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 w-64"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-white">
          <h3 className="font-semibold mb-3 flex items-center space-x-2">
            <Scale className="w-4 h-4" />
            <span>Ethical Metrics</span>
          </h3>
          <EthicalMetrics
            ethicalScore={sigmaMatrix.ethicalValidation}
            autonomyLevel={sigmaMatrix.autonomyLevel}
            consensusStatus={sigmaMatrix.consensusReached}
          />
        </div>
      </motion.div>
      
      {/* Active Negotiations */}
      <motion.div 
        className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-white">
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Active Negotiations</span>
          </h3>
          <div className="text-2xl font-bold text-purple-400">{activeNegotiations}</div>
          <div className="text-sm text-gray-300">Multi-agent consensus</div>
        </div>
      </motion.div>
      
      {/* Recent Decisions */}
      <motion.div 
        className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 w-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-white">
          <h3 className="font-semibold mb-3">Recent Decisions</h3>
          <div className="space-y-2">
            {recentDecisions.map((decision) => (
              <div key={decision.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{decision.type}</div>
                  <div className="text-gray-400 text-xs">{decision.time}</div>
                </div>
                <div className="flex items-center space-x-1">
                  {decision.status === 'approved' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : decision.status === 'under_review' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* PAS Score Display */}
      <motion.div 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="text-white text-center">
          <div className="text-sm text-gray-300 mb-1">PAS Threshold</div>
          <div className="text-3xl font-bold text-purple-400">0.91</div>
          <div className="text-xs text-gray-400">Phase-Sovereign</div>
          <div className="text-xs text-green-400 mt-1">✓ Achieved</div>
        </div>
      </motion.div>
      
      {/* 3D Sigma Matrix Visualization */}
      <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
        
        <EthicalValidationMatrix />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <fog attach="fog" args={['#220022', 8, 25]} />
      </Canvas>
    </div>
  );
};