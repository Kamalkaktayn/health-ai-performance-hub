import { Professional, Role, calculatePerformance, getRoleMetrics, getCompensationTier, Skill } from './dataTypes';
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

// Generate random skills based on role
const generateSkills = (role: Role): Skill[] => {
  const commonSkills: Skill[] = [
    { name: 'Communication', level: Math.floor(Math.random() * 31) + 70 },
    { name: 'Teamwork', level: Math.floor(Math.random() * 31) + 70 },
    { name: 'Problem Solving', level: Math.floor(Math.random() * 31) + 70 },
  ];
  
  const roleSpecificSkills: Record<Role, Skill[]> = {
    'General Doctor': [
      { name: 'Diagnostics', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Patient Management', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Electronic Health Record Systems', level: Math.floor(Math.random() * 31) + 70 },
    ],
    'Psychiatrist': [
      { name: 'Psychological Assessment', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Therapeutic Techniques', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Medication Management', level: Math.floor(Math.random() * 26) + 75 },
    ],
    'Radiologist': [
      { name: 'Imaging Analysis', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Radiation Safety', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Advanced Visualization Techniques', level: Math.floor(Math.random() * 26) + 75 },
    ],
    'Quality Assurance': [
      { name: 'Process Auditing', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Statistical Analysis', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Regulatory Compliance', level: Math.floor(Math.random() * 26) + 75 },
    ],
    'Healthcare IT': [
      { name: 'System Administration', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Network Security', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Database Management', level: Math.floor(Math.random() * 26) + 75 },
    ],
    'Lab Technician': [
      { name: 'Sample Processing', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Equipment Operation', level: Math.floor(Math.random() * 26) + 75 },
      { name: 'Quality Control', level: Math.floor(Math.random() * 26) + 75 },
    ]
  };
  
  return [...commonSkills, ...roleSpecificSkills[role]];
};

// Generate random certifications based on role
const generateCertifications = (role: Role): string[] => {
  const roleCertifications: Record<Role, string[]> = {
    'General Doctor': [
      'Board Certified in Family Medicine',
      'Basic Life Support (BLS)',
      'Advanced Cardiac Life Support (ACLS)'
    ],
    'Psychiatrist': [
      'Board Certified in Psychiatry',
      'Cognitive Behavioral Therapy Certification',
      'American Board of Psychiatry and Neurology'
    ],
    'Radiologist': [
      'American Board of Radiology Certification',
      'Computed Tomography (CT) Specialist',
      'Magnetic Resonance Imaging (MRI) Certification'
    ],
    'Quality Assurance': [
      'Certified Quality Improvement Associate (CQIA)',
      'Six Sigma Green Belt',
      'Healthcare Quality Certification (CPHQ)'
    ],
    'Healthcare IT': [
      'Certified Healthcare CIO (CHCIO)',
      'CompTIA Healthcare IT Technician',
      'Epic Systems Certification'
    ],
    'Lab Technician': [
      'Medical Laboratory Technician (MLT) Certification',
      'Clinical Laboratory Scientist (CLS) Certification',
      'Phlebotomy Certification'
    ]
  };
  
  // Randomly select 1-3 certifications
  const certifications = roleCertifications[role];
  const numCerts = Math.floor(Math.random() * 3) + 1;
  const selectedCerts = [];
  
  for (let i = 0; i < numCerts; i++) {
    const randomIndex = Math.floor(Math.random() * certifications.length);
    if (!selectedCerts.includes(certifications[randomIndex])) {
      selectedCerts.push(certifications[randomIndex]);
    }
  }
  
  return selectedCerts;
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
  
  // Generate random AI usage percentage (40-90%)
  const aiUsage = Math.floor(Math.random() * 51) + 40;
  
  // Generate random years of experience (3-20 years)
  const yearsOfExperience = Math.floor(Math.random() * 18) + 3;
  
  // Generate email from name
  const email = `${name.toLowerCase().replace(/\s+/g, '.')}@healthperform.org`;
  
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
    lastUpdated: new Date().toISOString(),
    skills: generateSkills(role),
    aiUsage,
    yearsOfExperience,
    certifications: generateCertifications(role),
    email,
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000)}`,
    education: ['Doctor of Medicine (MD)', 'Master of Science', 'Bachelor of Science'][Math.floor(Math.random() * 3)]
  };
};

// Mock users for authentication
export const mockUsers = [
  {
    id: '1',
    email: 'admin@healthperform.org',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'manager@healthperform.org',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager'
  },
  {
    id: '3',
    email: 'viewer@healthperform.org',
    password: 'viewer123',
    name: 'Viewer User',
    role: 'viewer'
  }
];

// Generate initial mock professionals
export const generateInitialProfessionals = (): Professional[] => [
  generateProfessional('Dr. Sarah Johnson', 'General Doctor', 'Family Medicine'),
  generateProfessional('Dr. Michael Chen', 'Psychiatrist', 'Mental Health'),
  generateProfessional('Dr. Emily Williams', 'Radiologist', 'Diagnostic Imaging'),
  generateProfessional('James Wilson', 'Healthcare IT', 'Technology'),
  generateProfessional('Olivia Martinez', 'Lab Technician', 'Laboratory'),
  generateProfessional('Robert Thompson', 'Quality Assurance', 'Operations')
];
