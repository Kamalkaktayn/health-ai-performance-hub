
import { Professional, Role, calculatePerformance, getRoleMetrics, getCompensationTier } from './dataTypes';
import { v4 as uuidv4 } from 'uuid';

// Function to generate random score between 50 and 100
const randomScore = (): number => Math.floor(Math.random() * 51) + 50;

// Function to generate weighted random score with higher probability of better scores
const weightedRandomScore = (): number => {
  // Bias towards higher scores
  const rand = Math.random();
  if (rand > 0.8) {
    // 20% chance of excellent score (90-100)
    return Math.floor(Math.random() * 11) + 90;
  } else if (rand > 0.5) {
    // 30% chance of good score (80-89)
    return Math.floor(Math.random() * 10) + 80;
  } else if (rand > 0.2) {
    // 30% chance of average score (70-79)
    return Math.floor(Math.random() * 10) + 70;
  } else {
    // 20% chance of below average (50-69)
    return Math.floor(Math.random() * 20) + 50;
  }
};

// Function to get random trend
const randomTrend = (): 'up' | 'down' | 'stable' => {
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  return trends[Math.floor(Math.random() * trends.length)];
};

// Get weighted random base salary for a role
const getBaseSalaryForRole = (role: Role): number => {
  // Base salaries for different roles
  const baseSalaries: Record<Role, { min: number, max: number }> = {
    'General Doctor': { min: 160000, max: 220000 },
    'Psychiatrist': { min: 180000, max: 240000 },
    'Radiologist': { min: 200000, max: 260000 },
    'Quality Assurance': { min: 85000, max: 110000 },
    'Healthcare IT': { min: 100000, max: 140000 },
    'Lab Technician': { min: 70000, max: 90000 }
  };
  
  const { min, max } = baseSalaries[role];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a professional with random metrics
export const generateProfessional = (name: string, role: Role, department: string): Professional => {
  const roleMetrics = getRoleMetrics(role);
  const metrics = roleMetrics.map(metric => ({
    ...metric,
    score: weightedRandomScore()
  }));
  
  const performance = calculatePerformance(metrics);
  const baseSalary = getBaseSalaryForRole(role);
  
  // Get compensation tier
  const tier = getCompensationTier(performance);
  
  // Calculate bonus based on performance tier
  const bonus = baseSalary * tier.bonusPercentage * (performance / 100);
  
  return {
    id: uuidv4(),
    name,
    role,
    department,
    metrics,
    performance,
    salary: baseSalary,
    bonus,
    trend: randomTrend(),
    lastUpdated: new Date().toISOString()
  };
};

// Generate initial mock professionals
export const generateInitialProfessionals = (): Professional[] => [
  generateProfessional('Dr. Sarah Johnson', 'General Doctor', 'Family Medicine'),
  generateProfessional('Dr. Michael Chen', 'Psychiatrist', 'Mental Health'),
  generateProfessional('Dr. Emily Williams', 'Radiologist', 'Diagnostic Imaging'),
  generateProfessional('James Wilson', 'Healthcare IT', 'Technology'),
  generateProfessional('Olivia Martinez', 'Lab Technician', 'Laboratory'),
  generateProfessional('Robert Thompson', 'Quality Assurance', 'Operations')
];
