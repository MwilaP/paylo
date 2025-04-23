import { Deduction } from "@/lib/db/models/payroll-structure.model";

export interface PayrollDeductions {
  [key: string]: {
    type: 'fixed' | 'percentage';
    value: number;
    preTax: boolean;
  };
}

export function calculateDeductions(grossSalary: number, deductions: Deduction[]) {
  const deductionsCalculation: PayrollDeductions = {};
  
  deductions.forEach(deduction => {
    if (deduction.type === 'percentage') {
      deductionsCalculation[deduction.id] = {
        type: 'percentage',
        value: (grossSalary * (deduction.value / 100)),
        preTax: deduction.preTax
      };
    } else {
      deductionsCalculation[deduction.id] = {
        type: 'fixed',
        value: deduction.value,
        preTax: deduction.preTax
      };
    }
  });

  return deductionsCalculation;
}

export function calculateNetSalary(
  basicSalary: number, 
  allowances: {type: 'fixed' | 'percentage', value: number}[],
  deductions: Deduction[]
) {
  // Calculate total allowances
  const totalAllowances = allowances.reduce((total, allowance) => {
    if (allowance.type === 'fixed') {
      return total + allowance.value;
    }
    return total + (basicSalary * allowance.value) / 100;
  }, 0);

  const grossSalary = basicSalary + totalAllowances;

  // Calculate deductions
  const calculatedDeductions = calculateDeductions(grossSalary, deductions);
  const totalDeductions = Object.values(calculatedDeductions)
    .reduce((sum, deduction) => sum + deduction.value, 0);

  return {
    grossSalary,
    totalAllowances,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
    deductions: calculatedDeductions
  };
}