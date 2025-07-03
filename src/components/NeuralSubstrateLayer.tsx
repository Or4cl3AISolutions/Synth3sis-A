import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Text, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Network, Activity, Layers, Zap } from 'lucide-react';
import { useEvosStore } from '../store/evosStore';
import * as THREE from 'three';

interface NeuralClusterProps {
  position: [number, number, number];
  nodeCount: number;
  clusterType: 'transformer' | 'graph' | 'hybrid';
  activity: number;
}

const NeuralCluster: React.FC<NeuralClusterProps> = ({ position, nodeCount, clusterType, activity }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    
    const clusterColors = {
      transformer: [0.2, 0.8, 1.0],
      graph: [1.0, 0.4, 0.8],
      hybrid: [0.8, 1.0, 0.2]
    };
    
    const baseColor = clusterColors[clusterType];
    
    for (let i = 0; i < nodeCount; i++) {
      // Spherical distribution around cluster center
      const radius = Math.random() * 2 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = position[0] + radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = position[1] + radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = position[2] + radius * Math.cos(phi);
      
      // Color variation based on activity
      colors[i * 3] = baseColor[0] * (0.5 + activity * 0.5);
      colors[i * 3 + 1] = baseColor[1] * (0.5 + activity * 0.5);
      colors[i * 3 + 2] = baseColor[2] * (0.5 + activity * 0.5);
    }
    
    return [positions, colors];
  }, [nodeCount, clusterType, activity, position]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.005 * activity;
      pointsRef.current.rotation.x += 0.003 * activity;
    }
  });
  
  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </Points>
  );
};

const NeuralConnection: React.FC<{ 
  start: [number, number, number]; 
  end: [number, number, number]; 
  strength: number;
  type: 'excitatory' | 'inhibitory' | 'modulatory';
}> = ({ start, end, strength, type }) => {
  const lineRef = useRef<any>(null);
  
  const colors = {
    excitatory: '#00ff88',
    inhibitory: '#ff4444',
    modulatory: '#ffaa00'
  };
  
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2 * strength;
    }
  });
  
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line ref={lineRef} points={points}>
      <lineBasicMaterial 
        color={colors[type]} 
        transparent 
        opacity={strength}
        linewidth={strength * 3}
      />
    </Line>
  );
};

const NeuralSubstrate: React.FC = () => {
  const [processingLoad, setProcessingLoad] = useState(0.7);
  
  const clusters = useMemo(() => [
    { position: [-5, 2, 0] as [number, number, number], nodeCount: 200, clusterType: 'transformer' as const, activity: 0.8 },
    { position: [5, 2, 0] as [number, number, number], nodeCount: 150, clusterType: 'graph' as const, activity: 0.6 },
    { position: [0, -2, 3] as [number, number, number], nodeCount: 300, clusterType: 'hybrid' as const, activity: 0.9 },
    { position: [0, 4, -3] as [number, number, number], nodeCount: 180, clusterType: 'transformer' as const, activity: 0.5 },
  ], []);
  
  const connections = useMemo(() => [
    { start: [-5, 2, 0] as [number, number, number], end: [5, 2, 0] as [number, number, number], strength: 0.8, type: 'excitatory' as const },
    { start: [0, -2, 3] as [number, number, number], end: [-5, 2, 0] as [number, number, number], strength: 0.6, type: 'modulatory' as const },
    { start: [0, -2, 3] as [number, number, number], end: [5, 2, 0] as [number, number, number], strength: 0.7, type: 'excitatory' as const },
    { start: [0, 4, -3] as [number, number, number], end: [0, -2, 3] as [number, number, number], strength: 0.5, type: 'inhibitory' as const },
  ], []);
  
  return (
    <>
      {clusters.map((cluster, index) => (
        <NeuralCluster key={index} {...cluster} />
      ))}
      
      {connections.map((connection, index) => (
        <NeuralConnection key={index} {...connection} />
      ))}
      
      {/* Central processing hub */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4444ff"
          emissiveIntensity={processingLoad * 0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Neural Substrate Core
      </Text>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

export const NeuralSubstrateLayer: React.FC = () => {
  const { neuralNodes, systemMetrics } = useEvosStore();
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  
  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-900 via-indigo-900 to-black relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <Network className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Neural Substrate Layer</h2>
            <p className="text-sm text-gray-300">Hybrid Transformer + Graph Neural Networks</p>
          </div>
        </div>
      </motion.div>
      
      {/* Processing Stats */}
      <motion.div 
        className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-white space-y-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm">Processing Load: {(systemMetrics.memoryUsage * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Active Nodes: {neuralNodes.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Throughput: {systemMetrics.throughput.toFixed(2)} ops/s</span>
          </div>
        </div>
      </motion.div>
      
      {/* Neural Architecture Legend */}
      <motion.div 
        className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-white">
          <h3 className="font-semibold mb-2">Neural Architecture</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span>Transformer Clusters</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-400 rounded-full" />
              <span>Graph Neural Networks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span>Hybrid Processing</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Connection Types Legend */}
      <motion.div 
        className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-white">
          <h3 className="font-semibold mb-2">Connection Types</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-green-400" />
              <span>Excitatory</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-red-400" />
              <span>Inhibitory</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-yellow-400" />
              <span>Modulatory</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 3D Neural Network Visualization */}
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4444ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4444" />
        
        <NeuralSubstrate />
        
        <fog attach="fog" args={['#000033', 15, 40]} />
      </Canvas>
    </div>
  );
};