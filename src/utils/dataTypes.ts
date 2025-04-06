
export type Role = 'General Doctor' | 'Psychiatrist' | 'Quality Assurance' | 'Healthcare IT' | 'Lab Technician';

export interface Metric {
  name: string;
  weight: number;
  score: number;
  description: string;
}

export interface Professional {
  id: string;
  name: string;
  role: Role;
  department: string;
  image?: string;
  metrics: Metric[];
  performance: number;
  salary: number;
  bonus: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface AIRecommendation {
  metric: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

export const getRoleMetrics = (role: Role): Omit<Metric, 'score'>[] => {
  switch (role) {
    case 'General Doctor':
      return [
        { name: 'Patient Satisfaction', weight: 25, description: 'Rating from patient feedback surveys' },
        { name: 'Clinical Outcomes', weight: 30, description: 'Improvement in patient health metrics' },
        { name: 'Documentation Quality', weight: 15, description: 'Completeness and accuracy of patient records' },
        { name: 'Preventive Care Measures', weight: 20, description: 'Frequency of preventive medicine application' },
        { name: 'Peer Reviews', weight: 10, description: 'Evaluation by colleagues and senior staff' }
      ];
    case 'Psychiatrist':
      return [
        { name: 'Patient Improvement & Treatment Outcomes', weight: 35, description: 'Measured improvement in patient mental health' },
        { name: 'Patient Satisfaction & Communication', weight: 25, description: 'Patient feedback on care quality' },
        { name: 'Diagnosis Accuracy & Treatment', weight: 15, description: 'Accuracy of diagnoses and treatment plans' },
        { name: 'Documentation & Reporting', weight: 15, description: 'Quality of medical documentation' },
        { name: 'Collaboration & Communication', weight: 10, description: 'Effectiveness of interdisciplinary communication' }
      ];
    case 'Quality Assurance':
      return [
        { name: 'Process Improvements', weight: 25, description: 'Number and impact of process improvements' },
        { name: 'Error Detection Rate', weight: 30, description: 'Percentage of errors detected' },
        { name: 'Protocol Compliance', weight: 20, description: 'Adherence to established protocols' },
        { name: 'Documentation Quality', weight: 15, description: 'Quality of documentation and reporting' },
        { name: 'Team Collaboration', weight: 10, description: 'Effectiveness of team communication' }
      ];
    case 'Healthcare IT':
      return [
        { name: 'System Uptime', weight: 25, description: 'Percentage of time systems are operational' },
        { name: 'Incident Response Time', weight: 25, description: 'Average time to respond to IT incidents' },
        { name: 'Project Delivery', weight: 20, description: 'On-time completion of IT projects' },
        { name: 'User Satisfaction', weight: 15, description: 'Staff satisfaction with IT services' },
        { name: 'Security Compliance', weight: 15, description: 'Adherence to security policies and regulations' }
      ];
    case 'Lab Technician':
      return [
        { name: 'Accuracy of Test Results', weight: 35, description: 'Precision and accuracy of laboratory results' },
        { name: 'Turnaround Time (TAT)', weight: 25, description: 'Speed of test completion' },
        { name: 'Sample Handling & Safety', weight: 15, description: 'Proper handling and safety protocols' },
        { name: 'Documentation & Reporting', weight: 15, description: 'Quality of test documentation' },
        { name: 'Equipment Maintenance', weight: 10, description: 'Care and calibration of lab equipment' }
      ];
    default:
      return [];
  }
};

export const calculatePerformance = (metrics: Metric[]): number => {
  if (!metrics || metrics.length === 0) return 0;
  
  const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
  const weightedScore = metrics.reduce((sum, metric) => sum + (metric.score * metric.weight), 0);
  
  return totalWeight > 0 ? weightedScore / totalWeight : 0;
};

export const calculateCompensation = (professional: Professional): number => {
  const baseBonus = professional.salary * 0.15; // Maximum bonus is 15% of salary
  return baseBonus * (professional.performance / 100); // Scale by performance percentage
};

export const getRecommendations = (metrics: Metric[], role: Role): AIRecommendation[] => {
  // Find lowest metrics
  const sortedMetrics = [...metrics].sort((a, b) => a.score - b.score);
  const recommendations: AIRecommendation[] = [];
  
  // Generate recommendations for the 2 lowest metrics
  for (let i = 0; i < Math.min(2, sortedMetrics.length); i++) {
    const metric = sortedMetrics[i];
    
    let recommendation = '';
    let impact: 'high' | 'medium' | 'low' = 'medium';
    
    // Impact based on weight
    if (metric.weight >= 30) impact = 'high';
    else if (metric.weight <= 15) impact = 'low';
    
    // Customized recommendations based on role and metric
    switch (role) {
      case 'General Doctor':
        if (metric.name === 'Patient Satisfaction') {
          recommendation = 'Consider additional communication training and schedule more time for patient consultations.';
        } else if (metric.name === 'Clinical Outcomes') {
          recommendation = 'Review recent complex cases with peers and participate in the upcoming clinical skills workshop.';
        } else if (metric.name === 'Documentation Quality') {
          recommendation = 'Utilize dictation software and templates to improve documentation efficiency and quality.';
        } else {
          recommendation = `Focus on improving ${metric.name.toLowerCase()} through targeted professional development.`;
        }
        break;
        
      case 'Psychiatrist':
        if (metric.name.includes('Patient Improvement')) {
          recommendation = 'Consider incorporating additional evidence-based therapeutic approaches and tracking patient progress more systematically.';
        } else if (metric.name.includes('Satisfaction')) {
          recommendation = 'Implement more structured feedback mechanisms and work on communication techniques.';
        } else {
          recommendation = `Develop a structured improvement plan for ${metric.name.toLowerCase()}.`;
        }
        break;
        
      case 'Quality Assurance':
        if (metric.name === 'Error Detection Rate') {
          recommendation = 'Implement additional verification stages in the QA process and utilize automated testing tools.';
        } else if (metric.name === 'Process Improvements') {
          recommendation = 'Dedicate time to process analysis and collaborate with frontline staff to identify improvement opportunities.';
        } else {
          recommendation = `Create a 90-day improvement plan focusing specifically on ${metric.name.toLowerCase()}.`;
        }
        break;
        
      case 'Healthcare IT':
        if (metric.name === 'System Uptime') {
          recommendation = 'Implement improved monitoring systems and proactive maintenance schedules.';
        } else if (metric.name === 'Incident Response Time') {
          recommendation = 'Review ticket prioritization system and optimize resource allocation during peak times.';
        } else {
          recommendation = `Consider specialized training in ${metric.name.toLowerCase()} area.`;
        }
        break;
        
      case 'Lab Technician':
        if (metric.name.includes('Accuracy')) {
          recommendation = 'Participate in accuracy improvement training and implement additional verification steps.';
        } else if (metric.name.includes('Turnaround Time')) {
          recommendation = 'Analyze workflow bottlenecks and implement process improvements to reduce wait times.';
        } else {
          recommendation = `Develop specific competencies related to ${metric.name.toLowerCase()}.`;
        }
        break;
        
      default:
        recommendation = `Focus on improving ${metric.name.toLowerCase()} through additional training and mentorship.`;
    }
    
    recommendations.push({
      metric: metric.name,
      recommendation,
      impact
    });
  }
  
  return recommendations;
};
