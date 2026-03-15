// ── JAVA SAMPLE — Press Ctrl+Shift+X to analyze ──
import java.util.HashMap;
import java.util.Arrays;

public class sample {

    // O(1)
    public int getFirst(int[] arr) {
        return arr[0];
    }

    // O(n)
    public int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
       
        return max;
    }

    // O(n^2) — nested loops
    public void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // O(2^n) — recursion
    public int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    // O(n) with HashMap
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[]{map.get(complement), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    // O(n log n)
    public void sortArray(int[] arr) {
        Arrays.sort(arr);
    }
    public int binarySearch(int arr[],int target)
    {
        int low=0,high=arr.length-1,mid;
        while(low<=high)
        {
            mid=(low+(high-low))/2;
            if(arr[mid]==target)
                return mid;
            else if(arr[mid]<target)
                low=mid+1;
            else
                high=mid-1;
        }
        return -1;
    }
}
