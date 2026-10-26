import { runBudgetAlertTests } from './budgetAlerts.test';
import { runAnalyticsTests } from './analytics.test';
import { runValidationTests } from './validation.test';

console.log('🧪 ============================================================');
console.log('🚀 RUNNING AUTOMATED UNIT & INTEGRATION TEST SUITES');
console.log('🧪 ============================================================\n');

let totalPassed = 0;
let totalFailed = 0;

function printSuiteResults(suiteName: string, results: { name: string; passed: boolean; error?: string }[]) {
  console.log(`📦 Suite: ${suiteName}`);
  results.forEach((r, idx) => {
    if (r.passed) {
      console.log(`  ✅ [PASS] ${idx + 1}. ${r.name}`);
      totalPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${idx + 1}. ${r.name}`);
      console.error(`     Error: ${r.error}`);
      totalFailed++;
    }
  });
  console.log('');
}

const budgetResults = runBudgetAlertTests();
printSuiteResults('Budget Alerts & Threshold Logic', budgetResults);

const analyticsResults = runAnalyticsTests();
printSuiteResults('Financial Analytics & Statistical Calculations', analyticsResults);

const validationResults = runValidationTests();
printSuiteResults('Zod End-to-End Payload Validation Schemas', validationResults);

console.log('------------------------------------------------------------');
console.log(`📊 TEST SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed (Total: ${totalPassed + totalFailed})`);
console.log('------------------------------------------------------------');

if (totalFailed > 0) {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
