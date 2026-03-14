// ── C++ SAMPLE — Press Ctrl+Shift+X to analyze ──
#include <vector>
#include <unordered_map>
#include <algorithm>

// O(1)
int getFirst(std::vector<int>& arr) {
    return arr[0];
}

// O(n)
int findMax(std::vector<int>& arr) {
    int max = arr[0];
    for (auto x : arr) {
        if (x > max) max = x;
    }
    return max;
}

// O(n^2) — nested loops
void bubbleSort(std::vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0; j < arr.size() - i - 1; j++) {
            if (arr[j] > arr[j + 1])
                std::swap(arr[j], arr[j + 1]);
        }
    }
}

// O(2^n) — recursion
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// O(n) with unordered_map
std::vector<int> twoSum(std::vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}

// O(n log n)
void sortArray(std::vector<int>& arr) {
    std::sort(arr.begin(), arr.end());
}
