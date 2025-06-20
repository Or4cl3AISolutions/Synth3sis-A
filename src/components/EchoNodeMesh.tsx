import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Text, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Globe, Wifi, Share2, Database, Sync } from 'lucide-react';
import { useEvosStore } from '../store/evosStore';
import * as THREE from 'three';

interface EchoNodeProps {
  id: string;
  position: [number, number, number];
  health: number;
  knowledge: number;
  connections: string[];
  isActive: boolean;
}

const EchoNodeSphere: React.FC<EchoNodeProps> = ({ 
  id, 
  position, 
  health, 
  knowledge, 
  connections, 
  isActive 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * health;
      
      // Pulsing effect based on activity
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * (isActive ? 1 : 0.3);
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  const nodeColor = useMemo(() => {
    if (health > 0.8) return '#00ff88';
    if (health > 0.5) return '#ffaa00';
    return '#ff4444';
  }, [health]);
  
  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.3 + knowledge * 0.2, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered ? 0.4 : (isActive ? 0.2 : 0.1)}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {hovered && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`Node: ${id.slice(0, 8)}`}
        </Text>
      )}
    </group>
  );
};

const MeshConnection: React.FC<{ 
  start: [number, number, number]; 
  end: [number, number, number]; 
  strength: number;
  dataFlow: number;
}> = ({ start, end, strength, dataFlow }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 4 + dataFlow * 10) * 0.3 * strength;
    }
  });
  
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={strength * 0.5}
        linewidth={2}
      />
    </line>
  );
};

const DataPacket: React.FC<{ 
  path: [number, number, number][];
  speed: number;
  color: string;
}> = ({ path, speed, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    setProgress((prev) => (prev + speed) % 1);
    
    if (meshRef.current && path.length > 1) {
      const segmentIndex = Math.floor(progress * (path.length - 1));
      const segmentProgress = (progress * (path.length - 1)) % 1;
      
      if (segmentIndex < path.length - 1) {
        const start = new THREE.Vector3(...path[segmentIndex]);
        const end = new THREE.Vector3(...path[segmentIndex + 1]);
        const position = start.lerp(end, segmentProgress);
        
        meshRef.current.position.copy(position);
      }
    }
  });
  
  return (
    <Sphere ref={meshRef} args={[0.05, 8, 8]}>
      <meshBasicMaterial color={color} />
    </Sphere>
  );
};

const EchoMeshNetwork: React.FC = () => {
  const { echoNodes, meshHealth } = useEvosStore();
  const [networkNodes, setNetworkNodes] = useState<EchoNodeProps[]>([]);
  const [connections, setConnections] = useState<Array<{
    start: [number, number, number];
    end: [number, number, number];
    strength: number;
    dataFlow: number;
  }>>([]);
  
  useEffect(() => {
    // Generate mesh network topology
    const nodes: EchoNodeProps[] = [];
    const nodeCount = 12;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 3;
      const height = (Math.random() - 0.5) * 4;
      
      nodes.push({
        id: `echo-node-${i}`,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        health: 0.7 + Math.random() * 0.3,
        knowledge: Math.random(),
        connections: [],
        isActive: Math.random() > 0.3
      });
    }
    
    // Create connections between nearby nodes
    const newConnections: Array<{
      start: [number, number, number];
      end: [number, number, number];
      strength: number;
      dataFlow: number;
    }> = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].position[0] - nodes[j].position[0], 2) +
          Math.pow(nodes[i].position[1] - nodes[j].position[1], 2) +
          Math.pow(nodes[i].position[2] - nodes[j].position[2], 2)
        );
        
        if (distance < 8 && Math.random() > 0.4) {
          newConnections.push({
            start: nodes[i].position,
            end: nodes[j].position,
            strength: Math.max(0.1, 1 - distance / 8),
            dataFlow: Math.random()
          });
          
          nodes[i].connections.push(nodes[j].id);
          nodes[j].connections.push(nodes[i].id);
        }
      }
    }
    
    setNetworkNodes(nodes);
    setConnections(newConnections);
  }, []);
  
  return (
    <>
      {networkNodes.map((node) => (
        <EchoNodeSphere key={node.id} {...node} />
      ))}
      
      {connections.map((connection, index) => (
        <MeshConnection key={index} {...connection} />
      ))}
      
      {/* Data packets flowing through the network */}
      {connections.slice(0, 5).map((connection, index) => (
        <DataPacket
          key={`packet-${index}`}
          path={[connection.start, connection.end]}
          speed={0.02 + Math.random() * 0.03}
          color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][index]}
        />
      ))}
      
      {/* Central mesh coordinator */}
      <Sphere position={[0, 0, 0]} args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.4}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        EchoNode Mesh
      </Text>
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

export const EchoNodeMesh: React.FC = () => {
  const { meshHealth, systemMetrics, syncEchoNodes } = useEvosStore();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete'>('idle');
  
  const handleSync = () => {
    setSyncStatus('syncing');
    syncEchoNodes();
    setTimeout(() => setSyncStatus('complete'), 2000);
    setTimeout(() => setSyncStatus('idle'), 4000);
  };
  
  return (
    <div className="h-full w-full bg-gradient-to-br from-cyan-900 via-teal-900 to-black relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-xl font-bold text-white">EchoNode Mesh Network</h2>
            <p className="text-sm text-gray-300">Decentralized Knowledge Propagation</p>
          </div>
        </div>
      </motion.div>
      
      {/* Network Status */}
      <motion.div 
        className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-white space-y-2">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-sm">Mesh Health: {(meshHealth * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Network Latency: {systemMetrics.latency}ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-sm">Knowledge Sync: {(systemMetrics.networkHealth * 100).toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>
      
      {/* Sync Control */}
      <motion.div 
        className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          onClick={handleSync}
          disabled={syncStatus === 'syncing'}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            syncStatus === 'syncing' 
              ? 'bg-yellow-600 cursor-not-allowed' 
              : syncStatus === 'complete'
              ? 'bg-green-600'
              : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          <Sync className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          <span className="text-white text-sm">
            {syncStatus === 'syncing' ? 'Syncing...' : 
             syncStatus === 'complete' ? 'Sync Complete' : 
             'Sync Network'}
          </span>
        </button>
      </motion.div>
      
      {/* CRDT Consensus Info */}
      <motion.div 
        className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-white">
          <h3 className="font-semibold mb-2">CRDT Consensus</h3>
          <div className="space-y-1 text-sm">
            <div>Conflict Resolution: Active</div>
            <div>Convergence: {(meshHealth * 100).toFixed(1)}%</div>
            <div>Partition Tolerance: High</div>
          </div>
        </div>
      </motion.div>
      
      {/* 3D Mesh Network Visualization */}
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        <EchoMeshNetwork />
        
        <fog attach="fog" args={['#001122', 10, 30]} />
      </Canvas>
    </div>
  );
};