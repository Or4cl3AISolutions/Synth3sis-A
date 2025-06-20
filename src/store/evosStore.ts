import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  CognitiveAgent, 
  NeuralNode, 
  EchoNode, 
  SigmaMatrixState, 
  InfiniGenEvolution,
  SystemMetrics 
} from '../types';

interface EvosState {
  // Core System State
  isInitialized: boolean;
  systemMetrics: SystemMetrics;
  
  // Cognitive Agents
  agents: CognitiveAgent[];
  activeAgentId: string | null;
  
  // Neural Substrate Layer
  neuralNodes: NeuralNode[];
  neuralConnections: Map<string, string[]>;
  
  // EchoNode Mesh Network
  echoNodes: EchoNode[];
  meshHealth: number;
  
  // Sigma Matrix Engine
  sigmaMatrix: SigmaMatrixState;
  
  // InfiniGen Evolution
  evolutionState: InfiniGenEvolution;
  
  // UI State
  selectedView: 'dashboard' | 'neural' | 'mesh' | 'sigma' | 'evolution';
  isVRMode: boolean;
  
  // Actions
  initializeSystem: () => void;
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
  addAgent: (agent: CognitiveAgent) => void;
  activateAgent: (agentId: string) => void;
  updateNeuralNetwork: (nodes: NeuralNode[]) => void;
  syncEchoNodes: () => void;
  triggerEvolution: () => void;
  setView: (view: string) => void;
  toggleVRMode: () => void;
}

export const useEvosStore = create<EvosState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    isInitialized: false,
    systemMetrics: {
      latency: 0,
      throughput: 0,
      memoryUsage: 0,
      networkHealth: 1.0,
      ethicalCompliance: 0.95,
      evolutionRate: 0.1
    },
    
    agents: [],
    activeAgentId: null,
    
    neuralNodes: [],
    neuralConnections: new Map(),
    
    echoNodes: [],
    meshHealth: 1.0,
    
    sigmaMatrix: {
      ethicalValidation: 0.95,
      autonomyLevel: 0.8,
      negotiationActive: false,
      consensusReached: true,
      validationHistory: []
    },
    
    evolutionState: {
      generationId: 'gen-0',
      codeBlueprint: '',
      mutationRate: 0.05,
      fitnessScore: 0.7,
      adaptationHistory: []
    },
    
    selectedView: 'dashboard',
    isVRMode: false,
    
    // Actions
    initializeSystem: () => {
      set({ isInitialized: true });
      
      // Initialize Daedalus agent
      const daedalus: CognitiveAgent = {
        id: 'daedalus-prime',
        name: 'Daedalus',
        type: 'daedalus',
        capabilities: ['code-generation', 'creative-synthesis', 'ethical-reasoning'],
        pasScore: 0.92,
        ethicalAlignment: 0.96,
        learningRate: 0.15,
        memoryCapacity: 1000000,
        status: 'active'
      };
      
      get().addAgent(daedalus);
      get().activateAgent(daedalus.id);
    },
    
    updateMetrics: (metrics) => {
      set(state => ({
        systemMetrics: { ...state.systemMetrics, ...metrics }
      }));
    },
    
    addAgent: (agent) => {
      set(state => ({
        agents: [...state.agents, agent]
      }));
    },
    
    activateAgent: (agentId) => {
      set({ activeAgentId: agentId });
    },
    
    updateNeuralNetwork: (nodes) => {
      set({ neuralNodes: nodes });
    },
    
    syncEchoNodes: () => {
      // Simulate CRDT consensus mechanism
      set(state => ({
        echoNodes: state.echoNodes.map(node => ({
          ...node,
          lastSync: Date.now(),
          networkHealth: Math.min(1.0, node.networkHealth + 0.01)
        }))
      }));
    },
    
    triggerEvolution: () => {
      const currentState = get().evolutionState;
      const newGeneration = `gen-${Date.now()}`;
      
      set({
        evolutionState: {
          ...currentState,
          generationId: newGeneration,
          fitnessScore: Math.min(1.0, currentState.fitnessScore + 0.05)
        }
      });
    },
    
    setView: (view) => {
      set({ selectedView: view as any });
    },
    
    toggleVRMode: () => {
      set(state => ({ isVRMode: !state.isVRMode }));
    }
  }))
);

// Initialize system on store creation
setTimeout(() => {
  useEvosStore.getState().initializeSystem();
}, 100);