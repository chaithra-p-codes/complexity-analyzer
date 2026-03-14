// ─── SAMPLE FILE TO TEST THE COMPLEXITY ANALYZER ─────────────────────────────
// Open this file and press Ctrl+Shift+X to analyze!

// ✅ O(1) — Constant time
function getFirst(arr) {
  return arr[0];
}

// ✅ O(n) — Linear time
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// ⚠️ O(n²) — Quadratic (nested loops)
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 🔴 O(2^n) — Exponential (recursion)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 💡 O(n) with HashMap — optimized Two Sum
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}

// 📊 O(n log n) — uses built-in sort
function sortAndFind(arr, target) {
  const sorted = arr.sort((a, b) => a - b);
  return sorted.includes(target);
}
