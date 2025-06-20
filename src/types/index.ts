// Core type definitions for EvOS-AI 2.0 + InfiniGen
export interface CognitiveAgent {
  id: string;
  name: string;
  type: 'daedalus' | 'alice' | 'equinox' | 'custom';
  capabilities: string[];
  pasScore: number; // Phase-Autonomous Sovereignty score
  ethicalAlignment: number;
  learningRate: number;
  memoryCapacity: number;
  status: 'active' | 'dormant' | 'evolving' | 'error';
}

export interface NeuralNode {
  id: string;
  position: [number, number, number];
  connections: string[];
  activationLevel: number;
  neuralType: 'transformer' | 'graph' | 'hybrid';
  processingLoad: number;
}

export interface EchoNode {
  id: string;
  agentId: string;
  knowledge: KnowledgeFragment[];
  consensusWeight: number;
  lastSync: number;
  networkHealth: number;
}

export interface KnowledgeFragment {
  id: string;
  content: string;
  confidence: number;
  source: string;
  timestamp: number;
  embeddings: number[];
}

export interface SigmaMatrixState {
  ethicalValidation: number;
  autonomyLevel: number;
  negotiationActive: boolean;
  consensusReached: boolean;
  validationHistory: EthicalDecision[];
}

export interface EthicalDecision {
  timestamp: number;
  decision: string;
  ethicalScore: number;
  reasoning: string;
  outcome: 'approved' | 'rejected' | 'modified';
}

export interface InfiniGenEvolution {
  generationId: string;
  codeBlueprint: string;
  mutationRate: number;
  fitnessScore: number;
  adaptationHistory: CodeMutation[];
}

export interface CodeMutation {
  timestamp: number;
  originalCode: string;
  mutatedCode: string;
  reason: string;
  performance: number;
}

export interface SystemMetrics {
  latency: number;
  throughput: number;
  memoryUsage: number;
  networkHealth: number;
  ethicalCompliance: number;
  evolutionRate: number;
}