# ── PYTHON SAMPLE — Press Ctrl+Shift+X to analyze ──

# O(1)
def get_first(arr):
    return arr[0]

# O(n)
def find_max(arr):
    max_val = arr[0]
    for x in arr:
        if x > max_val:
            max_val = x
    return max_val

# O(n^2) — nested loops
def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# O(2^n) — recursion
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# O(n) with dict — optimized two sum
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# O(n log n) — built-in sort
def sort_and_find(arr, target):
    arr.sort()
    return target in arr
