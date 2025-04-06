
import { Professional, Role, calculatePerformance, getRoleMetrics } from './dataTypes';
import { v4 as uuidv4 } from 'uuid';

// Function to generate random score between 50 and 100
const randomScore = (): number => Math.floor(Math.random() * 51) + 50;

// Function to get random trend
const randomTrend = (): 'up' | 'down' | 'stable' => {
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  return trends[Math.floor(Math.random() * trends.length)];
};

// Function to generate a professional with random metrics
export const generateProfessional = (name: string, role: Role, department: string, baseSalary: number): Professional => {
  const roleMetrics = getRoleMetrics(role);
  const metrics = roleMetrics.map(metric => ({
    ...metric,
    score: randomScore()
  }));
  
  const performance = calculatePerformance(metrics);
  
  return {
    id: uuidv4(),
    name,
    role,
    department,
    metrics,
    performance,
    salary: baseSalary,
    bonus: baseSalary * 0.15 * (performance / 100),
    trend: randomTrend(),
    lastUpdated: new Date().toISOString()
  };
};

// Generate initial mock professionals
export const generateInitialProfessionals = (): Professional[] => [
  generateProfessional('Dr. Sarah Johnson', 'General Doctor', 'Family Medicine', 180000),
  generateProfessional('Dr. Michael Chen', 'Psychiatrist', 'Mental Health', 210000),
  generateProfessional('Dr. Emily Williams', 'Radiologist', 'Diagnostic Imaging', 225000),
  generateProfessional('James Wilson', 'Healthcare IT', 'Technology', 120000),
  generateProfessional('Olivia Martinez', 'Lab Technician', 'Laboratory', 80000),
  generateProfessional('Robert Thompson', 'Quality Assurance', 'Operations', 95000)
];
