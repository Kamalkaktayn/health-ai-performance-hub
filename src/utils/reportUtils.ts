
import { Professional } from "@/utils/dataTypes";

// Generate performance data for chart
export const generatePerformanceData = (professionals: Professional[]) => {
  return professionals.map(pro => ({
    name: pro.name,
    performance: pro.performance,
    aiUsage: pro.aiUsage,
    department: pro.department
  }));
};

// Generate AI usage data by department
export const generateAIUsageByDepartment = (professionals: Professional[]) => {
  const departmentMap = new Map<string, {count: number, totalUsage: number}>();
  
  professionals.forEach(pro => {
    if (!departmentMap.has(pro.department)) {
      departmentMap.set(pro.department, {count: 0, totalUsage: 0});
    }
    const dept = departmentMap.get(pro.department)!;
    dept.count += 1;
    dept.totalUsage += pro.aiUsage;
  });
  
  return Array.from(departmentMap.entries()).map(([department, data]) => ({
    department,
    averageAIUsage: data.totalUsage / data.count
  }));
};

// Generate compensation data
export const generateCompensationData = (professionals: Professional[]) => {
  const roleMap = new Map<string, {count: number, totalSalary: number, totalBonus: number}>();
  
  professionals.forEach(pro => {
    if (!roleMap.has(pro.role)) {
      roleMap.set(pro.role, {count: 0, totalSalary: 0, totalBonus: 0});
    }
    const role = roleMap.get(pro.role)!;
    role.count += 1;
    role.totalSalary += pro.salary;
    role.totalBonus += pro.bonus;
  });
  
  return Array.from(roleMap.entries()).map(([role, data]) => ({
    role,
    averageSalary: data.totalSalary / data.count,
    averageBonus: data.totalBonus / data.count,
    total: (data.totalSalary + data.totalBonus) / data.count
  }));
};
