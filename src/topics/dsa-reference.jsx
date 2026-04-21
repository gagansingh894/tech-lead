"use client"

import { useState, useRef, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────


// ─── Code (JSON strings avoid JSX parser treating generics as JSX tags) ───────
const CODE = {
  "arrays": {
    python: "# Two Pointer + Sliding Window \u2014 runnable Python 3.11+\nfrom dataclasses import dataclass\nfrom typing import Protocol\n\n# --------------- Two Pointer: sorted pair sum ---------------\ndef two_sum_sorted(nums: list[int], target: int) -> tuple[int, int] | None:\n    \"\"\"Returns indices (i, j) where nums[i] + nums[j] == target, or None.\"\"\"\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        s = nums[lo] + nums[hi]\n        if s == target:\n            return (lo, hi)\n        elif s < target:\n            lo += 1\n        else:\n            hi -= 1\n    return None\n\n# --------------- Sliding Window: max sum subarray of size k ---------------\ndef max_sum_window(nums: list[int], k: int) -> int:\n    \"\"\"O(n) max sum of contiguous subarray of length k.\"\"\"\n    if len(nums) < k:\n        raise ValueError(f\"Array length {len(nums)} < window size {k}\")\n    window_sum = sum(nums[:k])\n    best = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        best = max(best, window_sum)\n    return best\n\n# --------------- Prefix Sum: range query ---------------\ndef build_prefix(nums: list[int]) -> list[int]:\n    prefix = [0] * (len(nums) + 1)\n    for i, v in enumerate(nums):\n        prefix[i + 1] = prefix[i] + v\n    return prefix\n\ndef range_sum(prefix: list[int], l: int, r: int) -> int:\n    \"\"\"Sum of nums[l..r] inclusive in O(1).\"\"\"\n    return prefix[r + 1] - prefix[l]\n\n# --------------- Demo ---------------\nif __name__ == \"__main__\":\n    arr = [1, 3, 5, 7, 9, 11]\n    print(two_sum_sorted(arr, 14))   # (1, 4) \u2192 3+11=14\n    print(max_sum_window(arr, 3))    # 27 (9+11+7)\n    prefix = build_prefix(arr)\n    print(range_sum(prefix, 1, 4))  # 24 (3+5+7+9)",
    go: "// Pattern: Array Algorithms \u2014 Two Pointer, Sliding Window, Prefix Sum\n// Reference: CLRS \u00a710.1, \u00a714\n// Production note: prefer slices over arrays in Go; use copy() for safe mutation\n\npackage main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\n// TwoSumSorted finds indices in a sorted slice where nums[i]+nums[j]==target.\nfunc TwoSumSorted(nums []int, target int) (int, int, bool) {\n\tlo, hi := 0, len(nums)-1\n\tfor lo < hi {\n\t\ts := nums[lo] + nums[hi]\n\t\tswitch {\n\t\tcase s == target:\n\t\t\treturn lo, hi, true\n\t\tcase s < target:\n\t\t\tlo++\n\t\tdefault:\n\t\t\thi--\n\t\t}\n\t}\n\treturn 0, 0, false\n}\n\n// MaxSumWindow returns max sum of contiguous subarray of length k.\nfunc MaxSumWindow(nums []int, k int) (int, error) {\n\tif len(nums) < k {\n\t\treturn 0, errors.New(\"array shorter than window\")\n\t}\n\tsum := 0\n\tfor _, v := range nums[:k] {\n\t\tsum += v\n\t}\n\tbest := sum\n\tfor i := k; i < len(nums); i++ {\n\t\tsum += nums[i] - nums[i-k]\n\t\tif sum > best {\n\t\t\tbest = sum\n\t\t}\n\t}\n\treturn best, nil\n}\n\n// BuildPrefix returns prefix sum slice (length n+1).\nfunc BuildPrefix(nums []int) []int {\n\tp := make([]int, len(nums)+1)\n\tfor i, v := range nums {\n\t\tp[i+1] = p[i] + v\n\t}\n\treturn p\n}\n\n// RangeSum returns sum of nums[l..r] inclusive in O(1).\nfunc RangeSum(prefix []int, l, r int) int {\n\treturn prefix[r+1] - prefix[l]\n}\n\nfunc main() {\n\tarr := []int{1, 3, 5, 7, 9, 11}\n\tif i, j, ok := TwoSumSorted(arr, 14); ok {\n\t\tfmt.Printf(\"TwoSum: indices %d,%d\\\\n\", i, j) // 1,4\n\t}\n\tif max, err := MaxSumWindow(arr, 3); err == nil {\n\t\tfmt.Println(\"MaxWindow:\", max) // 27\n\t}\n\tprefix := BuildPrefix(arr)\n\tfmt.Println(\"RangeSum[1,4]:\", RangeSum(prefix, 1, 4)) // 24\n}",
    typescript: "// Pattern: Array Algorithms\n// Reference: CLRS \u00a710.1\n// Production note: typed Result pattern prevents unchecked null returns\n\ntype Result<T, E> = { ok: true; value: T } | { ok: false; error: E };\n\nfunction ok<T>(value: T): Result<T, never> { return { ok: true, value }; }\nfunction err<E>(error: E): Result<never, E> { return { ok: false, error }; }\n\n// Two Pointer on sorted array\nfunction twoSumSorted(nums: readonly number[], target: number): Result<[number, number], string> {\n  let lo = 0, hi = nums.length - 1;\n  while (lo < hi) {\n    const s = nums[lo] + nums[hi];\n    if (s === target) return ok([lo, hi]);\n    s < target ? lo++ : hi--;\n  }\n  return err(\"No pair found\");\n}\n\n// Sliding Window \u2014 max sum of length-k subarray\nfunction maxSumWindow(nums: readonly number[], k: number): Result<number, string> {\n  if (nums.length < k) return err(`Array length ${nums.length} < k=${k}`);\n  let sum = nums.slice(0, k).reduce((a, b) => a + b, 0);\n  let best = sum;\n  for (let i = k; i < nums.length; i++) {\n    sum += nums[i] - nums[i - k];\n    if (sum > best) best = sum;\n  }\n  return ok(best);\n}\n\n// Prefix Sum builder + O(1) range query\nfunction buildPrefix(nums: readonly number[]): number[] {\n  const p = new Array<number>(nums.length + 1).fill(0);\n  for (let i = 0; i < nums.length; i++) p[i + 1] = p[i] + nums[i];\n  return p;\n}\n\nfunction rangeSum(prefix: readonly number[], l: number, r: number): number {\n  return prefix[r + 1] - prefix[l];\n}\n\n// Demo\nconst arr = [1, 3, 5, 7, 9, 11] as const;\nconst pairResult = twoSumSorted(arr, 14);\nif (pairResult.ok) console.log(\"Pair:\", pairResult.value);  // [1, 4]\n\nconst winResult = maxSumWindow(arr, 3);\nif (winResult.ok) console.log(\"MaxWindow:\", winResult.value); // 27\n\nconst prefix = buildPrefix(arr);\nconsole.log(\"RangeSum[1,4]:\", rangeSum(prefix, 1, 4)); // 24",
    rust: "// Pattern: Array Algorithms \u2014 Two Pointer, Sliding Window, Prefix Sum\n// Reference: CLRS \u00a710.1\n// Production note: slices are zero-cost views; use &[i32] not Vec<i32> in signatures\n\nuse thiserror::Error;\n\n#[derive(Debug, Error)]\npub enum ArrayError {\n    #[error(\"array length {len} < window size {k}\")]\n    WindowTooLarge { len: usize, k: usize },\n    #[error(\"no pair found with sum {target}\")]\n    NoPairFound { target: i32 },\n}\n\n/// Two-pointer pair sum on a sorted slice.\npub fn two_sum_sorted(nums: &[i32], target: i32) -> Result<(usize, usize), ArrayError> {\n    let (mut lo, mut hi) = (0, nums.len().saturating_sub(1));\n    while lo < hi {\n        match (nums[lo] + nums[hi]).cmp(&target) {\n            std::cmp::Ordering::Equal => return Ok((lo, hi)),\n            std::cmp::Ordering::Less  => lo += 1,\n            std::cmp::Ordering::Greater => hi -= 1,\n        }\n    }\n    Err(ArrayError::NoPairFound { target })\n}\n\n/// Sliding window max sum of length k. O(n) time, O(1) space.\npub fn max_sum_window(nums: &[i32], k: usize) -> Result<i32, ArrayError> {\n    if nums.len() < k {\n        return Err(ArrayError::WindowTooLarge { len: nums.len(), k });\n    }\n    let mut sum: i32 = nums[..k].iter().sum();\n    let mut best = sum;\n    for i in k..nums.len() {\n        sum += nums[i] - nums[i - k];\n        best = best.max(sum);\n    }\n    Ok(best)\n}\n\n/// Build prefix sum array of length n+1. prefix[i] = sum of first i elements.\npub fn build_prefix(nums: &[i32]) -> Vec<i32> {\n    let mut prefix = vec![0i32; nums.len() + 1];\n    for (i, &v) in nums.iter().enumerate() {\n        prefix[i + 1] = prefix[i] + v;\n    }\n    prefix\n}\n\n/// O(1) range sum query for nums[l..=r].\npub fn range_sum(prefix: &[i32], l: usize, r: usize) -> i32 {\n    prefix[r + 1] - prefix[l]\n}\n\nfn main() {\n    let arr = [1, 3, 5, 7, 9, 11];\n    match two_sum_sorted(&arr, 14) {\n        Ok((i, j)) => println!(\"TwoSum: ({i}, {j})\"),  // (1, 4)\n        Err(e)     => eprintln!(\"{e}\"),\n    }\n    println!(\"MaxWindow: {}\", max_sum_window(&arr, 3).unwrap()); // 27\n    let prefix = build_prefix(&arr);\n    println!(\"RangeSum[1,4]: {}\", range_sum(&prefix, 1, 4));     // 24\n}",
    java: "// Pattern: Array Algorithms \u2014 Two Pointer, Sliding Window, Prefix Sum\n// Reference: CLRS \u00a710.1\n// Production note: Java 21 records and sealed interfaces replace checked exceptions cleanly\n\nimport java.util.Arrays;\nimport java.util.Optional;\n\npublic final class ArrayAlgorithms {\n\n    // Sealed result type \u2014 Java 21 pattern matching\n    public sealed interface PairResult permits PairResult.Found, PairResult.NotFound {\n        record Found(int lo, int hi) implements PairResult {}\n        record NotFound(int target) implements PairResult {}\n    }\n\n    /** Two-pointer pair sum on a sorted array. O(n) time, O(1) space. */\n    public static PairResult twoSumSorted(int[] nums, int target) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo < hi) {\n            int sum = nums[lo] + nums[hi];\n            if      (sum == target) return new PairResult.Found(lo, hi);\n            else if (sum < target)  lo++;\n            else                    hi--;\n        }\n        return new PairResult.NotFound(target);\n    }\n\n    /** Sliding window max sum of length k. O(n) time, O(1) space. */\n    public static Optional<Integer> maxSumWindow(int[] nums, int k) {\n        if (nums.length < k) return Optional.empty();\n        int sum = 0;\n        for (int i = 0; i < k; i++) sum += nums[i];\n        int best = sum;\n        for (int i = k; i < nums.length; i++) {\n            sum += nums[i] - nums[i - k];\n            best = Math.max(best, sum);\n        }\n        return Optional.of(best);\n    }\n\n    /** Build prefix sum array of length n+1. */\n    public static int[] buildPrefix(int[] nums) {\n        int[] prefix = new int[nums.length + 1];\n        for (int i = 0; i < nums.length; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n        return prefix;\n    }\n\n    /** O(1) range sum query for nums[l..r] inclusive. */\n    public static int rangeSum(int[] prefix, int l, int r) {\n        return prefix[r + 1] - prefix[l];\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9, 11};\n\n        switch (twoSumSorted(arr, 14)) {\n            case PairResult.Found(int lo, int hi) ->\n                System.out.printf(\"TwoSum: (%d, %d)%n\", lo, hi);   // (1, 4)\n            case PairResult.NotFound(int t) ->\n                System.out.println(\"No pair for target \" + t);\n        }\n\n        maxSumWindow(arr, 3).ifPresent(v -> System.out.println(\"MaxWindow: \" + v)); // 27\n\n        int[] prefix = buildPrefix(arr);\n        System.out.println(\"RangeSum[1,4]: \" + rangeSum(prefix, 1, 4)); // 24\n    }\n}",
  },
  "linked-lists": {
    python: "# Linked List: Reverse + Cycle Detection \u2014 Python 3.11+\nfrom __future__ import annotations\nfrom dataclasses import dataclass\nfrom typing import Generic, TypeVar\n\nT = TypeVar(\"T\")\n\n@dataclass\nclass Node(Generic[T]):\n    val: T\n    next: Node[T] | None = None\n\ndef reverse(head: Node[T] | None) -> Node[T] | None:\n    \"\"\"Iterative in-place reversal \u2014 O(n) time, O(1) space.\"\"\"\n    prev: Node[T] | None = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\ndef has_cycle(head: Node[T] | None) -> bool:\n    \"\"\"Floyd's tortoise-and-hare \u2014 O(n) time, O(1) space.\"\"\"\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next          # type: ignore[assignment]\n        fast = fast.next.next     # type: ignore[union-attr]\n        if slow is fast:\n            return True\n    return False\n\ndef to_list(head: Node[T] | None) -> list[T]:\n    result, cur = [], head\n    while cur:\n        result.append(cur.val)\n        cur = cur.next\n    return result\n\n# Demo\nn3 = Node(3); n2 = Node(2, n3); n1 = Node(1, n2)\nprint(to_list(reverse(n1)))  # [3, 2, 1]\n\n# Build cycle: 1 -> 2 -> 3 -> back to 2\na = Node(1); b = Node(2); c = Node(3)\na.next = b; b.next = c; c.next = b\nprint(has_cycle(a))  # True",
    go: "// Pattern: Linked List \u2014 Reverse + Floyd Cycle Detection\n// Reference: CLRS \u00a710.2\n// Production note: use container/list for doubly-linked; this is singly for clarity\n\npackage main\n\nimport \"fmt\"\n\ntype Node[T any] struct {\n\tVal  T\n\tNext *Node[T]\n}\n\n// Reverse reverses a singly linked list in-place.\nfunc Reverse[T any](head *Node[T]) *Node[T] {\n\tvar prev *Node[T]\n\tcurr := head\n\tfor curr != nil {\n\t\tnext := curr.Next\n\t\tcurr.Next = prev\n\t\tprev = curr\n\t\tcurr = next\n\t}\n\treturn prev\n}\n\n// HasCycle detects a cycle using Floyd's algorithm.\nfunc HasCycle[T any](head *Node[T]) bool {\n\tslow, fast := head, head\n\tfor fast != nil && fast.Next != nil {\n\t\tslow = slow.Next\n\t\tfast = fast.Next.Next\n\t\tif slow == fast {\n\t\t\treturn true\n\t\t}\n\t}\n\treturn false\n}\n\nfunc ToSlice[T any](head *Node[T]) []T {\n\tvar out []T\n\tfor cur := head; cur != nil; cur = cur.Next {\n\t\tout = append(out, cur.Val)\n\t}\n\treturn out\n}\n\nfunc main() {\n\tn3 := &Node[int]{Val: 3}\n\tn2 := &Node[int]{Val: 2, Next: n3}\n\tn1 := &Node[int]{Val: 1, Next: n2}\n\tfmt.Println(ToSlice(Reverse(n1))) // [3 2 1]\n\n\ta := &Node[int]{Val: 1}\n\tb := &Node[int]{Val: 2}\n\tc := &Node[int]{Val: 3}\n\ta.Next = b; b.Next = c; c.Next = b\n\tfmt.Println(HasCycle(a)) // true\n}",
    typescript: "// Pattern: Linked List \u2014 Reverse + Floyd Cycle Detection\n// Reference: CLRS \u00a710.2\n\ninterface ListNode<T> {\n  val: T;\n  next: ListNode<T> | null;\n}\n\nfunction makeNode<T>(val: T, next: ListNode<T> | null = null): ListNode<T> {\n  return { val, next };\n}\n\nfunction reverse<T>(head: ListNode<T> | null): ListNode<T> | null {\n  let prev: ListNode<T> | null = null;\n  let curr = head;\n  while (curr !== null) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}\n\nfunction hasCycle<T>(head: ListNode<T> | null): boolean {\n  let slow = head, fast = head;\n  while (fast !== null && fast.next !== null) {\n    slow = slow!.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\nfunction toArray<T>(head: ListNode<T> | null): T[] {\n  const out: T[] = [];\n  for (let c = head; c !== null; c = c.next) out.push(c.val);\n  return out;\n}\n\nconst n3 = makeNode(3), n2 = makeNode(2, n3), n1 = makeNode(1, n2);\nconsole.log(toArray(reverse(n1))); // [3, 2, 1]",
    rust: "// Pattern: Linked List \u2014 Reverse + Floyd Cycle Detection\n// Reference: CLRS \u00a710.2\n// Production note: Rust ownership makes linked lists non-trivial; Box<Node> is the idiomatic heap allocation\n\n#[derive(Debug)]\npub struct Node<T> {\n    pub val: T,\n    pub next: Option<Box<Node<T>>>,\n}\n\nimpl<T> Node<T> {\n    pub fn new(val: T) -> Box<Self> {\n        Box::new(Node { val, next: None })\n    }\n}\n\n/// Reverse a singly linked list in-place. Consumes head, returns new head.\npub fn reverse<T>(mut head: Option<Box<Node<T>>>) -> Option<Box<Node<T>>> {\n    let mut prev: Option<Box<Node<T>>> = None;\n    while let Some(mut node) = head {\n        head = node.next.take();\n        node.next = prev;\n        prev = Some(node);\n    }\n    prev\n}\n\n/// Collect linked list values into a Vec (for testing / display).\npub fn to_vec<T: Clone>(mut head: &Option<Box<Node<T>>>) -> Vec<T> {\n    let mut out = Vec::new();\n    while let Some(node) = head {\n        out.push(node.val.clone());\n        head = &node.next;\n    }\n    out\n}\n\n// Note: Floyd's cycle detection requires raw pointers in Rust because safe\n// references can't alias. This is the idiomatic approach using *const Node.\npub fn has_cycle_raw(head: *const Node<i32>) -> bool {\n    let (mut slow, mut fast) = (head, head);\n    unsafe {\n        loop {\n            if fast.is_null() { return false; }\n            let fast_next = (*fast).next.as_ref().map_or(std::ptr::null(), |n| n.as_ref() as *const _);\n            if fast_next.is_null() { return false; }\n            slow = (*slow).next.as_ref().map_or(std::ptr::null(), |n| n.as_ref() as *const _);\n            fast = (*(*fast).next.as_ref().unwrap()).next.as_ref().map_or(std::ptr::null(), |n| n.as_ref() as *const _);\n            if slow == fast { return true; }\n        }\n    }\n}\n\nfn main() {\n    let mut n3 = Node::new(3);\n    let mut n2 = Node::new(2);\n    let mut n1 = Node::new(1);\n    n2.next = Some(n3);\n    n1.next = Some(n2);\n    let head = Some(n1);\n\n    let reversed = reverse(head);\n    println!(\"{:?}\", to_vec(&reversed)); // [3, 2, 1]\n}",
    java: "// Pattern: Linked List \u2014 Reverse + Floyd Cycle Detection\n// Reference: CLRS \u00a710.2\n// Production note: Java 21 \u2014 use records for immutable nodes; LinkedList<E> in JDK uses doubly-linked\n\npublic final class LinkedLists {\n\n    public static final class Node<T> {\n        public T val;\n        public Node<T> next;\n        public Node(T val) { this.val = val; }\n        public Node(T val, Node<T> next) { this.val = val; this.next = next; }\n    }\n\n    /** Iterative in-place reversal. O(n) time, O(1) space. */\n    public static <T> Node<T> reverse(Node<T> head) {\n        Node<T> prev = null, curr = head;\n        while (curr != null) {\n            Node<T> next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n\n    /** Floyd's tortoise-and-hare cycle detection. O(n) time, O(1) space. */\n    public static <T> boolean hasCycle(Node<T> head) {\n        var slow = head;\n        var fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n\n    public static <T> String toListString(Node<T> head) {\n        var sb = new StringBuilder(\"[\");\n        for (var cur = head; cur != null; cur = cur.next) {\n            sb.append(cur.val);\n            if (cur.next != null) sb.append(\", \");\n        }\n        return sb.append(\"]\").toString();\n    }\n\n    public static void main(String[] args) {\n        var n3 = new Node<>(3);\n        var n2 = new Node<>(2, n3);\n        var n1 = new Node<>(1, n2);\n        System.out.println(toListString(reverse(n1))); // [3, 2, 1]\n\n        // Build cycle: 1 -> 2 -> 3 -> back to 2\n        var a = new Node<>(1);\n        var b = new Node<>(2);\n        var c = new Node<>(3);\n        a.next = b; b.next = c; c.next = b;\n        System.out.println(hasCycle(a)); // true\n    }\n}",
  },
  "stacks-queues": {
    python: "# Monotonic Stack \u2014 next greater element \u2014 Python 3.11+\ndef next_greater(nums: list[int]) -> list[int]:\n    \"\"\"For each element, return the next greater to the right (-1 if none). O(n).\"\"\"\n    result = [-1] * len(nums)\n    stack: list[int] = []  # indices, decreasing values\n    for i, val in enumerate(nums):\n        while stack and nums[stack[-1]] < val:\n            result[stack.pop()] = val\n        stack.append(i)\n    return result\n\n# Min Stack \u2014 O(1) push/pop/min\nclass MinStack:\n    def __init__(self) -> None:\n        self._stack: list[tuple[int, int]] = []  # (val, current_min)\n\n    def push(self, val: int) -> None:\n        cur_min = val if not self._stack else min(val, self._stack[-1][1])\n        self._stack.append((val, cur_min))\n\n    def pop(self) -> int:\n        if not self._stack:\n            raise IndexError(\"pop from empty stack\")\n        return self._stack.pop()[0]\n\n    def top(self) -> int:\n        return self._stack[-1][0]\n\n    def get_min(self) -> int:\n        return self._stack[-1][1]\n\n# Demo\nprint(next_greater([2, 1, 2, 4, 3]))  # [4, 2, 4, -1, -1]\nms = MinStack()\nfor v in [3, 1, 2]: ms.push(v)\nprint(ms.get_min())  # 1\nms.pop()\nprint(ms.get_min())  # 1",
    go: "// Pattern: Monotonic Stack + Min Stack\n// Reference: CLRS \u00a710.1\n// Production note: use container/heap for priority queue; slice-based stack is idiomatic Go\n\npackage main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\n// NextGreater returns the next greater element to the right for each index.\nfunc NextGreater(nums []int) []int {\n\tresult := make([]int, len(nums))\n\tfor i := range result { result[i] = -1 }\n\tstack := []int{} // indices\n\tfor i, val := range nums {\n\t\tfor len(stack) > 0 && nums[stack[len(stack)-1]] < val {\n\t\t\ttop := stack[len(stack)-1]\n\t\t\tstack = stack[:len(stack)-1]\n\t\t\tresult[top] = val\n\t\t}\n\t\tstack = append(stack, i)\n\t}\n\treturn result\n}\n\ntype MinStack struct {\n\tstack [][2]int // [val, currentMin]\n}\n\nfunc (s *MinStack) Push(val int) {\n\tcurMin := val\n\tif len(s.stack) > 0 && s.stack[len(s.stack)-1][1] < curMin {\n\t\tcurMin = s.stack[len(s.stack)-1][1]\n\t}\n\ts.stack = append(s.stack, [2]int{val, curMin})\n}\n\nfunc (s *MinStack) Pop() (int, error) {\n\tif len(s.stack) == 0 {\n\t\treturn 0, errors.New(\"empty stack\")\n\t}\n\ttop := s.stack[len(s.stack)-1][0]\n\ts.stack = s.stack[:len(s.stack)-1]\n\treturn top, nil\n}\n\nfunc (s *MinStack) GetMin() (int, error) {\n\tif len(s.stack) == 0 {\n\t\treturn 0, errors.New(\"empty stack\")\n\t}\n\treturn s.stack[len(s.stack)-1][1], nil\n}\n\nfunc main() {\n\tfmt.Println(NextGreater([]int{2, 1, 2, 4, 3})) // [4 2 4 -1 -1]\n\tms := &MinStack{}\n\tfor _, v := range []int{3, 1, 2} { ms.Push(v) }\n\tif m, err := ms.GetMin(); err == nil {\n\t\tfmt.Println(\"Min:\", m) // 1\n\t}\n}",
    typescript: "// Pattern: Monotonic Stack + Min Stack\n// Reference: CLRS \u00a710.1\n\nfunction nextGreater(nums: readonly number[]): number[] {\n  const result = new Array<number>(nums.length).fill(-1);\n  const stack: number[] = []; // indices\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {\n      result[stack.pop()!] = nums[i];\n    }\n    stack.push(i);\n  }\n  return result;\n}\n\nclass MinStack {\n  private readonly stack: Array<[number, number]> = []; // [val, curMin]\n\n  push(val: number): void {\n    const curMin = this.stack.length === 0\n      ? val\n      : Math.min(val, this.stack[this.stack.length - 1][1]);\n    this.stack.push([val, curMin]);\n  }\n\n  pop(): number {\n    if (this.stack.length === 0) throw new Error(\"Empty stack\");\n    return this.stack.pop()![0];\n  }\n\n  getMin(): number {\n    if (this.stack.length === 0) throw new Error(\"Empty stack\");\n    return this.stack[this.stack.length - 1][1];\n  }\n}\n\nconsole.log(nextGreater([2, 1, 2, 4, 3])); // [4, 2, 4, -1, -1]\nconst ms = new MinStack();\n[3, 1, 2].forEach(v => ms.push(v));\nconsole.log(ms.getMin()); // 1",
    rust: "// Pattern: Monotonic Stack + Min Stack\n// Reference: CLRS \u00a710.1\n// Production note: Vec<T> is Rust's idiomatic stack; push/pop are O(1) amortised\n\nuse thiserror::Error;\n\n#[derive(Debug, Error)]\npub enum StackError {\n    #[error(\"pop from empty stack\")]\n    Empty,\n}\n\n/// Monotonic stack \u2014 next greater element to the right for each index.\npub fn next_greater(nums: &[i32]) -> Vec<i32> {\n    let mut result = vec![-1i32; nums.len()];\n    let mut stack: Vec<usize> = Vec::new(); // indices, decreasing values\n    for (i, &val) in nums.iter().enumerate() {\n        while let Some(&top) = stack.last() {\n            if nums[top] < val {\n                result[top] = val;\n                stack.pop();\n            } else {\n                break;\n            }\n        }\n        stack.push(i);\n    }\n    result\n}\n\n/// Min stack with O(1) push / pop / get_min.\npub struct MinStack {\n    stack: Vec<(i32, i32)>, // (value, current_min)\n}\n\nimpl MinStack {\n    pub fn new() -> Self { MinStack { stack: Vec::new() } }\n\n    pub fn push(&mut self, val: i32) {\n        let cur_min = self.stack.last().map_or(val, |&(_, m)| m.min(val));\n        self.stack.push((val, cur_min));\n    }\n\n    pub fn pop(&mut self) -> Result<i32, StackError> {\n        self.stack.pop().map(|(v, _)| v).ok_or(StackError::Empty)\n    }\n\n    pub fn get_min(&self) -> Result<i32, StackError> {\n        self.stack.last().map(|&(_, m)| m).ok_or(StackError::Empty)\n    }\n}\n\nfn main() {\n    let result = next_greater(&[2, 1, 2, 4, 3]);\n    println!(\"{:?}\", result); // [4, 2, 4, -1, -1]\n\n    let mut ms = MinStack::new();\n    for v in [3, 1, 2] { ms.push(v); }\n    println!(\"Min: {}\", ms.get_min().unwrap()); // 1\n    ms.pop().unwrap();\n    println!(\"Min after pop: {}\", ms.get_min().unwrap()); // 1\n}",
    java: "// Pattern: Monotonic Stack + Min Stack\n// Reference: CLRS \u00a710.1\n// Production note: Java 21 \u2014 use ArrayDeque<E> for production stacks, not Stack<E> (legacy)\n\nimport java.util.ArrayDeque;\nimport java.util.Arrays;\n\npublic final class StackPatterns {\n\n    /** Monotonic stack \u2014 next greater element to the right. O(n). */\n    public static int[] nextGreater(int[] nums) {\n        int[] result = new int[nums.length];\n        Arrays.fill(result, -1);\n        var stack = new ArrayDeque<Integer>(); // stores indices\n        for (int i = 0; i < nums.length; i++) {\n            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {\n                result[stack.pop()] = nums[i];\n            }\n            stack.push(i);\n        }\n        return result;\n    }\n\n    /** Min stack with O(1) push / pop / getMin. */\n    public static final class MinStack {\n        // Each entry stores [value, currentMin]\n        private final ArrayDeque<int[]> stack = new ArrayDeque<>();\n\n        public void push(int val) {\n            int curMin = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);\n            stack.push(new int[]{val, curMin});\n        }\n\n        public int pop() {\n            if (stack.isEmpty()) throw new IllegalStateException(\"Empty stack\");\n            return stack.pop()[0];\n        }\n\n        public int getMin() {\n            if (stack.isEmpty()) throw new IllegalStateException(\"Empty stack\");\n            return stack.peek()[1];\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(nextGreater(new int[]{2, 1, 2, 4, 3}))); // [4, 2, 4, -1, -1]\n\n        var ms = new MinStack();\n        for (int v : new int[]{3, 1, 2}) ms.push(v);\n        System.out.println(\"Min: \" + ms.getMin()); // 1\n        ms.pop();\n        System.out.println(\"Min after pop: \" + ms.getMin()); // 1\n    }\n}",
  },
  "hash-tables": {
    python: "# Hash Map patterns \u2014 Python 3.11+\nfrom collections import defaultdict, Counter\nfrom dataclasses import dataclass, field\n\n# ---- Group Anagrams using sorted key ----\ndef group_anagrams(words: list[str]) -> list[list[str]]:\n    buckets: defaultdict[str, list[str]] = defaultdict(list)\n    for w in words:\n        buckets[\"\".join(sorted(w))].append(w)\n    return list(buckets.values())\n\n# ---- LRU Cache (O(1) get/put) using OrderedDict ----\nfrom collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int) -> None:\n        self._cap = capacity\n        self._cache: OrderedDict[int, int] = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self._cache:\n            return -1\n        self._cache.move_to_end(key)\n        return self._cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self._cache:\n            self._cache.move_to_end(key)\n        self._cache[key] = value\n        if len(self._cache) > self._cap:\n            self._cache.popitem(last=False)\n\n# Demo\nprint(group_anagrams([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]))\nlru = LRUCache(2)\nlru.put(1, 1); lru.put(2, 2)\nprint(lru.get(1))  # 1\nlru.put(3, 3)      # evicts key 2\nprint(lru.get(2))  # -1 (evicted)",
    go: "// Pattern: Hash Map + LRU Cache\n// Reference: CLRS \u00a711\n// Production note: sync.Map for concurrent access; groupcache/ristretto for production LRU\n\npackage main\n\nimport (\n\t\"container/list\"\n\t\"fmt\"\n\t\"sort\"\n\t\"strings\"\n)\n\n// GroupAnagrams groups words by their sorted character signature.\nfunc GroupAnagrams(words []string) [][]string {\n\tm := make(map[string][]string)\n\tfor _, w := range words {\n\t\trunes := []rune(w)\n\t\tsort.Slice(runes, func(i, j int) bool { return runes[i] < runes[j] })\n\t\tkey := string(runes)\n\t\tm[key] = append(m[key], w)\n\t}\n\tresult := make([][]string, 0, len(m))\n\tfor _, v := range m { result = append(result, v) }\n\treturn result\n}\n\n// LRUCache is an O(1) get/put cache backed by a doubly-linked list + map.\ntype LRUCache struct {\n\tcap   int\n\tcache map[int]*list.Element\n\tlist  *list.List\n}\n\ntype entry struct{ key, val int }\n\nfunc NewLRU(cap int) *LRUCache {\n\treturn &LRUCache{cap: cap, cache: make(map[int]*list.Element), list: list.New()}\n}\n\nfunc (c *LRUCache) Get(key int) int {\n\tif el, ok := c.cache[key]; ok {\n\t\tc.list.MoveToFront(el)\n\t\treturn el.Value.(*entry).val\n\t}\n\treturn -1\n}\n\nfunc (c *LRUCache) Put(key, val int) {\n\tif el, ok := c.cache[key]; ok {\n\t\tel.Value.(*entry).val = val\n\t\tc.list.MoveToFront(el)\n\t\treturn\n\t}\n\tel := c.list.PushFront(&entry{key, val})\n\tc.cache[key] = el\n\tif c.list.Len() > c.cap {\n\t\tback := c.list.Back()\n\t\tc.list.Remove(back)\n\t\tdelete(c.cache, back.Value.(*entry).key)\n\t}\n}\n\nfunc main() {\n\t_ = strings.Join // satisfy import\n\tfmt.Println(GroupAnagrams([]string{\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"}))\n\tlru := NewLRU(2)\n\tlru.Put(1, 1); lru.Put(2, 2)\n\tfmt.Println(lru.Get(1))  // 1\n\tlru.Put(3, 3)\n\tfmt.Println(lru.Get(2))  // -1\n}",
    typescript: "// Pattern: Hash Map + LRU Cache (Map maintains insertion order in V8)\n// Reference: CLRS \u00a711\n\nfunction groupAnagrams(words: readonly string[]): string[][] {\n  const buckets = new Map<string, string[]>();\n  for (const w of words) {\n    const key = [...w].sort().join(\"\");\n    if (!buckets.has(key)) buckets.set(key, []);\n    buckets.get(key)!.push(w);\n  }\n  return [...buckets.values()];\n}\n\nclass LRUCache {\n  private readonly cache: Map<number, number>;\n  constructor(private readonly capacity: number) {\n    this.cache = new Map();\n  }\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val); // re-insert = move to end\n    return val;\n  }\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      this.cache.delete(this.cache.keys().next().value!);\n    }\n  }\n}\n\nconsole.log(groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]));\nconst lru = new LRUCache(2);\nlru.put(1, 1); lru.put(2, 2);\nconsole.log(lru.get(1));  // 1\nlru.put(3, 3);\nconsole.log(lru.get(2));  // -1",
    rust: "// Pattern: Hash Map + LRU Cache\n// Reference: CLRS \u00a711\n// Production note: use indexmap crate for insertion-order HashMap; lru crate for production LRU\n\nuse std::collections::HashMap;\n\n/// Group anagrams by sorted-character key.\npub fn group_anagrams(words: &[&str]) -> Vec<Vec<String>> {\n    let mut buckets: HashMap<String, Vec<String>> = HashMap::new();\n    for &w in words {\n        let mut key: Vec<char> = w.chars().collect();\n        key.sort_unstable();\n        buckets.entry(key.iter().collect()).or_default().push(w.to_string());\n    }\n    buckets.into_values().collect()\n}\n\n/// O(1) get/put LRU cache using a HashMap + a Vec-based order tracker.\n/// Production: use the \"lru\" crate (github.com/jeromefroe/lru-rs).\npub struct LRUCache {\n    capacity: usize,\n    map: HashMap<i32, i32>,\n    order: Vec<i32>, // front = LRU, back = MRU\n}\n\nimpl LRUCache {\n    pub fn new(capacity: usize) -> Self {\n        LRUCache { capacity, map: HashMap::new(), order: Vec::new() }\n    }\n\n    pub fn get(&mut self, key: i32) -> i32 {\n        if self.map.contains_key(&key) {\n            self.order.retain(|&k| k != key);\n            self.order.push(key);\n            *self.map.get(&key).unwrap()\n        } else {\n            -1\n        }\n    }\n\n    pub fn put(&mut self, key: i32, value: i32) {\n        if self.map.contains_key(&key) {\n            self.order.retain(|&k| k != key);\n        } else if self.map.len() == self.capacity {\n            let evict = self.order.remove(0);\n            self.map.remove(&evict);\n        }\n        self.map.insert(key, value);\n        self.order.push(key);\n    }\n}\n\nfn main() {\n    let words = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"];\n    let mut groups = group_anagrams(&words);\n    groups.sort(); // for deterministic output\n    println!(\"{:?}\", groups);\n\n    let mut lru = LRUCache::new(2);\n    lru.put(1, 1); lru.put(2, 2);\n    println!(\"{}\", lru.get(1));  // 1\n    lru.put(3, 3);\n    println!(\"{}\", lru.get(2)); // -1\n}",
    java: "// Pattern: Hash Map + LRU Cache\n// Reference: CLRS \u00a711\n// Production note: Java's LinkedHashMap with accessOrder=true is the standard LRU implementation\n\nimport java.util.*;\n\npublic final class HashPatterns {\n\n    /** Group anagrams using sorted-char key. */\n    public static List<List<String>> groupAnagrams(String[] words) {\n        var buckets = new HashMap<String, List<String>>();\n        for (String w : words) {\n            char[] chars = w.toCharArray();\n            Arrays.sort(chars);\n            buckets.computeIfAbsent(new String(chars), k -> new ArrayList<>()).add(w);\n        }\n        return new ArrayList<>(buckets.values());\n    }\n\n    /** O(1) get/put LRU cache backed by LinkedHashMap (accessOrder=true). */\n    public static final class LRUCache {\n        private final LinkedHashMap<Integer, Integer> cache;\n\n        public LRUCache(int capacity) {\n            // accessOrder=true: get() moves entry to tail (MRU position)\n            this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {\n                @Override\n                protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n                    return size() > capacity;\n                }\n            };\n        }\n\n        public int get(int key) {\n            return cache.getOrDefault(key, -1);\n        }\n\n        public void put(int key, int value) {\n            cache.put(key, value);\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(groupAnagrams(new String[]{\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"}));\n\n        var lru = new LRUCache(2);\n        lru.put(1, 1); lru.put(2, 2);\n        System.out.println(lru.get(1));  // 1\n        lru.put(3, 3);\n        System.out.println(lru.get(2)); // -1 (evicted)\n    }\n}",
  },
  "trees": {
    python: "# BST + Trie \u2014 Python 3.11+\nfrom __future__ import annotations\nfrom dataclasses import dataclass, field\n\n# \u2500\u2500\u2500\u2500\u2500\u2500 Binary Search Tree \u2500\u2500\u2500\u2500\u2500\u2500\n@dataclass\nclass BSTNode:\n    key: int\n    left: BSTNode | None = None\n    right: BSTNode | None = None\n\ndef bst_insert(root: BSTNode | None, key: int) -> BSTNode:\n    if root is None:\n        return BSTNode(key)\n    if key < root.key:\n        root.left = bst_insert(root.left, key)\n    elif key > root.key:\n        root.right = bst_insert(root.right, key)\n    return root  # duplicate: ignore\n\ndef inorder(root: BSTNode | None) -> list[int]:\n    if root is None:\n        return []\n    return inorder(root.left) + [root.key] + inorder(root.right)\n\ndef bst_search(root: BSTNode | None, key: int) -> bool:\n    if root is None:\n        return False\n    if key == root.key:\n        return True\n    return bst_search(root.left, key) if key < root.key else bst_search(root.right, key)\n\n# \u2500\u2500\u2500\u2500\u2500\u2500 Trie \u2500\u2500\u2500\u2500\u2500\u2500\n@dataclass\nclass TrieNode:\n    children: dict[str, TrieNode] = field(default_factory=dict)\n    is_end: bool = False\n\nclass Trie:\n    def __init__(self) -> None:\n        self._root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self._root\n        for ch in word:\n            node = node.children.setdefault(ch, TrieNode())\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self._root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def starts_with(self, prefix: str) -> bool:\n        node = self._root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True\n\n# Demo\nroot = None\nfor v in [5, 3, 7, 1, 4, 6, 8]:\n    root = bst_insert(root, v)\nprint(inorder(root))  # [1, 3, 4, 5, 6, 7, 8]\nprint(bst_search(root, 4))  # True\n\nt = Trie()\nfor w in [\"apple\", \"app\", \"apt\"]:\n    t.insert(w)\nprint(t.search(\"app\"))        # True\nprint(t.starts_with(\"ap\"))   # True\nprint(t.search(\"apricot\"))   # False",
    go: "// Pattern: BST + Trie\n// Reference: CLRS \u00a712; Fredkin (1960)\n// Production note: use balanced BST (e.g., github.com/emirpasic/gods) for production\n\npackage main\n\nimport \"fmt\"\n\n// \u2500\u2500\u2500\u2500\u2500\u2500 BST \u2500\u2500\u2500\u2500\u2500\u2500\ntype BSTNode struct {\n\tKey   int\n\tLeft  *BSTNode\n\tRight *BSTNode\n}\n\nfunc Insert(root *BSTNode, key int) *BSTNode {\n\tif root == nil {\n\t\treturn &BSTNode{Key: key}\n\t}\n\tif key < root.Key {\n\t\troot.Left = Insert(root.Left, key)\n\t} else if key > root.Key {\n\t\troot.Right = Insert(root.Right, key)\n\t}\n\treturn root\n}\n\nfunc Inorder(root *BSTNode) []int {\n\tif root == nil {\n\t\treturn nil\n\t}\n\treturn append(append(Inorder(root.Left), root.Key), Inorder(root.Right)...)\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500 Trie \u2500\u2500\u2500\u2500\u2500\u2500\ntype TrieNode struct {\n\tChildren map[rune]*TrieNode\n\tIsEnd    bool\n}\n\nfunc NewTrieNode() *TrieNode {\n\treturn &TrieNode{Children: make(map[rune]*TrieNode)}\n}\n\ntype Trie struct{ root *TrieNode }\n\nfunc NewTrie() *Trie { return &Trie{root: NewTrieNode()} }\n\nfunc (t *Trie) Insert(word string) {\n\tnode := t.root\n\tfor _, ch := range word {\n\t\tif node.Children[ch] == nil {\n\t\t\tnode.Children[ch] = NewTrieNode()\n\t\t}\n\t\tnode = node.Children[ch]\n\t}\n\tnode.IsEnd = true\n}\n\nfunc (t *Trie) Search(word string) bool {\n\tnode := t.root\n\tfor _, ch := range word {\n\t\tif node.Children[ch] == nil {\n\t\t\treturn false\n\t\t}\n\t\tnode = node.Children[ch]\n\t}\n\treturn node.IsEnd\n}\n\nfunc main() {\n\tvar root *BSTNode\n\tfor _, v := range []int{5, 3, 7, 1, 4, 6, 8} {\n\t\troot = Insert(root, v)\n\t}\n\tfmt.Println(Inorder(root)) // [1 3 4 5 6 7 8]\n\n\ttrie := NewTrie()\n\tfor _, w := range []string{\"apple\", \"app\", \"apt\"} {\n\t\ttrie.Insert(w)\n\t}\n\tfmt.Println(trie.Search(\"app\"))    // true\n\tfmt.Println(trie.Search(\"apricot\")) // false\n}",
    typescript: "// Pattern: BST + Trie\n// Reference: CLRS \u00a712\n\ninterface BSTNode { key: number; left: BSTNode | null; right: BSTNode | null; }\nconst mkNode = (key: number): BSTNode => ({ key, left: null, right: null });\n\nfunction bstInsert(root: BSTNode | null, key: number): BSTNode {\n  if (!root) return mkNode(key);\n  if (key < root.key) root.left = bstInsert(root.left, key);\n  else if (key > root.key) root.right = bstInsert(root.right, key);\n  return root;\n}\n\nfunction inorder(root: BSTNode | null): number[] {\n  if (!root) return [];\n  return [...inorder(root.left), root.key, ...inorder(root.right)];\n}\n\nclass TrieNode {\n  children = new Map<string, TrieNode>();\n  isEnd = false;\n}\n\nclass Trie {\n  private root = new TrieNode();\n  insert(word: string): void {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());\n      node = node.children.get(ch)!;\n    }\n    node.isEnd = true;\n  }\n  search(word: string): boolean {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children.has(ch)) return false;\n      node = node.children.get(ch)!;\n    }\n    return node.isEnd;\n  }\n}\n\nlet root: BSTNode | null = null;\nfor (const v of [5, 3, 7, 1, 4, 6, 8]) root = bstInsert(root, v);\nconsole.log(inorder(root)); // [1, 3, 4, 5, 6, 7, 8]\n\nconst t = new Trie();\n[\"apple\",\"app\",\"apt\"].forEach(w => t.insert(w));\nconsole.log(t.search(\"app\"));     // true\nconsole.log(t.search(\"apricot\")); // false",
    rust: "// Pattern: BST + Trie\n// Reference: CLRS \u00a712; Fredkin (1960)\n// Production note: use BTreeMap from std for a production balanced BST\n\nuse std::collections::HashMap;\n\n// \u2500\u2500\u2500\u2500\u2500\u2500 Binary Search Tree \u2500\u2500\u2500\u2500\u2500\u2500\npub struct BST {\n    root: Option<Box<BSTNode>>,\n}\n\nstruct BSTNode {\n    key: i32,\n    left: Option<Box<BSTNode>>,\n    right: Option<Box<BSTNode>>,\n}\n\nimpl BST {\n    pub fn new() -> Self { BST { root: None } }\n\n    pub fn insert(&mut self, key: i32) {\n        Self::insert_node(&mut self.root, key);\n    }\n\n    fn insert_node(node: &mut Option<Box<BSTNode>>, key: i32) {\n        match node {\n            None => *node = Some(Box::new(BSTNode { key, left: None, right: None })),\n            Some(n) => match key.cmp(&n.key) {\n                std::cmp::Ordering::Less    => Self::insert_node(&mut n.left, key),\n                std::cmp::Ordering::Greater => Self::insert_node(&mut n.right, key),\n                std::cmp::Ordering::Equal   => {}\n            }\n        }\n    }\n\n    pub fn inorder(&self) -> Vec<i32> {\n        let mut out = Vec::new();\n        Self::inorder_node(&self.root, &mut out);\n        out\n    }\n\n    fn inorder_node(node: &Option<Box<BSTNode>>, out: &mut Vec<i32>) {\n        if let Some(n) = node {\n            Self::inorder_node(&n.left, out);\n            out.push(n.key);\n            Self::inorder_node(&n.right, out);\n        }\n    }\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500 Trie \u2500\u2500\u2500\u2500\u2500\u2500\n#[derive(Default)]\npub struct TrieNode {\n    children: HashMap<char, TrieNode>,\n    is_end: bool,\n}\n\npub struct Trie { root: TrieNode }\n\nimpl Trie {\n    pub fn new() -> Self { Trie { root: TrieNode::default() } }\n\n    pub fn insert(&mut self, word: &str) {\n        let mut node = &mut self.root;\n        for ch in word.chars() {\n            node = node.children.entry(ch).or_default();\n        }\n        node.is_end = true;\n    }\n\n    pub fn search(&self, word: &str) -> bool {\n        let mut node = &self.root;\n        for ch in word.chars() {\n            match node.children.get(&ch) {\n                None => return false,\n                Some(n) => node = n,\n            }\n        }\n        node.is_end\n    }\n}\n\nfn main() {\n    let mut bst = BST::new();\n    for v in [5, 3, 7, 1, 4, 6, 8] { bst.insert(v); }\n    println!(\"{:?}\", bst.inorder()); // [1, 3, 4, 5, 6, 7, 8]\n\n    let mut trie = Trie::new();\n    for w in [\"apple\", \"app\", \"apt\"] { trie.insert(w); }\n    println!(\"{}\", trie.search(\"app\"));     // true\n    println!(\"{}\", trie.search(\"apricot\")); // false\n}",
    java: "// Pattern: BST + Trie\n// Reference: CLRS \u00a712; Fredkin (1960)\n// Production note: Java 21 \u2014 use TreeMap<K,V> for a production red-black BST\n\nimport java.util.*;\n\npublic final class TreePatterns {\n\n    // \u2500\u2500\u2500\u2500\u2500\u2500 BST \u2500\u2500\u2500\u2500\u2500\u2500\n    public static final class BST {\n        private record Node(int key, Node left, Node right) {}\n\n        private Node root;\n\n        public void insert(int key) { root = insert(root, key); }\n\n        private Node insert(Node node, int key) {\n            if (node == null) return new Node(key, null, null);\n            return switch (Integer.compare(key, node.key)) {\n                case -1 -> new Node(node.key, insert(node.left, key), node.right);\n                case  1 -> new Node(node.key, node.left, insert(node.right, key));\n                default -> node; // duplicate: ignore\n            };\n        }\n\n        public List<Integer> inorder() {\n            var result = new ArrayList<Integer>();\n            inorder(root, result);\n            return result;\n        }\n\n        private void inorder(Node node, List<Integer> out) {\n            if (node == null) return;\n            inorder(node.left, out);\n            out.add(node.key);\n            inorder(node.right, out);\n        }\n    }\n\n    // \u2500\u2500\u2500\u2500\u2500\u2500 Trie \u2500\u2500\u2500\u2500\u2500\u2500\n    public static final class Trie {\n        private static final class TrieNode {\n            final Map<Character, TrieNode> children = new HashMap<>();\n            boolean isEnd;\n        }\n\n        private final TrieNode root = new TrieNode();\n\n        public void insert(String word) {\n            var node = root;\n            for (char ch : word.toCharArray()) {\n                node = node.children.computeIfAbsent(ch, k -> new TrieNode());\n            }\n            node.isEnd = true;\n        }\n\n        public boolean search(String word) {\n            var node = root;\n            for (char ch : word.toCharArray()) {\n                node = node.children.get(ch);\n                if (node == null) return false;\n            }\n            return node.isEnd;\n        }\n    }\n\n    public static void main(String[] args) {\n        var bst = new BST();\n        for (int v : new int[]{5, 3, 7, 1, 4, 6, 8}) bst.insert(v);\n        System.out.println(bst.inorder()); // [1, 3, 4, 5, 6, 7, 8]\n\n        var trie = new Trie();\n        for (String w : new String[]{\"apple\", \"app\", \"apt\"}) trie.insert(w);\n        System.out.println(trie.search(\"app\"));     // true\n        System.out.println(trie.search(\"apricot\")); // false\n    }\n}",
  },
  "heaps": {
    python: "# Heap patterns \u2014 Python 3.11+\nimport heapq\nfrom dataclasses import dataclass, field\n\n# ---- Top-K elements using min-heap of size k ----\ndef top_k(nums: list[int], k: int) -> list[int]:\n    \"\"\"O(n log k) \u2014 returns the k largest elements.\"\"\"\n    heap: list[int] = []\n    for n in nums:\n        heapq.heappush(heap, n)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return sorted(heap, reverse=True)\n\n# ---- Median Maintenance: two heaps ----\nclass MedianFinder:\n    \"\"\"O(log n) insert, O(1) find median. Used in sliding window median.\"\"\"\n    def __init__(self) -> None:\n        self._lo: list[int] = []  # max-heap (negated)\n        self._hi: list[int] = []  # min-heap\n\n    def add_num(self, num: int) -> None:\n        heapq.heappush(self._lo, -num)\n        # Balance: max of lo \u2264 min of hi\n        if self._hi and -self._lo[0] > self._hi[0]:\n            heapq.heappush(self._hi, -heapq.heappop(self._lo))\n        # Size invariant: |lo| == |hi| or |lo| == |hi| + 1\n        if len(self._lo) > len(self._hi) + 1:\n            heapq.heappush(self._hi, -heapq.heappop(self._lo))\n        elif len(self._hi) > len(self._lo):\n            heapq.heappush(self._lo, -heapq.heappop(self._hi))\n\n    def find_median(self) -> float:\n        if len(self._lo) > len(self._hi):\n            return float(-self._lo[0])\n        return (-self._lo[0] + self._hi[0]) / 2.0\n\n# Demo\nprint(top_k([3, 1, 5, 12, 2, 11], 3))  # [12, 11, 5]\nmf = MedianFinder()\nfor v in [1, 2, 3, 4, 5]:\n    mf.add_num(v)\nprint(mf.find_median())  # 3.0",
    go: "// Pattern: Heap \u2014 Top-K + Median Finder\n// Reference: CLRS \u00a76\n// Production note: implement heap.Interface for type-safe priority queues\n\npackage main\n\nimport (\n\t\"container/heap\"\n\t\"fmt\"\n\t\"sort\"\n)\n\n// MinHeap for Top-K\ntype MinHeap []int\nfunc (h MinHeap) Len() int           { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }\nfunc (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }\nfunc (h *MinHeap) Pop() any {\n\told := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x\n}\n\nfunc TopK(nums []int, k int) []int {\n\th := &MinHeap{}\n\theap.Init(h)\n\tfor _, n := range nums {\n\t\theap.Push(h, n)\n\t\tif h.Len() > k {\n\t\t\theap.Pop(h)\n\t\t}\n\t}\n\tresult := []int(*h)\n\tsort.Sort(sort.Reverse(sort.IntSlice(result)))\n\treturn result\n}\n\n// MaxHeap for MedianFinder\ntype MaxHeap []int\nfunc (h MaxHeap) Len() int           { return len(h) }\nfunc (h MaxHeap) Less(i, j int) bool { return h[i] > h[j] }\nfunc (h MaxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\nfunc (h *MaxHeap) Push(x any)        { *h = append(*h, x.(int)) }\nfunc (h *MaxHeap) Pop() any {\n\told := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x\n}\n\ntype MedianFinder struct { lo *MaxHeap; hi *MinHeap }\nfunc NewMedianFinder() *MedianFinder {\n\tlo, hi := &MaxHeap{}, &MinHeap{}\n\theap.Init(lo); heap.Init(hi)\n\treturn &MedianFinder{lo, hi}\n}\nfunc (mf *MedianFinder) AddNum(n int) {\n\theap.Push(mf.lo, n)\n\tif mf.hi.Len() > 0 && (*mf.lo)[0] > (*mf.hi)[0] {\n\t\theap.Push(mf.hi, heap.Pop(mf.lo))\n\t}\n\tif mf.lo.Len() > mf.hi.Len()+1 {\n\t\theap.Push(mf.hi, heap.Pop(mf.lo))\n\t} else if mf.hi.Len() > mf.lo.Len() {\n\t\theap.Push(mf.lo, heap.Pop(mf.hi))\n\t}\n}\nfunc (mf *MedianFinder) FindMedian() float64 {\n\tif mf.lo.Len() > mf.hi.Len() {\n\t\treturn float64((*mf.lo)[0])\n\t}\n\treturn float64((*mf.lo)[0]+(*mf.hi)[0]) / 2.0\n}\n\nfunc main() {\n\tfmt.Println(TopK([]int{3, 1, 5, 12, 2, 11}, 3)) // [12 11 5]\n\tmf := NewMedianFinder()\n\tfor _, v := range []int{1, 2, 3, 4, 5} { mf.AddNum(v) }\n\tfmt.Println(mf.FindMedian()) // 3\n}",
    typescript: "// Pattern: Heap \u2014 Top-K (via sorted simulation) + Median Finder\n// Production note: use @datastructures-js/priority-queue for full heap in TS\n\n// Min-heap via sorted array (illustrative; use a proper heap in production)\nclass MinHeap {\n  private data: number[] = [];\n  push(val: number): void {\n    this.data.push(val);\n    this.data.sort((a, b) => a - b);\n  }\n  pop(): number | undefined { return this.data.shift(); }\n  peek(): number | undefined { return this.data[0]; }\n  size(): number { return this.data.length; }\n}\n\nclass MaxHeap {\n  private data: number[] = [];\n  push(val: number): void {\n    this.data.push(val);\n    this.data.sort((a, b) => b - a);\n  }\n  pop(): number | undefined { return this.data.shift(); }\n  peek(): number | undefined { return this.data[0]; }\n  size(): number { return this.data.length; }\n}\n\nfunction topK(nums: readonly number[], k: number): number[] {\n  const heap = new MinHeap();\n  for (const n of nums) {\n    heap.push(n);\n    if (heap.size() > k) heap.pop();\n  }\n  return Array.from({ length: k }, () => heap.pop()!).reverse();\n}\n\nclass MedianFinder {\n  private lo = new MaxHeap();\n  private hi = new MinHeap();\n  addNum(n: number): void {\n    this.lo.push(n);\n    if (this.hi.size() > 0 && this.lo.peek()! > this.hi.peek()!) {\n      this.hi.push(this.lo.pop()!);\n    }\n    if (this.lo.size() > this.hi.size() + 1) this.hi.push(this.lo.pop()!);\n    else if (this.hi.size() > this.lo.size()) this.lo.push(this.hi.pop()!);\n  }\n  findMedian(): number {\n    if (this.lo.size() > this.hi.size()) return this.lo.peek()!;\n    return (this.lo.peek()! + this.hi.peek()!) / 2;\n  }\n}\n\nconsole.log(topK([3, 1, 5, 12, 2, 11], 3)); // [12, 11, 5]\nconst mf = new MedianFinder();\n[1,2,3,4,5].forEach(v => mf.addNum(v));\nconsole.log(mf.findMedian()); // 3",
    rust: "// Pattern: Heap \u2014 Top-K + Median Finder\n// Reference: CLRS \u00a76\n// Production note: BinaryHeap<T> in std is a max-heap; wrap values in Reverse<T> for min-heap\n\nuse std::collections::BinaryHeap;\nuse std::cmp::Reverse;\n\n/// Top-K largest elements using a min-heap of size k. O(n log k).\npub fn top_k(nums: &[i32], k: usize) -> Vec<i32> {\n    let mut heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();\n    for &n in nums {\n        heap.push(Reverse(n));\n        if heap.len() > k {\n            heap.pop(); // evicts current minimum\n        }\n    }\n    let mut result: Vec<i32> = heap.into_iter().map(|Reverse(v)| v).collect();\n    result.sort_unstable_by(|a, b| b.cmp(a)); // descending\n    result\n}\n\n/// Median finder using two heaps. O(log n) insert, O(1) median.\npub struct MedianFinder {\n    lo: BinaryHeap<i32>,          // max-heap (lower half)\n    hi: BinaryHeap<Reverse<i32>>, // min-heap (upper half)\n}\n\nimpl MedianFinder {\n    pub fn new() -> Self {\n        MedianFinder { lo: BinaryHeap::new(), hi: BinaryHeap::new() }\n    }\n\n    pub fn add_num(&mut self, num: i32) {\n        self.lo.push(num);\n        // Enforce: max(lo) <= min(hi)\n        if let (Some(&lo_max), Some(&Reverse(hi_min))) = (self.lo.peek(), self.hi.peek()) {\n            if lo_max > hi_min {\n                let v = self.lo.pop().unwrap();\n                self.hi.push(Reverse(v));\n            }\n        }\n        // Enforce size invariant: |lo| == |hi| or |lo| == |hi| + 1\n        if self.lo.len() > self.hi.len() + 1 {\n            let v = self.lo.pop().unwrap();\n            self.hi.push(Reverse(v));\n        } else if self.hi.len() > self.lo.len() {\n            let Reverse(v) = self.hi.pop().unwrap();\n            self.lo.push(v);\n        }\n    }\n\n    pub fn find_median(&self) -> f64 {\n        if self.lo.len() > self.hi.len() {\n            *self.lo.peek().unwrap() as f64\n        } else {\n            let lo_max = *self.lo.peek().unwrap() as f64;\n            let Reverse(hi_min) = *self.hi.peek().unwrap();\n            (lo_max + hi_min as f64) / 2.0\n        }\n    }\n}\n\nfn main() {\n    println!(\"{:?}\", top_k(&[3, 1, 5, 12, 2, 11], 3)); // [12, 11, 5]\n\n    let mut mf = MedianFinder::new();\n    for v in [1, 2, 3, 4, 5] { mf.add_num(v); }\n    println!(\"{}\", mf.find_median()); // 3.0\n}",
    java: "// Pattern: Heap \u2014 Top-K + Median Finder\n// Reference: CLRS \u00a76\n// Production note: Java 21 PriorityQueue is a min-heap; use Collections.reverseOrder() for max-heap\n\nimport java.util.*;\n\npublic final class HeapPatterns {\n\n    /** Top-K largest elements using a min-heap of size k. O(n log k). */\n    public static int[] topK(int[] nums, int k) {\n        // Min-heap of size k \u2014 evicts smallest when overfull\n        var heap = new PriorityQueue<Integer>(k);\n        for (int n : nums) {\n            heap.offer(n);\n            if (heap.size() > k) heap.poll(); // removes current minimum\n        }\n        int[] result = new int[k];\n        for (int i = k - 1; i >= 0; i--) result[i] = heap.poll();\n        return result;\n    }\n\n    /** Median finder using two heaps. O(log n) insert, O(1) findMedian. */\n    public static final class MedianFinder {\n        // lo = max-heap (lower half), hi = min-heap (upper half)\n        private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());\n        private final PriorityQueue<Integer> hi = new PriorityQueue<>();\n\n        public void addNum(int num) {\n            lo.offer(num);\n            // Enforce: max(lo) <= min(hi)\n            if (!hi.isEmpty() && lo.peek() > hi.peek()) {\n                hi.offer(lo.poll());\n            }\n            // Enforce size: |lo| == |hi| or |lo| == |hi| + 1\n            if (lo.size() > hi.size() + 1) {\n                hi.offer(lo.poll());\n            } else if (hi.size() > lo.size()) {\n                lo.offer(hi.poll());\n            }\n        }\n\n        public double findMedian() {\n            if (lo.size() > hi.size()) return lo.peek();\n            return (lo.peek() + hi.peek()) / 2.0;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(topK(new int[]{3, 1, 5, 12, 2, 11}, 3))); // [12, 11, 5]\n\n        var mf = new MedianFinder();\n        for (int v : new int[]{1, 2, 3, 4, 5}) mf.addNum(v);\n        System.out.println(mf.findMedian()); // 3.0\n    }\n}",
  },
  "graphs": {
    python: "# Graph: BFS, DFS, Topological Sort, Dijkstra \u2014 Python 3.11+\nfrom collections import deque, defaultdict\nimport heapq\n\nGraph = dict[int, list[tuple[int, int]]]  # node -> [(neighbour, weight)]\n\ndef bfs(graph: dict[int, list[int]], start: int) -> list[int]:\n    \"\"\"Unweighted BFS \u2014 returns nodes in discovery order.\"\"\"\n    visited = {start}\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for nb in graph.get(node, []):\n            if nb not in visited:\n                visited.add(nb)  # mark BEFORE enqueue\n                queue.append(nb)\n    return order\n\ndef topological_sort(graph: dict[int, list[int]]) -> list[int] | None:\n    \"\"\"Kahn's algorithm \u2014 returns None if cycle detected.\"\"\"\n    in_degree: dict[int, int] = defaultdict(int)\n    for u, neighbours in graph.items():\n        in_degree.setdefault(u, 0)\n        for v in neighbours:\n            in_degree[v] += 1\n    queue = deque([u for u, d in in_degree.items() if d == 0])\n    result = []\n    while queue:\n        node = queue.popleft()\n        result.append(node)\n        for nb in graph.get(node, []):\n            in_degree[nb] -= 1\n            if in_degree[nb] == 0:\n                queue.append(nb)\n    return result if len(result) == len(in_degree) else None  # None = cycle\n\ndef dijkstra(graph: Graph, src: int) -> dict[int, float]:\n    \"\"\"Dijkstra \u2014 returns dist map. graph: {node: [(neighbour, weight)]}\"\"\"\n    dist: dict[int, float] = defaultdict(lambda: float(\"inf\"))\n    dist[src] = 0\n    pq: list[tuple[float, int]] = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]:\n            continue  # stale entry\n        for v, w in graph.get(u, []):\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dict(dist)\n\n# Demo\ndag = {0: [1, 2], 1: [3], 2: [3], 3: []}\nprint(topological_sort(dag))  # [0, 1, 2, 3] or [0, 2, 1, 3]\n\nweighted: Graph = {\n    0: [(1, 4), (2, 1)],\n    1: [(3, 1)],\n    2: [(1, 2), (3, 5)],\n    3: [],\n}\nprint(dijkstra(weighted, 0))  # {0: 0, 1: 3, 2: 1, 3: 4}",
    go: "// Pattern: Graph \u2014 BFS, Topological Sort, Dijkstra\n// Reference: CLRS \u00a722, \u00a724.3\n// Production note: for production graphs use gonum.org/v1/gonum/graph\n\npackage main\n\nimport (\n\t\"container/heap\"\n\t\"fmt\"\n)\n\n// BFS returns nodes in breadth-first order from start.\nfunc BFS(graph map[int][]int, start int) []int {\n\tvisited := map[int]bool{start: true}\n\tqueue := []int{start}\n\torder := []int{}\n\tfor len(queue) > 0 {\n\t\tnode := queue[0]\n\t\tqueue = queue[1:]\n\t\torder = append(order, node)\n\t\tfor _, nb := range graph[node] {\n\t\t\tif !visited[nb] {\n\t\t\t\tvisited[nb] = true\n\t\t\t\tqueue = append(queue, nb)\n\t\t\t}\n\t\t}\n\t}\n\treturn order\n}\n\n// TopologicalSort (Kahn) returns nil if cycle detected.\nfunc TopologicalSort(graph map[int][]int) []int {\n\tinDeg := make(map[int]int)\n\tfor u, nbs := range graph {\n\t\tif _, ok := inDeg[u]; !ok { inDeg[u] = 0 }\n\t\tfor _, v := range nbs { inDeg[v]++ }\n\t}\n\tqueue := []int{}\n\tfor u, d := range inDeg {\n\t\tif d == 0 { queue = append(queue, u) }\n\t}\n\tresult := []int{}\n\tfor len(queue) > 0 {\n\t\tnode := queue[0]; queue = queue[1:]\n\t\tresult = append(result, node)\n\t\tfor _, nb := range graph[node] {\n\t\t\tinDeg[nb]--\n\t\t\tif inDeg[nb] == 0 { queue = append(queue, nb) }\n\t\t}\n\t}\n\tif len(result) != len(inDeg) { return nil }\n\treturn result\n}\n\n// ---- Dijkstra ----\ntype Edge struct{ to, weight int }\ntype Item struct{ node int; dist float64; index int }\ntype PQ []*Item\nfunc (pq PQ) Len() int            { return len(pq) }\nfunc (pq PQ) Less(i, j int) bool  { return pq[i].dist < pq[j].dist }\nfunc (pq PQ) Swap(i, j int)       { pq[i], pq[j] = pq[j], pq[i]; pq[i].index = i; pq[j].index = j }\nfunc (pq *PQ) Push(x any)         { item := x.(*Item); item.index = len(*pq); *pq = append(*pq, item) }\nfunc (pq *PQ) Pop() any           { old := *pq; n := len(old); x := old[n-1]; *pq = old[:n-1]; return x }\n\nfunc Dijkstra(graph map[int][]Edge, src int) map[int]float64 {\n\tconst inf = float64(1e18)\n\tdist := make(map[int]float64)\n\tfor n := range graph { dist[n] = inf }\n\tdist[src] = 0\n\tpq := &PQ{{node: src, dist: 0}}\n\theap.Init(pq)\n\tfor pq.Len() > 0 {\n\t\tcur := heap.Pop(pq).(*Item)\n\t\tif cur.dist > dist[cur.node] { continue }\n\t\tfor _, e := range graph[cur.node] {\n\t\t\tif nd := cur.dist + float64(e.weight); nd < dist[e.to] {\n\t\t\t\tdist[e.to] = nd\n\t\t\t\theap.Push(pq, &Item{node: e.to, dist: nd})\n\t\t\t}\n\t\t}\n\t}\n\treturn dist\n}\n\nfunc main() {\n\tdag := map[int][]int{0: {1, 2}, 1: {3}, 2: {3}, 3: {}}\n\tfmt.Println(TopologicalSort(dag))\n\twg := map[int][]Edge{0: {{1, 4}, {2, 1}}, 1: {{3, 1}}, 2: {{1, 2}, {3, 5}}, 3: {}}\n\tfmt.Println(Dijkstra(wg, 0)) // map[0:0 1:3 2:1 3:4]\n}",
    typescript: "// Pattern: Graph \u2014 BFS, Topological Sort, Dijkstra\n// Reference: CLRS \u00a722, \u00a724\n\ntype WGraph = Map<number, Array<[number, number]>>; // node -> [neighbour, weight][]\n\nfunction bfs(graph: Map<number, number[]>, start: number): number[] {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order: number[] = [];\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    order.push(node);\n    for (const nb of graph.get(node) ?? []) {\n      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }\n    }\n  }\n  return order;\n}\n\nfunction topologicalSort(graph: Map<number, number[]>): number[] | null {\n  const inDeg = new Map<number, number>();\n  for (const [u, nbs] of graph) {\n    if (!inDeg.has(u)) inDeg.set(u, 0);\n    for (const v of nbs) inDeg.set(v, (inDeg.get(v) ?? 0) + 1);\n  }\n  const queue = [...inDeg.entries()].filter(([,d]) => d === 0).map(([u]) => u);\n  const result: number[] = [];\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    result.push(node);\n    for (const nb of graph.get(node) ?? []) {\n      inDeg.set(nb, inDeg.get(nb)! - 1);\n      if (inDeg.get(nb) === 0) queue.push(nb);\n    }\n  }\n  return result.length === inDeg.size ? result : null;\n}\n\nfunction dijkstra(graph: WGraph, src: number): Map<number, number> {\n  const dist = new Map<number, number>();\n  for (const n of graph.keys()) dist.set(n, Infinity);\n  dist.set(src, 0);\n  // Simple O(V\u00b2) \u2014 replace with binary heap for large graphs\n  const unvisited = new Set(graph.keys());\n  while (unvisited.size > 0) {\n    let u = [...unvisited].reduce((a, b) => dist.get(a)! < dist.get(b)! ? a : b);\n    unvisited.delete(u);\n    for (const [v, w] of graph.get(u) ?? []) {\n      const nd = dist.get(u)! + w;\n      if (nd < dist.get(v)!) dist.set(v, nd);\n    }\n  }\n  return dist;\n}\n\nconst wg: WGraph = new Map([[0, [[1,4],[2,1]]], [1, [[3,1]]], [2, [[1,2],[3,5]]], [3, []]]);\nconsole.log([...dijkstra(wg, 0).entries()]); // [0,0],[1,3],[2,1],[3,4]",
    rust: "// Pattern: Graph \u2014 BFS, Topological Sort, Dijkstra\n// Reference: CLRS \u00a722, \u00a724\n// Production note: use petgraph crate for production graph algorithms\n\nuse std::collections::{BinaryHeap, HashMap, HashSet, VecDeque};\nuse std::cmp::Reverse;\n\ntype Graph = HashMap<usize, Vec<usize>>;\ntype WGraph = HashMap<usize, Vec<(usize, u32)>>;\n\n/// BFS \u2014 returns nodes in discovery order.\npub fn bfs(graph: &Graph, start: usize) -> Vec<usize> {\n    let mut visited = HashSet::from([start]);\n    let mut queue = VecDeque::from([start]);\n    let mut order = Vec::new();\n    while let Some(node) = queue.pop_front() {\n        order.push(node);\n        for &nb in graph.get(&node).into_iter().flatten() {\n            if visited.insert(nb) {\n                queue.push_back(nb);\n            }\n        }\n    }\n    order\n}\n\n/// Kahn's topological sort. Returns None if cycle detected.\npub fn topological_sort(graph: &Graph) -> Option<Vec<usize>> {\n    let mut in_deg: HashMap<usize, usize> = HashMap::new();\n    for (&u, nbs) in graph {\n        in_deg.entry(u).or_insert(0);\n        for &v in nbs { *in_deg.entry(v).or_insert(0) += 1; }\n    }\n    let mut queue: VecDeque<usize> = in_deg.iter()\n        .filter(|(_, &d)| d == 0).map(|(&u, _)| u).collect();\n    let mut result = Vec::new();\n    while let Some(node) = queue.pop_front() {\n        result.push(node);\n        for &nb in graph.get(&node).into_iter().flatten() {\n            let d = in_deg.get_mut(&nb).unwrap();\n            *d -= 1;\n            if *d == 0 { queue.push_back(nb); }\n        }\n    }\n    if result.len() == in_deg.len() { Some(result) } else { None }\n}\n\n/// Dijkstra \u2014 returns shortest distances from src.\npub fn dijkstra(graph: &WGraph, src: usize) -> HashMap<usize, u32> {\n    let mut dist: HashMap<usize, u32> = graph.keys().map(|&n| (n, u32::MAX)).collect();\n    dist.insert(src, 0);\n    let mut heap = BinaryHeap::from([Reverse((0u32, src))]);\n    while let Some(Reverse((d, u))) = heap.pop() {\n        if d > dist[&u] { continue; }\n        for &(v, w) in graph.get(&u).into_iter().flatten() {\n            let nd = d + w;\n            if nd < *dist.get(&v).unwrap_or(&u32::MAX) {\n                dist.insert(v, nd);\n                heap.push(Reverse((nd, v)));\n            }\n        }\n    }\n    dist\n}\n\nfn main() {\n    let dag: Graph = [(0, vec![1,2]), (1, vec![3]), (2, vec![3]), (3, vec![])].into();\n    println!(\"{:?}\", topological_sort(&dag));\n\n    let wg: WGraph = [(0, vec![(1,4),(2,1)]), (1, vec![(3,1)]), (2, vec![(1,2),(3,5)]), (3, vec![])].into();\n    let mut dists: Vec<_> = dijkstra(&wg, 0).into_iter().collect();\n    dists.sort_by_key(|&(k,_)| k);\n    println!(\"{:?}\", dists); // [(0,0),(1,3),(2,1),(3,4)]\n}",
    java: "// Pattern: Graph \u2014 BFS, Topological Sort, Dijkstra\n// Reference: CLRS \u00a722, \u00a724\n// Production note: JGraphT library for production graph algorithms in Java\n\nimport java.util.*;\n\npublic final class GraphAlgorithms {\n\n    /** BFS \u2014 returns nodes in discovery order (unweighted graph). */\n    public static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {\n        var visited = new HashSet<>(Set.of(start));\n        var queue = new ArrayDeque<>(List.of(start));\n        var order = new ArrayList<Integer>();\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            order.add(node);\n            for (int nb : graph.getOrDefault(node, List.of())) {\n                if (visited.add(nb)) queue.offer(nb);\n            }\n        }\n        return order;\n    }\n\n    /** Kahn's topological sort. Returns null if cycle detected. */\n    public static List<Integer> topologicalSort(Map<Integer, List<Integer>> graph) {\n        var inDeg = new HashMap<Integer, Integer>();\n        for (var entry : graph.entrySet()) {\n            inDeg.putIfAbsent(entry.getKey(), 0);\n            for (int v : entry.getValue())\n                inDeg.merge(v, 1, Integer::sum);\n        }\n        var queue = new ArrayDeque<Integer>();\n        inDeg.forEach((u, d) -> { if (d == 0) queue.offer(u); });\n        var result = new ArrayList<Integer>();\n        while (!queue.isEmpty()) {\n            int node = queue.poll();\n            result.add(node);\n            for (int nb : graph.getOrDefault(node, List.of())) {\n                if (inDeg.merge(nb, -1, Integer::sum) == 0) queue.offer(nb);\n            }\n        }\n        return result.size() == inDeg.size() ? result : null;\n    }\n\n    /** Dijkstra \u2014 returns map of shortest distances from src. */\n    public static Map<Integer, Integer> dijkstra(\n            Map<Integer, List<int[]>> graph, int src) {\n        // int[] = {neighbour, weight}\n        var dist = new HashMap<Integer, Integer>();\n        graph.keySet().forEach(n -> dist.put(n, Integer.MAX_VALUE));\n        dist.put(src, 0);\n        // PQ ordered by distance\n        var pq = new PriorityQueue<int[]>(Comparator.comparingInt(a -> a[1]));\n        pq.offer(new int[]{src, 0});\n        while (!pq.isEmpty()) {\n            var cur = pq.poll();\n            int u = cur[0], d = cur[1];\n            if (d > dist.get(u)) continue;\n            for (int[] edge : graph.getOrDefault(u, List.of())) {\n                int v = edge[0], w = edge[1];\n                int nd = d + w;\n                if (nd < dist.get(v)) {\n                    dist.put(v, nd);\n                    pq.offer(new int[]{v, nd});\n                }\n            }\n        }\n        return dist;\n    }\n\n    public static void main(String[] args) {\n        var dag = Map.of(0, List.of(1,2), 1, List.of(3), 2, List.of(3), 3, List.<Integer>of());\n        System.out.println(topologicalSort(dag));\n\n        var wg = new HashMap<Integer, List<int[]>>();\n        wg.put(0, List.of(new int[]{1,4}, new int[]{2,1}));\n        wg.put(1, List.of(new int[]{3,1}));\n        wg.put(2, List.of(new int[]{1,2}, new int[]{3,5}));\n        wg.put(3, List.of());\n        var dists = new TreeMap<>(dijkstra(wg, 0));\n        System.out.println(dists); // {0=0, 1=3, 2=1, 3=4}\n    }\n}",
  },
  "sorting": {
    python: "# Sorting Algorithms \u2014 Python 3.11+\n\ndef merge_sort(arr: list[int]) -> list[int]:\n    \"\"\"Stable O(n log n). Returns new sorted list.\"\"\"\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    # Merge\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:  # <= preserves stability\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\ndef quicksort(arr: list[int], lo: int = 0, hi: int | None = None) -> None:\n    \"\"\"In-place O(n log n) average, O(n\u00b2) worst case. Randomised pivot.\"\"\"\n    import random\n    if hi is None:\n        hi = len(arr) - 1\n    if lo >= hi:\n        return\n    # Randomised pivot\n    pivot_idx = random.randint(lo, hi)\n    arr[pivot_idx], arr[hi] = arr[hi], arr[pivot_idx]\n    pivot = arr[hi]\n    i = lo - 1\n    for j in range(lo, hi):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]\n    p = i + 1\n    quicksort(arr, lo, p - 1)\n    quicksort(arr, p + 1, hi)\n\ndef counting_sort(arr: list[int]) -> list[int]:\n    \"\"\"O(n + k) for integers in [0, k]. Not comparison-based.\"\"\"\n    if not arr:\n        return []\n    k = max(arr)\n    count = [0] * (k + 1)\n    for x in arr:\n        count[x] += 1\n    result = []\n    for val, freq in enumerate(count):\n        result.extend([val] * freq)\n    return result\n\n# Demo\ndata = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(merge_sort(data))     # [1, 1, 2, 3, 4, 5, 6, 9]\nqs = data[:]\nquicksort(qs)\nprint(qs)                   # [1, 1, 2, 3, 4, 5, 6, 9]\nprint(counting_sort(data))  # [1, 1, 2, 3, 4, 5, 6, 9]",
    go: "// Pattern: Sorting \u2014 MergeSort, QuickSort, CountingSort\n// Reference: CLRS \u00a72.3, \u00a77, \u00a78\n// Production note: sort.Slice uses pdqsort (pattern-defeating quicksort) since Go 1.19\n\npackage main\n\nimport (\n\t\"fmt\"\n\t\"math/rand\"\n)\n\nfunc MergeSort(arr []int) []int {\n\tif len(arr) <= 1 { return arr }\n\tmid := len(arr) / 2\n\tleft := MergeSort(arr[:mid])\n\tright := MergeSort(arr[mid:])\n\treturn merge(left, right)\n}\n\nfunc merge(l, r []int) []int {\n\tresult := make([]int, 0, len(l)+len(r))\n\ti, j := 0, 0\n\tfor i < len(l) && j < len(r) {\n\t\tif l[i] <= r[j] { result = append(result, l[i]); i++ } else { result = append(result, r[j]); j++ }\n\t}\n\treturn append(append(result, l[i:]...), r[j:]...)\n}\n\nfunc QuickSort(arr []int, lo, hi int) {\n\tif lo >= hi { return }\n\tp := partition(arr, lo, hi)\n\tQuickSort(arr, lo, p-1)\n\tQuickSort(arr, p+1, hi)\n}\n\nfunc partition(arr []int, lo, hi int) int {\n\tpivotIdx := lo + rand.Intn(hi-lo+1)\n\tarr[pivotIdx], arr[hi] = arr[hi], arr[pivotIdx]\n\tpivot, i := arr[hi], lo-1\n\tfor j := lo; j < hi; j++ {\n\t\tif arr[j] <= pivot { i++; arr[i], arr[j] = arr[j], arr[i] }\n\t}\n\tarr[i+1], arr[hi] = arr[hi], arr[i+1]\n\treturn i + 1\n}\n\nfunc CountingSort(arr []int) []int {\n\tif len(arr) == 0 { return nil }\n\tk := 0\n\tfor _, v := range arr { if v > k { k = v } }\n\tcount := make([]int, k+1)\n\tfor _, v := range arr { count[v]++ }\n\tresult := make([]int, 0, len(arr))\n\tfor val, freq := range count {\n\t\tfor i := 0; i < freq; i++ { result = append(result, val) }\n\t}\n\treturn result\n}\n\nfunc main() {\n\tdata := []int{3, 1, 4, 1, 5, 9, 2, 6}\n\tfmt.Println(MergeSort(data))\n\tqs := append([]int{}, data...)\n\tQuickSort(qs, 0, len(qs)-1)\n\tfmt.Println(qs)\n\tfmt.Println(CountingSort(data))\n}",
    typescript: "// Pattern: Sorting \u2014 MergeSort, QuickSort, CountingSort\n// Reference: CLRS \u00a72.3, \u00a77, \u00a78\n\nfunction mergeSort(arr: readonly number[]): number[] {\n  if (arr.length <= 1) return [...arr];\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const result: number[] = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    result.push(left[i] <= right[j] ? left[i++] : right[j++]);\n  }\n  return [...result, ...left.slice(i), ...right.slice(j)];\n}\n\nfunction quickSort(arr: number[], lo = 0, hi = arr.length - 1): void {\n  if (lo >= hi) return;\n  const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));\n  [arr[pivotIdx], arr[hi]] = [arr[hi], arr[pivotIdx]];\n  const pivot = arr[hi];\n  let i = lo - 1;\n  for (let j = lo; j < hi; j++) {\n    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }\n  }\n  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];\n  const p = i + 1;\n  quickSort(arr, lo, p - 1);\n  quickSort(arr, p + 1, hi);\n}\n\nfunction countingSort(arr: readonly number[]): number[] {\n  if (!arr.length) return [];\n  const k = Math.max(...arr);\n  const count = new Array<number>(k + 1).fill(0);\n  for (const x of arr) count[x]++;\n  return count.flatMap((freq, val) => Array<number>(freq).fill(val));\n}\n\nconst data = [3, 1, 4, 1, 5, 9, 2, 6];\nconsole.log(mergeSort(data));\nconst qs = [...data]; quickSort(qs);\nconsole.log(qs);\nconsole.log(countingSort(data));",
    rust: "// Pattern: Sorting \u2014 MergeSort, QuickSort, CountingSort\n// Reference: CLRS \u00a72.3, \u00a77, \u00a78\n// Production note: std::slice::sort_unstable is introsort (quicksort + heapsort); sort is Timsort\n\n/// Stable merge sort returning a new Vec. O(n log n) time, O(n) space.\npub fn merge_sort(arr: &[i32]) -> Vec<i32> {\n    if arr.len() <= 1 { return arr.to_vec(); }\n    let mid = arr.len() / 2;\n    let left = merge_sort(&arr[..mid]);\n    let right = merge_sort(&arr[mid..]);\n    merge(&left, &right)\n}\n\nfn merge(l: &[i32], r: &[i32]) -> Vec<i32> {\n    let mut result = Vec::with_capacity(l.len() + r.len());\n    let (mut i, mut j) = (0, 0);\n    while i < l.len() && j < r.len() {\n        if l[i] <= r[j] { result.push(l[i]); i += 1; }\n        else             { result.push(r[j]); j += 1; }\n    }\n    result.extend_from_slice(&l[i..]);\n    result.extend_from_slice(&r[j..]);\n    result\n}\n\n/// In-place quicksort with randomised pivot. O(n log n) average.\npub fn quick_sort(arr: &mut [i32]) {\n    if arr.len() <= 1 { return; }\n    let pivot_idx = partition(arr);\n    quick_sort(&mut arr[..pivot_idx]);\n    quick_sort(&mut arr[pivot_idx + 1..]);\n}\n\nfn partition(arr: &mut [i32]) -> usize {\n    // Median-of-three pivot\n    let hi = arr.len() - 1;\n    let mid = hi / 2;\n    if arr[mid] < arr[0]  { arr.swap(mid, 0); }\n    if arr[hi]  < arr[0]  { arr.swap(hi, 0);  }\n    if arr[mid] < arr[hi] { arr.swap(mid, hi); }\n    let pivot = arr[hi];\n    let mut i = 0;\n    for j in 0..hi {\n        if arr[j] <= pivot { arr.swap(i, j); i += 1; }\n    }\n    arr.swap(i, hi);\n    i\n}\n\n/// Counting sort for non-negative integers. O(n + k).\npub fn counting_sort(arr: &[usize]) -> Vec<usize> {\n    if arr.is_empty() { return Vec::new(); }\n    let k = *arr.iter().max().unwrap();\n    let mut count = vec![0usize; k + 1];\n    for &v in arr { count[v] += 1; }\n    count.iter().enumerate()\n        .flat_map(|(val, &freq)| std::iter::repeat(val).take(freq))\n        .collect()\n}\n\nfn main() {\n    let data = [3i32, 1, 4, 1, 5, 9, 2, 6];\n    println!(\"{:?}\", merge_sort(&data));\n\n    let mut qs = data.to_vec();\n    quick_sort(&mut qs);\n    println!(\"{:?}\", qs);\n\n    let data_u = [3usize, 1, 4, 1, 5, 9, 2, 6];\n    println!(\"{:?}\", counting_sort(&data_u));\n}",
    java: "// Pattern: Sorting \u2014 MergeSort, QuickSort, CountingSort\n// Reference: CLRS \u00a72.3, \u00a77, \u00a78\n// Production note: Arrays.sort(int[]) uses dual-pivot quicksort; Arrays.sort(Object[]) uses Timsort\n\nimport java.util.Arrays;\nimport java.util.Random;\n\npublic final class SortingAlgorithms {\n    private static final Random RNG = new Random();\n\n    /** Stable merge sort returning a new array. O(n log n), O(n) space. */\n    public static int[] mergeSort(int[] arr) {\n        if (arr.length <= 1) return arr.clone();\n        int mid = arr.length / 2;\n        int[] left  = mergeSort(Arrays.copyOfRange(arr, 0, mid));\n        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));\n        return merge(left, right);\n    }\n\n    private static int[] merge(int[] l, int[] r) {\n        int[] result = new int[l.length + r.length];\n        int i = 0, j = 0, k = 0;\n        while (i < l.length && j < r.length)\n            result[k++] = l[i] <= r[j] ? l[i++] : r[j++];\n        while (i < l.length) result[k++] = l[i++];\n        while (j < r.length) result[k++] = r[j++];\n        return result;\n    }\n\n    /** In-place quicksort with randomised pivot. O(n log n) average. */\n    public static void quickSort(int[] arr, int lo, int hi) {\n        if (lo >= hi) return;\n        int pivotIdx = lo + RNG.nextInt(hi - lo + 1);\n        swap(arr, pivotIdx, hi);\n        int pivot = arr[hi], i = lo - 1;\n        for (int j = lo; j < hi; j++) {\n            if (arr[j] <= pivot) swap(arr, ++i, j);\n        }\n        swap(arr, i + 1, hi);\n        int p = i + 1;\n        quickSort(arr, lo, p - 1);\n        quickSort(arr, p + 1, hi);\n    }\n\n    private static void swap(int[] arr, int i, int j) {\n        int t = arr[i]; arr[i] = arr[j]; arr[j] = t;\n    }\n\n    /** Counting sort for non-negative integers. O(n + k). */\n    public static int[] countingSort(int[] arr) {\n        if (arr.length == 0) return arr;\n        int k = Arrays.stream(arr).max().getAsInt();\n        int[] count = new int[k + 1];\n        for (int v : arr) count[v]++;\n        int[] result = new int[arr.length];\n        int idx = 0;\n        for (int val = 0; val <= k; val++)\n            for (int f = 0; f < count[val]; f++) result[idx++] = val;\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] data = {3, 1, 4, 1, 5, 9, 2, 6};\n        System.out.println(Arrays.toString(mergeSort(data)));\n\n        int[] qs = data.clone();\n        quickSort(qs, 0, qs.length - 1);\n        System.out.println(Arrays.toString(qs));\n\n        System.out.println(Arrays.toString(countingSort(data)));\n    }\n}",
  },
  "dp": {
    python: "# Dynamic Programming \u2014 LCS, Edit Distance, 0/1 Knapsack \u2014 Python 3.11+\n\n# ---- Longest Common Subsequence ----\ndef lcs(s: str, t: str) -> str:\n    \"\"\"O(mn) time and space. Returns the LCS string.\"\"\"\n    m, n = len(s), len(t)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s[i-1] == t[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    # Backtrack\n    result, i, j = [], m, n\n    while i > 0 and j > 0:\n        if s[i-1] == t[j-1]:\n            result.append(s[i-1]); i -= 1; j -= 1\n        elif dp[i-1][j] > dp[i][j-1]:\n            i -= 1\n        else:\n            j -= 1\n    return \"\".join(reversed(result))\n\n# ---- Edit Distance (Levenshtein) ----\ndef edit_distance(s: str, t: str) -> int:\n    \"\"\"O(mn) \u2014 minimum insert/delete/replace to convert s to t.\"\"\"\n    m, n = len(s), len(t)\n    dp = list(range(n + 1))\n    for i in range(1, m + 1):\n        prev = dp[:]\n        dp[0] = i\n        for j in range(1, n + 1):\n            if s[i-1] == t[j-1]:\n                dp[j] = prev[j-1]\n            else:\n                dp[j] = 1 + min(prev[j-1], prev[j], dp[j-1])\n    return dp[n]\n\n# ---- 0/1 Knapsack ----\ndef knapsack(weights: list[int], values: list[int], capacity: int) -> int:\n    \"\"\"O(n * capacity). Returns maximum value achievable.\"\"\"\n    n = len(weights)\n    dp = [0] * (capacity + 1)\n    for i in range(n):\n        for w in range(capacity, weights[i] - 1, -1):  # iterate backwards\n            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])\n    return dp[capacity]\n\n# Demo\nprint(lcs(\"ABCBDAB\", \"BDCAB\"))  # BCAB or BDAB (length 4)\nprint(edit_distance(\"kitten\", \"sitting\"))  # 3\nprint(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))  # 9",
    go: "// Pattern: Dynamic Programming \u2014 LCS, Edit Distance, Knapsack\n// Reference: CLRS \u00a715; Bellman (1957)\n// Production note: space-optimised DP uses O(min(m,n)) by rolling two rows\n\npackage main\n\nimport \"fmt\"\n\n// LCS returns length of longest common subsequence.\nfunc LCS(s, t string) int {\n\tm, n := len(s), len(t)\n\tdp := make([][]int, m+1)\n\tfor i := range dp { dp[i] = make([]int, n+1) }\n\tfor i := 1; i <= m; i++ {\n\t\tfor j := 1; j <= n; j++ {\n\t\t\tif s[i-1] == t[j-1] {\n\t\t\t\tdp[i][j] = dp[i-1][j-1] + 1\n\t\t\t} else if dp[i-1][j] > dp[i][j-1] {\n\t\t\t\tdp[i][j] = dp[i-1][j]\n\t\t\t} else {\n\t\t\t\tdp[i][j] = dp[i][j-1]\n\t\t\t}\n\t\t}\n\t}\n\treturn dp[m][n]\n}\n\n// EditDistance returns minimum edit operations (Levenshtein).\nfunc EditDistance(s, t string) int {\n\tn := len(t)\n\tdp := make([]int, n+1)\n\tfor j := range dp { dp[j] = j }\n\tfor i := 1; i <= len(s); i++ {\n\t\tprev := make([]int, n+1)\n\t\tcopy(prev, dp)\n\t\tdp[0] = i\n\t\tfor j := 1; j <= n; j++ {\n\t\t\tif s[i-1] == t[j-1] {\n\t\t\t\tdp[j] = prev[j-1]\n\t\t\t} else {\n\t\t\t\tdp[j] = 1 + min3(prev[j-1], prev[j], dp[j-1])\n\t\t\t}\n\t\t}\n\t}\n\treturn dp[n]\n}\n\nfunc min3(a, b, c int) int {\n\tif a < b { if a < c { return a }; return c }\n\tif b < c { return b }; return c\n}\n\n// Knapsack01 returns max value for 0/1 knapsack.\nfunc Knapsack01(weights, values []int, capacity int) int {\n\tdp := make([]int, capacity+1)\n\tfor i := range weights {\n\t\tfor w := capacity; w >= weights[i]; w-- {\n\t\t\tif dp[w-weights[i]]+values[i] > dp[w] {\n\t\t\t\tdp[w] = dp[w-weights[i]] + values[i]\n\t\t\t}\n\t\t}\n\t}\n\treturn dp[capacity]\n}\n\nfunc main() {\n\tfmt.Println(LCS(\"ABCBDAB\", \"BDCAB\"))                          // 4\n\tfmt.Println(EditDistance(\"kitten\", \"sitting\"))                // 3\n\tfmt.Println(Knapsack01([]int{1,3,4,5}, []int{1,4,5,7}, 7))  // 9\n}",
    typescript: "// Pattern: Dynamic Programming \u2014 LCS, Edit Distance, Knapsack\n// Reference: CLRS \u00a715\n\nfunction lcsLength(s: string, t: string): number {\n  const m = s.length, n = t.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = s[i-1] === t[j-1]\n        ? dp[i-1][j-1] + 1\n        : Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n  }\n  return dp[m][n];\n}\n\nfunction editDistance(s: string, t: string): number {\n  const n = t.length;\n  let dp = Array.from({ length: n + 1 }, (_, i) => i);\n  for (let i = 1; i <= s.length; i++) {\n    const prev = [...dp];\n    dp[0] = i;\n    for (let j = 1; j <= n; j++) {\n      dp[j] = s[i-1] === t[j-1]\n        ? prev[j-1]\n        : 1 + Math.min(prev[j-1], prev[j], dp[j-1]);\n    }\n  }\n  return dp[n];\n}\n\nfunction knapsack01(weights: readonly number[], values: readonly number[], capacity: number): number {\n  const dp = new Array<number>(capacity + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    for (let w = capacity; w >= weights[i]; w--) {\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n  }\n  return dp[capacity];\n}\n\nconsole.log(lcsLength(\"ABCBDAB\", \"BDCAB\"));              // 4\nconsole.log(editDistance(\"kitten\", \"sitting\"));           // 3\nconsole.log(knapsack01([1,3,4,5], [1,4,5,7], 7));       // 9",
    rust: "// Pattern: Dynamic Programming \u2014 LCS, Edit Distance, 0/1 Knapsack\n// Reference: CLRS \u00a715; Bellman (1957)\n// Production note: space-optimised DP uses O(min(m,n)) by rolling two rows\n\n/// LCS length. O(mn) time, O(mn) space.\npub fn lcs(s: &[u8], t: &[u8]) -> usize {\n    let (m, n) = (s.len(), t.len());\n    let mut dp = vec![vec![0usize; n + 1]; m + 1];\n    for i in 1..=m {\n        for j in 1..=n {\n            dp[i][j] = if s[i-1] == t[j-1] {\n                dp[i-1][j-1] + 1\n            } else {\n                dp[i-1][j].max(dp[i][j-1])\n            };\n        }\n    }\n    dp[m][n]\n}\n\n/// Levenshtein edit distance. Space-optimised O(n) rolling array.\npub fn edit_distance(s: &str, t: &str) -> usize {\n    let t: Vec<char> = t.chars().collect();\n    let n = t.len();\n    let mut dp: Vec<usize> = (0..=n).collect();\n    for (i, sc) in s.chars().enumerate() {\n        let mut prev = dp.clone();\n        dp[0] = i + 1;\n        for j in 1..=n {\n            dp[j] = if sc == t[j-1] {\n                prev[j-1]\n            } else {\n                1 + prev[j-1].min(prev[j]).min(dp[j-1])\n            };\n        }\n        prev = dp.clone(); // suppress unused warning\n        let _ = prev;\n    }\n    dp[n]\n}\n\n/// 0/1 Knapsack with space-optimised O(capacity) DP.\npub fn knapsack_01(weights: &[usize], values: &[usize], capacity: usize) -> usize {\n    let mut dp = vec![0usize; capacity + 1];\n    for i in 0..weights.len() {\n        for w in (weights[i]..=capacity).rev() {\n            dp[w] = dp[w].max(dp[w - weights[i]] + values[i]);\n        }\n    }\n    dp[capacity]\n}\n\nfn main() {\n    println!(\"{}\", lcs(b\"ABCBDAB\", b\"BDCAB\"));                         // 4\n    println!(\"{}\", edit_distance(\"kitten\", \"sitting\"));                  // 3\n    println!(\"{}\", knapsack_01(&[1,3,4,5], &[1,4,5,7], 7));            // 9\n}",
    java: "// Pattern: Dynamic Programming \u2014 LCS, Edit Distance, 0/1 Knapsack\n// Reference: CLRS \u00a715; Bellman (1957)\n// Production note: Java 21 \u2014 use int[] rolling array for O(n) space; avoid 2D arrays for large inputs\n\npublic final class DynamicProgramming {\n\n    /** LCS length. O(mn) time and space. */\n    public static int lcs(String s, String t) {\n        int m = s.length(), n = t.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                dp[i][j] = s.charAt(i-1) == t.charAt(j-1)\n                    ? dp[i-1][j-1] + 1\n                    : Math.max(dp[i-1][j], dp[i][j-1]);\n            }\n        }\n        return dp[m][n];\n    }\n\n    /** Levenshtein edit distance with O(n) space rolling array. */\n    public static int editDistance(String s, String t) {\n        int n = t.length();\n        int[] dp = new int[n + 1];\n        for (int j = 0; j <= n; j++) dp[j] = j;\n        for (int i = 1; i <= s.length(); i++) {\n            int[] prev = dp.clone();\n            dp[0] = i;\n            for (int j = 1; j <= n; j++) {\n                dp[j] = s.charAt(i-1) == t.charAt(j-1)\n                    ? prev[j-1]\n                    : 1 + Math.min(prev[j-1], Math.min(prev[j], dp[j-1]));\n            }\n        }\n        return dp[n];\n    }\n\n    /** 0/1 Knapsack with space-optimised O(capacity) DP. */\n    public static int knapsack01(int[] weights, int[] values, int capacity) {\n        int[] dp = new int[capacity + 1];\n        for (int i = 0; i < weights.length; i++) {\n            // Iterate backwards to prevent using item i twice\n            for (int w = capacity; w >= weights[i]; w--) {\n                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n            }\n        }\n        return dp[capacity];\n    }\n\n    public static void main(String[] args) {\n        System.out.println(lcs(\"ABCBDAB\", \"BDCAB\"));                      // 4\n        System.out.println(editDistance(\"kitten\", \"sitting\"));             // 3\n        System.out.println(knapsack01(new int[]{1,3,4,5}, new int[]{1,4,5,7}, 7)); // 9\n    }\n}",
  },
};


const DSA_TOPICS = [
  {
    id: "arrays",
    name: "Arrays & Strings",
    tier: "beginner",
    emoji: "▦",
    color: "#3b82f6",
    realWorld: "Database row storage, image pixel buffers (PNG/JPEG), CPU cache lines",
    companies: "Used by virtually every system; JPEG stores pixels in flat arrays",
    diagram: {
      nodes: [
        { id: "mem", label: "Contiguous Memory", x: 50, y: 80, w: 200, h: 44, color: "#8b5cf6" },
        { id: "idx", label: "Index → O(1) Access", x: 310, y: 80, w: 200, h: 44, color: "#3b82f6" },
        { id: "insert", label: "Insert/Delete → O(n) Shift", x: 50, y: 180, w: 200, h: 44, color: "#ef4444" },
        { id: "cache", label: "CPU Cache-Friendly", x: 310, y: 180, w: 200, h: 44, color: "#10b981" },
      ],
      edges: [
        { from: "mem", to: "idx", label: "enables" },
        { from: "mem", to: "cache", label: "locality" },
        { from: "idx", to: "insert", label: "cost" },
      ],
    },
    concepts: [
      {
        term: "Contiguous Allocation",
        source: "CLRS §10.1",
        def: "Array elements occupy adjacent memory addresses, enabling O(1) random access via base + index × size.",
        why: "CPU cache lines (64 bytes) load neighbouring elements, making sequential scans extremely fast.",
        mistake: "Conflating arrays with linked lists — linked lists have O(n) access but O(1) insert at a known pointer.",
      },
      {
        term: "Two-Pointer Technique",
        source: "LeetCode patterns / competitive programming canon",
        def: "Two indices traverse the array from opposite ends (or at different speeds) to avoid nested loops.",
        why: "Reduces O(n²) brute-force comparisons to O(n) for problems like pair sums, palindrome checks.",
        mistake: "Forgetting to handle the case where pointers cross — always verify loop invariant before swap.",
      },
      {
        term: "Sliding Window",
        source: "Competitive programming; popularised by Grokking the Coding Interview",
        def: "A subarray of fixed or variable length slides across the input, maintaining an invariant (sum, max, distinct count).",
        why: "Converts O(n·k) recomputation to O(n) by incrementally adding/removing elements at window edges.",
        mistake: "Using a window for non-contiguous subsets — the pattern requires contiguity.",
      },
      {
        term: "Prefix Sum",
        source: "CLRS §14",
        def: "Precomputed cumulative sums allow range-sum queries in O(1) after O(n) build time.",
        why: "Foundation for 2D image integrals (used in Viola-Jones face detection) and competitive range queries.",
        mistake: "Off-by-one errors: prefix[i] = sum of first i elements, not sum ending at index i.",
      },
    ],
    tradeoffs: {
      use: "Random access by index, cache-friendly iteration, fixed-size data (sensor readings, image channels).",
      avoid: "Frequent insertions/deletions at arbitrary positions; prefer linked list or deque.",
    },
    complexity: { access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)", space: "O(n)" },
    code: CODE["arrays"],
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    tier: "beginner",
    emoji: "⬡",
    color: "#8b5cf6",
    realWorld: "OS memory allocators (free-list), LRU cache eviction, undo/redo stacks in editors",
    companies: "Linux kernel uses doubly-linked lists extensively (list_head); Java LinkedHashMap for LRU",
    concepts: [
      {
        term: "Singly Linked List",
        source: "CLRS §10.2",
        def: "Nodes containing data + next pointer; only forward traversal possible.",
        why: "O(1) prepend/delete-at-head without shifting; used in stack implementations.",
        mistake: "Losing the head pointer during traversal — always save next before modifying.",
      },
      {
        term: "Floyd's Cycle Detection",
        source: "Floyd (1967); CLRS §10",
        def: "Two pointers move at speed 1 and 2; if they meet, a cycle exists.",
        why: "O(n) time, O(1) space — superior to hash-set approach for memory-constrained systems.",
        mistake: "Checking fast == null vs fast.next == null — must handle both termination conditions.",
      },
      {
        term: "Sentinel/Dummy Node",
        source: "Sedgewick 4th Ed",
        def: "A placeholder head node simplifies edge cases for empty list and head-deletion.",
        why: "Eliminates if-head-is-null branches, making code shorter and less bug-prone.",
        mistake: "Returning dummy.next as the result head — returning dummy itself is a common off-by-one.",
      },
    ],
    tradeoffs: {
      use: "Frequent insertions/deletions at known pointers, implementing queues, building LRU caches.",
      avoid: "Random index access, cache-sensitive workloads — each node is a separate heap allocation.",
    },
    complexity: { access: "O(n)", search: "O(n)", insert: "O(1)*", delete: "O(1)*", space: "O(n)" },
    code: CODE["linked-lists"],
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    tier: "beginner",
    emoji: "⬕",
    color: "#10b981",
    realWorld: "Call stack (CPU), browser history (stack), job queues (Redis, RabbitMQ), BFS in graph traversal",
    companies: "Redis LIST implements both stack (LPUSH/LPOP) and queue (LPUSH/RPOP) semantics",
    concepts: [
      {
        term: "LIFO Stack",
        source: "CLRS §10.1",
        def: "Last-In First-Out: push/pop at the same end — the 'top'.",
        why: "Models function call frames; enables expression parsing (Dijkstra's shunting-yard), undo operations.",
        mistake: "Stack overflow from unbounded recursion — always check depth or convert to explicit stack.",
      },
      {
        term: "FIFO Queue",
        source: "CLRS §10.1",
        def: "First-In First-Out: enqueue at tail, dequeue at head.",
        why: "BFS traversal, OS process scheduling, message broker semantics.",
        mistake: "Implementing a queue with two stacks adds amortised O(1) but the constant factor is higher than deque.",
      },
      {
        term: "Monotonic Stack",
        source: "Competitive programming pattern; Cartesian tree literature",
        def: "Stack maintained in strictly increasing or decreasing order to find next-greater/smaller elements in O(n).",
        why: "Powers O(n) solutions for histogram largest rectangle, daily temperatures, and stock span problems.",
        mistake: "Not popping before pushing — the invariant must be restored at every step.",
      },
    ],
    tradeoffs: {
      use: "DFS/BFS traversal, expression evaluation, balancing brackets, sliding window maximum.",
      avoid: "Random access or searching — use arrays or hash maps instead.",
    },
    complexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)", space: "O(n)" },
    code: CODE["stacks-queues"],
  },
  {
    id: "hash-tables",
    name: "Hash Tables",
    tier: "beginner",
    emoji: "◈",
    color: "#f59e0b",
    realWorld: "Database indexes (InnoDB adaptive hash), Python dict, DNS lookup tables, compiler symbol tables",
    companies: "Redis core data structure; Go's built-in map; Java HashMap (chaining + treeification at ≥8)",
    concepts: [
      {
        term: "Hash Function",
        source: "CLRS §11.3; Knuth Vol. 3",
        def: "Maps arbitrary keys to bucket indices; good functions distribute uniformly to minimise collisions.",
        why: "Poor hash functions (e.g., modulo small prime) cluster similar keys, degrading to O(n) lookups.",
        mistake: "Using a non-deterministic hash for persistent storage — same key must always hash identically.",
      },
      {
        term: "Collision Resolution — Chaining",
        source: "CLRS §11.2",
        def: "Each bucket holds a linked list (or tree at high load) of colliding key-value pairs.",
        why: "Java HashMap uses chaining; converts buckets with ≥8 items to red-black trees for O(log n) worst case.",
        mistake: "Forgetting that worst-case is O(n) under a hash-flooding DoS — use randomised seeds in production.",
      },
      {
        term: "Load Factor",
        source: "CLRS §11.2",
        def: "α = n / m (items / buckets). High α increases collision probability; most implementations resize at α > 0.75.",
        why: "Maintaining α ≈ 0.7 keeps average probe length near 1 for open-addressing.",
        mistake: "Pre-sizing for expected capacity (HashMap(initialCapacity / 0.75 + 1)) avoids resize copies — often skipped.",
      },
      {
        term: "Open Addressing (Linear/Quadratic Probing)",
        source: "CLRS §11.4",
        def: "On collision, probe alternative slots in the same array instead of chaining.",
        why: "Better cache performance (one array, no pointer chasing); used in Python dicts and Robin Hood hashing.",
        mistake: "Deletion requires tombstone markers — naively removing breaks probe chains for subsequent lookups.",
      },
    ],
    tradeoffs: {
      use: "O(1) average lookup/insert/delete, frequency counting, deduplication, caching.",
      avoid: "Ordered iteration (use a balanced BST or sorted array), worst-case guarantees, small embedded systems.",
    },
    complexity: { access: "N/A", search: "O(1)*", insert: "O(1)*", delete: "O(1)*", space: "O(n)" },
    code: CODE["hash-tables"],
  },
  {
    id: "trees",
    name: "Trees & BST",
    tier: "intermediate",
    emoji: "⋔",
    color: "#10b981",
    realWorld: "File systems (inode trees), HTML DOM, database B-trees (InnoDB), autocompletion tries",
    companies: "PostgreSQL uses B+-tree for every index; Linux VFS uses a dentry cache tree; Redis sorted sets use skip lists (tree-like)",
    concepts: [
      {
        term: "Binary Search Tree Invariant",
        source: "CLRS §12",
        def: "For every node N: all keys in the left subtree < N.key < all keys in right subtree.",
        why: "Enables O(log n) search, insert, delete when balanced — degrading to O(n) for sorted inputs without balancing.",
        mistake: "Assuming BST is always balanced — a sorted insert sequence produces a linked list.",
      },
      {
        term: "Tree Traversals",
        source: "CLRS §12.1",
        def: "Inorder (LNR) yields sorted output; Preorder (NLR) for serialisation; Postorder (LRN) for deletion.",
        why: "Inorder traversal of a BST validates the BST property in O(n).",
        mistake: "Recursive traversal causes stack overflow for deep trees (>10k nodes) — use iterative with explicit stack.",
      },
      {
        term: "AVL & Red-Black Trees",
        source: "CLRS §13 (Red-Black); Adelson-Velsky & Landis 1962 (AVL)",
        def: "Self-balancing BSTs that maintain O(log n) height through rotations on insert/delete.",
        why: "Java TreeMap, C++ std::map, and Linux scheduler all use red-black trees for O(log n) guarantees.",
        mistake: "Over-rotating in AVL — AVL is stricter (|height diff| ≤ 1) and faster reads but slower writes than RB.",
      },
      {
        term: "Trie (Prefix Tree)",
        source: "Fredkin (1960); commonly attributed to de la Briandais",
        def: "Each node represents a character prefix; paths from root to terminal nodes spell valid words.",
        why: "O(m) search/insert where m is key length — independent of dictionary size. Powers autocomplete.",
        mistake: "Storing full strings at each node — only store a flag or value at terminal nodes.",
      },
    ],
    tradeoffs: {
      use: "Hierarchical data, range queries (BST), autocomplete (Trie), priority queues (heap).",
      avoid: "Random access by index — arrays are O(1); hash maps are O(1) for exact lookup.",
    },
    complexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)", space: "O(n)" },
    code: CODE["trees"],
  },
  {
    id: "heaps",
    name: "Heaps & Priority Queues",
    tier: "intermediate",
    emoji: "△",
    color: "#f59e0b",
    realWorld: "Dijkstra's shortest path, OS process scheduling, Huffman coding, merge k sorted lists",
    companies: "Python heapq (binary min-heap); Java PriorityQueue; Go's container/heap; Linux CFS scheduler uses red-black tree (similar semantics)",
    concepts: [
      {
        term: "Heap Property",
        source: "CLRS §6",
        def: "In a min-heap, every parent ≤ its children; max-heap is the inverse. Root is always min/max.",
        why: "O(1) peek at min/max; O(log n) insert/extract — ideal for continuous stream of priorities.",
        mistake: "Confusing heap with BST — heap only guarantees the parent-child relationship, not left-right ordering.",
      },
      {
        term: "Heapify & Build-Heap",
        source: "CLRS §6.3",
        def: "BuildHeap converts an unsorted array to a heap in O(n) by calling siftDown from n/2 to 0.",
        why: "O(n) build is faster than n×O(log n) individual inserts — used to initialise Dijkstra's queue.",
        mistake: "Using O(n log n) repeated inserts when O(n) buildHeap is available.",
      },
      {
        term: "Top-K Pattern",
        source: "Competitive programming canon",
        def: "Maintain a min-heap of size K; each new element evicts the current minimum if it's larger.",
        why: "O(n log k) time, O(k) space — much better than O(n log n) full sort for large n, small k.",
        mistake: "Using a max-heap for top-K — it requires storing all n elements before extracting.",
      },
    ],
    tradeoffs: {
      use: "Continuous min/max queries, priority scheduling, median maintenance (two heaps), Dijkstra.",
      avoid: "General search, arbitrary-index access, sorted iteration (use sorted array or BST).",
    },
    complexity: { access: "O(1) top", search: "O(n)", insert: "O(log n)", delete: "O(log n)", space: "O(n)" },
    code: CODE["heaps"],
  },
  {
    id: "graphs",
    name: "Graphs & Traversal",
    tier: "intermediate",
    emoji: "⬡",
    color: "#ef4444",
    realWorld: "Social networks (friendship graph), GPS routing (Dijkstra), dependency resolution (topological sort), web crawling (BFS)",
    companies: "Google's PageRank (graph centrality); LinkedIn uses graph DB for 2nd/3rd-degree connections; npm uses DAG for package deps",
    concepts: [
      {
        term: "Graph Representations",
        source: "CLRS §22.1",
        def: "Adjacency list: O(V+E) space, O(degree) neighbour lookup. Adjacency matrix: O(V²) space, O(1) edge check.",
        why: "Sparse graphs (social networks, road maps) use adjacency lists; dense graphs (correlation matrices) use matrices.",
        mistake: "Using adjacency matrix for sparse graphs — O(V²) space wastes memory for typical social networks.",
      },
      {
        term: "BFS — Breadth-First Search",
        source: "CLRS §22.2",
        def: "Explores all neighbours at depth d before depth d+1, using a queue. Finds shortest path (unweighted).",
        why: "Social network 'degrees of separation', web crawlers, multi-source BFS for 0-1 BFS optimisations.",
        mistake: "Not marking nodes visited before enqueuing (not after dequeuing) — causes exponential re-exploration.",
      },
      {
        term: "DFS — Depth-First Search",
        source: "CLRS §22.3",
        def: "Explores as deep as possible before backtracking; timestamps reveal discovery and finish order.",
        why: "Cycle detection, topological sort, SCC (Tarjan/Kosaraju), maze solving, tree serialisation.",
        mistake: "Using recursive DFS without depth limit for large graphs — iterative DFS avoids stack overflow.",
      },
      {
        term: "Topological Sort",
        source: "CLRS §22.4; Kahn (1962)",
        def: "Linear ordering of a DAG where every edge (u→v) has u before v. Only possible on DAGs.",
        why: "Build systems (make), package dependency resolution (npm, pip), course prerequisite scheduling.",
        mistake: "Running topological sort on a graph with cycles — always check in-degrees hit zero for all nodes.",
      },
      {
        term: "Dijkstra's Algorithm",
        source: "Dijkstra (1959); CLRS §24.3",
        def: "Greedy shortest-path with a priority queue; requires non-negative edge weights.",
        why: "GPS routing, OSPF network routing protocols, game pathfinding (A* is Dijkstra + heuristic).",
        mistake: "Using Dijkstra with negative weights — use Bellman-Ford instead (O(VE) but handles negatives).",
      },
    ],
    tradeoffs: {
      use: "Relationship modelling, pathfinding, dependency ordering, connected components.",
      avoid: "Simple parent-child hierarchies (use tree); when all edges have weight 0 or 1 (use BFS/deque).",
    },
    complexity: { access: "O(V+E)", search: "O(V+E)", insert: "O(1)", delete: "O(E)", space: "O(V+E)" },
    code: CODE["graphs"],
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    tier: "beginner",
    emoji: "≡",
    color: "#3b82f6",
    realWorld: "Database ORDER BY (Timsort), merge sort for external sort (disk-based), quicksort in C stdlib qsort",
    companies: "Python/Java use Timsort (hybrid merge+insertion); V8 uses Timsort; C++ std::sort typically uses introsort (quicksort + heapsort hybrid)",
    concepts: [
      {
        term: "Comparison-Based Lower Bound",
        source: "CLRS §8.1",
        def: "Any comparison sort requires Ω(n log n) comparisons in the worst case — proven via decision tree argument.",
        why: "Sets the floor for merge sort / quicksort / heapsort; linear sorts (radix, counting) escape this by exploiting key structure.",
        mistake: "Claiming O(n) comparison sort exists — only non-comparison sorts (counting, radix) achieve linear time.",
      },
      {
        term: "Quicksort & Pivot Selection",
        source: "Hoare (1962); CLRS §7",
        def: "Partitions around a pivot; average O(n log n), worst-case O(n²) for sorted input without randomisation.",
        why: "Cache-friendly in-place partitioning gives excellent constants — typical practice of C++'s std::sort.",
        mistake: "Using first-element pivot on nearly sorted data — random or median-of-3 pivot prevents O(n²) worst case.",
      },
      {
        term: "Merge Sort Stability",
        source: "CLRS §2.3",
        def: "Equal elements maintain their original relative order. Merge sort is stable; quicksort is not (without extra logic).",
        why: "Stability matters for multi-key sorts (sort by name, then by age) — Python's Timsort is stable.",
        mistake: "Assuming all sorts preserve order of equal elements — heapsort and standard quicksort do not.",
      },
      {
        term: "Radix Sort",
        source: "CLRS §8.3; Knuth Vol. 3",
        def: "Sorts integers digit-by-digit using a stable sort (counting sort) per digit. O(d·n) where d = digit count.",
        why: "Beats O(n log n) for fixed-width integers (32-bit ints, IP addresses, phone numbers).",
        mistake: "Applying radix sort to arbitrary-precision keys or strings of varying length without padding.",
      },
    ],
    tradeoffs: {
      use: "Quicksort for cache performance (in-place), merge sort for stability/external sort, heapsort for guaranteed O(n log n).",
      avoid: "Bubble/insertion sort for n > 1000 except nearly-sorted data where insertion sort's O(n) best case shines.",
    },
    complexity: { access: "N/A", search: "N/A", insert: "N/A", delete: "N/A", space: "O(1)–O(n)" },
    code: CODE["sorting"],
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    tier: "advanced",
    emoji: "◫",
    color: "#8b5cf6",
    realWorld: "Git diff (LCS), genome alignment (Smith-Waterman), autocorrect (edit distance), optimal BST, Viterbi algorithm in NLP",
    companies: "Google's spell-check uses edit distance; Dropbox uses LCS for diff; BLAST bioinformatics tool is DP",
    concepts: [
      {
        term: "Optimal Substructure",
        source: "CLRS §15.1; Bellman (1957)",
        def: "An optimal solution to a problem contains optimal solutions to its subproblems.",
        why: "Prerequisite for DP — if subproblems' optimal solutions don't compose into a global optimum, DP won't work.",
        mistake: "Applying DP to problems without this property — greedy or divide-and-conquer may be correct instead.",
      },
      {
        term: "Overlapping Subproblems",
        source: "CLRS §15.1",
        def: "The same subproblems recur many times in the recursion tree; memoisation avoids recomputation.",
        why: "fib(30) without DP makes 2³⁰ calls; with memoisation it makes 30.",
        mistake: "Applying DP when subproblems don't overlap (e.g., binary search) — adds cache overhead for no gain.",
      },
      {
        term: "Top-Down vs Bottom-Up",
        source: "CLRS §15.1",
        def: "Top-down: recursive with memoisation. Bottom-up: iterative tabulation filling a table in dependency order.",
        why: "Bottom-up avoids recursion stack overhead; top-down is easier to reason about and only solves needed subproblems.",
        mistake: "Using top-down when stack depth exceeds system limits — bottom-up or explicit stack required.",
      },
      {
        term: "State Design",
        source: "Competitive programming; CLRS §15",
        def: "The key skill in DP: defining dp[i][j]... to capture exactly the information needed to reconstruct the optimum.",
        why: "Poor state design leads to incorrect solutions or exponential state spaces.",
        mistake: "Including unnecessary dimensions in the state — always ask 'what's the minimum info to uniquely define this subproblem?'",
      },
    ],
    tradeoffs: {
      use: "Optimisation over discrete choices, counting paths, sequence alignment, knapsack-style problems.",
      avoid: "Problems without optimal substructure, when greedy proves correct (activity selection), continuous optimisation.",
    },
    complexity: { access: "N/A", search: "N/A", insert: "N/A", delete: "N/A", space: "O(n²) typical" },
    code: CODE["dp"],
  },
];

const COMPLEXITY_COLORS = {
  "O(1)": "#10b981", "O(1)*": "#10b981",
  "O(log n)": "#3b82f6",
  "O(n)": "#f59e0b", "O(n)*": "#f59e0b",
  "O(n log n)": "#f97316",
  "O(n²)": "#ef4444", "O(n²) typical": "#ef4444",
  "O(V+E)": "#f59e0b",
  "N/A": "#6b7280",
  "O(1) top": "#10b981",
};

const LANGS = ["python", "go", "typescript", "rust", "java"];
const LANG_LABELS = { python: "Python 3.11+", go: "Go 1.24+", typescript: "TypeScript 5+", rust: "Rust (stable)", java: "Java 21+" };

// ─── Components ──────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? "#10b981" : "#2d3139", border: "none", borderRadius: 6, padding: "4px 12px", color: copied ? "#fff" : "#9ca3af", cursor: "pointer", fontSize: 12, fontFamily: "monospace", transition: "all 0.2s" }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function CodeBlock({ code, lang }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
        <CopyButton text={code} />
      </div>
      <pre style={{ background: "#0d1117", border: "1px solid #2d3139", borderRadius: 10, padding: "20px 16px", margin: 0, overflowX: "auto", fontSize: 12.5, lineHeight: 1.6, color: "#e5e7eb", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ComplexityBadge({ val }) {
  const color = COMPLEXITY_COLORS[val] || "#6b7280";
  return (
    <span style={{ background: color + "22", border: `1px solid ${color}55`, color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>
      {val}
    </span>
  );
}

function ComplexityTable({ c }) {
  const rows = [["Access", c.access], ["Search", c.search], ["Insert", c.insert], ["Delete", c.delete], ["Space", c.space]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, margin: "12px 0" }}>
      {rows.map(([label, val]) => (
        <div key={label} style={{ background: "#161b22", border: "1px solid #2d3139", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ color: "#6b7280", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
          <ComplexityBadge val={val} />
        </div>
      ))}
    </div>
  );
}

const REAL_WORLD_APPS = {
  "arrays": [
    { name: "Image Buffers", who: "JPEG / PNG codecs", what: "Store RGB pixel data as flat arrays; CPU cache lines load 16 consecutive pixels in one fetch, making convolution filters fast.", icon: "🖼️" },
    { name: "Database Row Pages", who: "InnoDB / PostgreSQL", what: "Fixed-width rows packed into 16 KB pages are essentially arrays — O(1) slot access by offset enables fast sequential scans.", icon: "🗄️" },
    { name: "Numpy / Tensor ops", who: "PyTorch, NumPy", what: "Multi-dimensional arrays (ndarray) back all ML tensor math; SIMD vectorization requires contiguous memory layout.", icon: "🧠" },
    { name: "Sliding Window Analytics", who: "Apache Flink, Kafka Streams", what: "Tumbling/sliding windows over time-series streams use prefix sums to compute rolling aggregates in O(1) per event.", icon: "📊" },
  ],
  "linked-lists": [
    { name: "LRU Cache", who: "Linux page cache, Memcached", what: "Doubly-linked list + hash map: O(1) promote-to-head on hit, O(1) evict-from-tail. Java LinkedHashMap implements this exactly.", icon: "⚡" },
    { name: "Memory Allocator Free-List", who: "glibc malloc, jemalloc", what: "Free heap blocks are threaded into a linked list by writing the next-pointer into the block itself — zero extra memory overhead.", icon: "🔧" },
    { name: "Undo/Redo Stack", who: "VS Code, Photoshop", what: "Each edit is a node; undo walks backward, redo walks forward. Branching undo trees extend this to a DAG.", icon: "↩️" },
    { name: "Linux Kernel list_head", who: "Linux kernel", what: "An intrusive doubly-linked list embedded in every kernel struct (task_struct, inode). Used for run queues, wait queues, and more.", icon: "🐧" },
  ],
  "stacks-queues": [
    { name: "Call Stack", who: "Every CPU / runtime", what: "Each function call pushes a frame (locals, return address). Stack overflow = exhausted stack segment. Tail-call optimization avoids the push.", icon: "📞" },
    { name: "Browser History", who: "Chrome, Firefox", what: "Back button = pop from history stack. Forward = push to forward stack. New navigation clears the forward stack.", icon: "🌐" },
    { name: "Redis Queue / Stack", who: "Redis (LPUSH/RPOP)", what: "LPUSH+RPOP = FIFO queue; LPUSH+LPOP = LIFO stack. Powers task queues in Celery, Sidekiq, Bull.", icon: "⚙️" },
    { name: "Monotonic Stack in Exchanges", who: "Stock span / options pricing", what: "O(n) next-greater-element powers daily stock span computation and histogram-based value-at-risk calculations.", icon: "📈" },
  ],
  "hash-tables": [
    { name: "Python dict / JS Map", who: "CPython, V8", what: "CPython dict uses open addressing with a compact table. V8's hidden classes use hash maps to track object shapes — key to JIT optimization.", icon: "🐍" },
    { name: "DNS Resolver Cache", who: "OS stub resolver, BIND", what: "Domain → IP mappings cached in a hash table for O(1) lookup. TTL expiry handled by a separate min-heap.", icon: "🌍" },
    { name: "Compiler Symbol Table", who: "GCC, Clang, javac", what: "Variable/function names hashed to their type, scope, and address. Chained scopes implement lexical scoping rules.", icon: "⚡" },
    { name: "Bloom Filter (probabilistic)", who: "Cassandra, Chrome Safe Browsing", what: "Multiple hash functions map keys to bits. False positives possible, false negatives impossible. Saves disk I/O before expensive lookups.", icon: "🔍" },
  ],
  "trees": [
    { name: "PostgreSQL B+-Tree Index", who: "PostgreSQL, InnoDB", what: "Every CREATE INDEX builds a B+-tree. Leaf nodes form a linked list for range scans. Fan-out ~100 means 4 levels covers 100M rows.", icon: "🗄️" },
    { name: "File System Directory Tree", who: "Linux ext4, APFS", what: "Directories are B-trees of dentries. Linux VFS dentry cache (dcache) keeps hot paths in memory as a trie for O(path_length) lookup.", icon: "📁" },
    { name: "Autocomplete / Spell Check", who: "IDEs, Google Search", what: "Trie stores dictionary words; prefix search walks at most O(m) nodes. Aho-Corasick extends the trie with failure links for multi-pattern match.", icon: "🔤" },
    { name: "HTML DOM", who: "Every browser engine", what: "The document is a tree of Element nodes. CSS selectors walk the tree; layout and paint traverse it in DFS order.", icon: "🌐" },
  ],
  "heaps": [
    { name: "OS Process Scheduler", who: "Linux CFS, Windows IRQL", what: "Linux CFS uses a red-black tree (heap semantics) keyed by virtual runtime. O(log n) insert/extract picks the most-deserving process.", icon: "🖥️" },
    { name: "Dijkstra / A* Pathfinding", who: "Google Maps, game engines", what: "Min-heap extracts the lowest-cost frontier node at each step. Without the heap, Dijkstra degrades from O((V+E) log V) to O(V²).", icon: "🗺️" },
    { name: "Huffman Coding", who: "zlib, gzip, DEFLATE", what: "Build frequency min-heap, repeatedly merge two smallest nodes to form the optimal prefix-free code. Used in every HTTP/1.1 response.", icon: "🗜️" },
    { name: "Stream Median / Top-K", who: "Analytics pipelines, ad bidding", what: "Two heaps maintain lower/upper halves of a data stream. Real-time ad auction systems use top-K heaps to select winning bids in microseconds.", icon: "📊" },
  ],
  "graphs": [
    { name: "Social Network Connections", who: "LinkedIn, Facebook", what: "2nd/3rd-degree connections via BFS. LinkedIn's People You May Know runs multi-source BFS from your connections on a graph of 900M+ nodes.", icon: "👥" },
    { name: "GPS / Maps Routing", who: "Google Maps, OSRM", what: "Road network = weighted graph. Dijkstra (or bidirectional A*) finds shortest path. Preprocessing (contraction hierarchies) makes it sub-millisecond.", icon: "🗺️" },
    { name: "Package Dependency Resolution", who: "npm, pip, cargo", what: "Dependencies form a DAG. Topological sort gives a valid install order. Cycle detection catches circular dependencies at publish time.", icon: "📦" },
    { name: "PageRank / Recommendations", who: "Google Search, Netflix", what: "PageRank iterates the web graph's adjacency matrix. Collaborative filtering builds a bipartite user-item graph and walks it for recommendations.", icon: "🔗" },
  ],
  "sorting": [
    { name: "Database ORDER BY", who: "PostgreSQL, MySQL", what: "Small result sets use in-memory quicksort. Large ones spill to disk using external merge sort — splitting into sorted runs, then k-way merging.", icon: "🗄️" },
    { name: "Python / Java Timsort", who: "CPython, JVM, V8", what: "Timsort detects natural runs (already-sorted subsequences) and merge-sorts them. Beats pure merge sort on real-world partially-sorted data.", icon: "🐍" },
    { name: "Radix Sort for IPs / Logs", who: "Network routers, log processors", what: "32-bit IPv4 addresses sorted by radix sort in O(n) — far faster than O(n log n) comparison sort for fixed-width keys like timestamps.", icon: "🌐" },
    { name: "C++ std::sort (introsort)", who: "libstdc++, MSVC STL", what: "Starts with quicksort, switches to heapsort if recursion depth exceeds 2 log n (preventing O(n²) worst case), and insertion sort for n < 16.", icon: "⚙️" },
  ],
  "dp": [
    { name: "Git diff / Unix diff", who: "Git, GNU diffutils", what: "Myers diff algorithm is LCS-based: finds the longest common subsequence of lines to minimize the edit script. O(n·d) where d = number of differences.", icon: "🔀" },
    { name: "Genome Sequence Alignment", who: "NCBI BLAST, BWA", what: "Smith-Waterman (local alignment) and Needleman-Wunsch (global) are DP on a 2D edit-distance table. BLAST uses heuristic seeds to skip most cells.", icon: "🧬" },
    { name: "Autocorrect / Edit Distance", who: "Google Search, keyboards", what: "Levenshtein distance ranks correction candidates. Google extends this with phonetic similarity and query log priors for 'did you mean?' suggestions.", icon: "⌨️" },
    { name: "Viterbi Algorithm (NLP/HMM)", who: "Speech recognition, POS tagging", what: "Viterbi is DP over a trellis (sequence × state grid). Used in speech-to-text, gene finding, and network decoding. Formally identical to shortest-path DP.", icon: "🎙️" },
  ],
};

function DSAVisual({ topic }) {
  const diagrams = {
    "arrays": (c) => (
      <svg viewBox="0 0 520 180" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#4b5563" /></marker></defs>
        {/* Memory cells */}
        {[12,3,7,1,9,5,8,2].map((v, i) => (
          <g key={i}>
            <rect x={20 + i*58} y={30} width={50} height={50} rx="4" fill={i===2?"#3b82f622":"#161b22"} stroke={i===2?"#3b82f6":"#374151"} strokeWidth={i===2?2:1} />
            <text x={45 + i*58} y={61} fill={i===2?"#3b82f6":"#9ca3af"} fontSize="16" textAnchor="middle" fontWeight="600">{v}</text>
            <text x={45 + i*58} y={96} fill="#4b5563" fontSize="9" textAnchor="middle">[{i}]</text>
          </g>
        ))}
        {/* Base address */}
        <text x="20" y="18" fill="#6b7280" fontSize="9">0x1000</text>
        <text x="78" y="18" fill="#6b7280" fontSize="9">0x1004</text>
        <text x="136" y="18" fill="#6b7280" fontSize="9">0x1008</text>
        {/* Arrow pointing to [2] */}
        <line x1="165" y1="140" x2="165" y2="112" stroke="#3b82f6" strokeWidth="1.5" markerEnd={`url(#ah-${c})`} />
        <text x="165" y="155" fill="#3b82f6" fontSize="10" textAnchor="middle">arr[2] → O(1)</text>
        {/* Sliding window bracket */}
        <rect x="136" y="25" width={50*3+8} height={60} rx="4" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="225" y="106" fill="#f59e0b" fontSize="9" textAnchor="middle">sliding window</text>
        {/* Labels */}
        <text x="260" y="175" fill="#4b5563" fontSize="9" textAnchor="middle">contiguous memory · cache-line aligned · 64 bytes = 16 ints</text>
      </svg>
    ),
    "linked-lists": (c) => (
      <svg viewBox="0 0 520 160" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#8b5cf6" /></marker></defs>
        {[{v:1,x:20},{v:3,x:130},{v:7,x:240},{v:2,x:350}].map(({v,x},i,arr) => (
          <g key={i}>
            {/* Node box: data | next */}
            <rect x={x} y={50} width={45} height={44} rx="4" fill="#161b22" stroke="#374151" strokeWidth="1" />
            <rect x={x+45} y={50} width={30} height={44} rx="4" fill="#2d1b69" stroke="#8b5cf688" strokeWidth="1" />
            <text x={x+22} y={77} fill="#e5e7eb" fontSize="15" textAnchor="middle" fontWeight="600">{v}</text>
            <text x={x+60} y={75} fill="#8b5cf6" fontSize="9" textAnchor="middle">next</text>
            <text x={x+22} y={111} fill="#4b5563" fontSize="9" textAnchor="middle">data</text>
            {/* Arrow to next node */}
            {i < arr.length-1 && <line x1={x+75} y1={72} x2={x+107} y2={72} stroke="#8b5cf6" strokeWidth="1.5" markerEnd={`url(#ah-${c})`} />}
          </g>
        ))}
        {/* NULL terminator */}
        <rect x={460} y={58} width={42} height={28} rx="4" fill="#1a1a1a" stroke="#374151" strokeWidth="1" />
        <text x={481} y={76} fill="#4b5563" fontSize="10" textAnchor="middle">NULL</text>
        <line x1={450} y1={72} x2={457} y2={72} stroke="#8b5cf6" strokeWidth="1.5" markerEnd={`url(#ah-${c})`} />
        {/* Head pointer */}
        <line x1={42} y1={28} x2={42} y2={47} stroke="#10b981" strokeWidth="1.5" markerEnd={`url(#ah-${c})`} />
        <text x={42} y={20} fill="#10b981" fontSize="10" textAnchor="middle">head</text>
        {/* Annotations */}
        <text x="260" y="148" fill="#4b5563" fontSize="9" textAnchor="middle">O(1) insert at head · O(n) access · scattered heap allocations</text>
      </svg>
    ),
    "stacks-queues": (c) => (
      <svg viewBox="0 0 520 185" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#10b981" /></marker>
        <marker id={`ah2-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#f59e0b" /></marker></defs>
        {/* Stack (left) */}
        <text x="90" y="16" fill="#9ca3af" fontSize="11" textAnchor="middle" fontWeight="600">STACK (LIFO)</text>
        {["fn_c()","fn_b()","fn_a()","main()"].map((label,i) => (
          <g key={i}>
            <rect x={20} y={24+i*34} width={140} height={28} rx="3" fill={i===0?"#10b98122":"#161b22"} stroke={i===0?"#10b981":"#374151"} strokeWidth={i===0?1.5:1}/>
            <text x={90} y={43+i*34} fill={i===0?"#10b981":"#9ca3af"} fontSize="11" textAnchor="middle">{label}</text>
          </g>
        ))}
        <line x1={175} y1={38} x2={195} y2={38} stroke="#10b981" strokeWidth="1.5" markerEnd={`url(#ah-${c})`} />
        <text x={186} y={32} fill="#10b981" fontSize="9" textAnchor="middle">push</text>
        <line x1={195} y1={50} x2={175} y2={50} stroke="#ef4444" strokeWidth="1.5" markerEnd={`url(#ah-${c})`} />
        <text x={186} y={64} fill="#ef4444" fontSize="9" textAnchor="middle">pop</text>
        {/* Queue (right) */}
        <text x="380" y="16" fill="#9ca3af" fontSize="11" textAnchor="middle" fontWeight="600">QUEUE (FIFO)</text>
        {["job_1","job_2","job_3","job_4"].map((label,i) => (
          <g key={i}>
            <rect x={240+i*62} y={24} width={55} height={40} rx="3"
              fill={i===0?"#f59e0b22":i===3?"#3b82f622":"#161b22"}
              stroke={i===0?"#f59e0b":i===3?"#3b82f6":"#374151"}
              strokeWidth={i===0||i===3?1.5:1}/>
            <text x={267+i*62} y={49} fill={i===0?"#f59e0b":i===3?"#3b82f6":"#9ca3af"} fontSize="10" textAnchor="middle">{label}</text>
          </g>
        ))}
        <line x1={497} y1={44} x2={516} y2={44} stroke="#3b82f6" strokeWidth="1.5" markerEnd={`url(#ah2-${c})`} />
        <text x={506} y={36} fill="#3b82f6" fontSize="8">enq</text>
        <line x1={240} y1={44} x2={221} y2={44} stroke="#f59e0b" strokeWidth="1.5" markerEnd={`url(#ah2-${c})`} />
        <text x={230} y={36} fill="#f59e0b" fontSize="8">deq</text>
        {/* Monotonic stack section */}
        <text x="260" y="100" fill="#9ca3af" fontSize="10" textAnchor="middle" fontWeight="600">MONOTONIC STACK — next greater element</text>
        {[{v:2,ng:4},{v:1,ng:2},{v:2,ng:4},{v:4,ng:-1},{v:3,ng:-1}].map(({v,ng},i) => (
          <g key={i}>
            <rect x={60+i*78} y={108} width={44} height={30} rx="3" fill="#161b22" stroke="#374151" strokeWidth="1"/>
            <text x={82+i*78} y={128} fill="#e5e7eb" fontSize="13" textAnchor="middle">{v}</text>
            <text x={82+i*78} y={158} fill={ng===-1?"#4b5563":"#10b981"} fontSize="10" textAnchor="middle">→{ng===-1?"-1":ng}</text>
          </g>
        ))}
        <text x="260" y="178" fill="#4b5563" fontSize="9" textAnchor="middle">each element pushed/popped at most once · O(n) total</text>
      </svg>
    ),
    "hash-tables": (c) => (
      <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#f59e0b" /></marker></defs>
        {/* Keys */}
        {['"alice"','"bob"','"carol"'].map((k,i) => (
          <g key={i}>
            <rect x={10} y={20+i*52} width={80} height={28} rx="4" fill="#161b22" stroke="#374151" strokeWidth="1"/>
            <text x={50} y={39+i*52} fill="#e5e7eb" fontSize="10" textAnchor="middle">{k}</text>
          </g>
        ))}
        {/* Hash function box */}
        <rect x={120} y={55} width={80} height={46} rx="6" fill="#f59e0b22" stroke="#f59e0b88" strokeWidth="1.5"/>
        <text x={160} y={74} fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="600">hash()</text>
        <text x={160} y={88} fill="#f59e0b88" fontSize="8" textAnchor="middle">% buckets</text>
        {/* Arrows key → hash */}
        {[34,86,138].map((y,i) => <line key={i} x1={90} y1={y} x2={118} y2={78} stroke="#4b5563" strokeWidth="1" markerEnd={`url(#ah-${c})`} />)}
        {/* Bucket array */}
        {[0,1,2,3,4,5,6].map((b,i) => (
          <g key={i}>
            <rect x={240} y={8+i*25} width={36} height={20} rx="2" fill="#161b22" stroke="#374151" strokeWidth="1"/>
            <text x={258} y={23+i*25} fill="#4b5563" fontSize="9" textAnchor="middle">[{b}]</text>
          </g>
        ))}
        {/* Arrows hash → buckets */}
        <line x1={200} y1={70} x2={238} y2={23} stroke="#f59e0b" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        <line x1={200} y1={75} x2={238} y2={73} stroke="#f59e0b" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        <line x1={200} y1={80} x2={238} y2={148} stroke="#f59e0b" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        {/* Chaining */}
        <rect x={285} y={14} width={60} height={20} rx="3" fill="#3b82f622" stroke="#3b82f688" strokeWidth="1"/>
        <text x={315} y={28} fill="#3b82f6" fontSize="9" textAnchor="middle">alice→92</text>
        <rect x={355} y={14} width={60} height={20} rx="3" fill="#3b82f622" stroke="#3b82f688" strokeWidth="1"/>
        <text x={385} y={28} fill="#3b82f6" fontSize="9" textAnchor="middle">carol→67</text>
        <line x1={285} y1={24} x2={277} y2={24} stroke="#3b82f6" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        <line x1={345} y1={24} x2={353} y2={24} stroke="#3b82f6" strokeWidth="1"/>
        <rect x={285} y={64} width={60} height={20} rx="3" fill="#10b98122" stroke="#10b98188" strokeWidth="1"/>
        <text x={315} y={78} fill="#10b981" fontSize="9" textAnchor="middle">bob→41</text>
        <line x1={285} y1={74} x2={277} y2={74} stroke="#10b981" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        {/* Load factor bar */}
        <text x={260} y={160} fill="#6b7280" fontSize="9" textAnchor="middle">load factor α = n/m</text>
        <rect x={160} y={168} width={200} height={10} rx="3" fill="#1a1d24" stroke="#374151"/>
        <rect x={160} y={168} width={140} height={10} rx="3" fill="#f59e0b88"/>
        <text x={160} y={191} fill="#4b5563" fontSize="8">0</text>
        <text x={305} y={191} fill="#f59e0b" fontSize="8">0.70 ← resize threshold</text>
        <text x={358} y={191} fill="#4b5563" fontSize="8">1.0</text>
      </svg>
    ),
    "trees": (c) => (
      <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#10b981" /></marker></defs>
        {/* BST */}
        <text x="130" y="14" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">BINARY SEARCH TREE</text>
        {/* Edges first */}
        {[[130,34,70,80],[130,34,190,80],[70,80,40,126],[70,80,100,126],[190,80,160,126],[190,80,220,126]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5"/>
        ))}
        {/* Nodes: root=8, left=3, right=10, ll=1,lr=6,rl=9,rr=14 */}
        {[{v:8,x:130,y:20,c:"#f59e0b"},{v:3,x:70,y:66},{v:10,x:190,y:66},{v:1,x:40,y:112},{v:6,x:100,y:112},{v:9,x:160,y:112},{v:14,x:220,y:112}].map(({v,x,y,c:nc},i)=>(
          <g key={i}>
            <circle cx={x} cy={y+14} r="16" fill={nc?"#f59e0b22":"#161b22"} stroke={nc||"#374151"} strokeWidth={nc?2:1}/>
            <text x={x} y={y+19} fill={nc?"#f59e0b":"#9ca3af"} fontSize="12" textAnchor="middle" fontWeight={nc?"700":"400"}>{v}</text>
          </g>
        ))}
        <text x="130" y="175" fill="#4b5563" fontSize="9" textAnchor="middle">left subtree {`<`} node {`<`} right subtree · inorder gives sorted output</text>
        {/* Trie (right side) */}
        <text x="390" y="14" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">TRIE (prefix tree)</text>
        {/* root */}
        <circle cx={390} cy={34} r="12" fill="#8b5cf622" stroke="#8b5cf6" strokeWidth="1.5"/>
        <text x={390} y={38} fill="#8b5cf6" fontSize="9" textAnchor="middle">root</text>
        {/* a branch */}
        <line x1={390} y1={46} x2={350} y2={68} stroke="#374151" strokeWidth="1"/>
        <circle cx={350} cy={78} r="12" fill="#161b22" stroke="#374151" strokeWidth="1"/>
        <text x={350} y={82} fill="#9ca3af" fontSize="10" textAnchor="middle">a</text>
        <line x1={350} y1={90} x2={330} y2={112} stroke="#374151" strokeWidth="1"/>
        <circle cx={330} cy={122} r="12" fill="#161b22" stroke="#374151" strokeWidth="1"/>
        <text x={330} y={126} fill="#9ca3af" fontSize="10" textAnchor="middle">p</text>
        <line x1={330} y1={134} x2={330} y2={152} stroke="#374151" strokeWidth="1"/>
        <circle cx={330} cy={162} r="12" fill="#10b98122" stroke="#10b981" strokeWidth="1.5"/>
        <text x={330} y={166} fill="#10b981" fontSize="9" textAnchor="middle">p*</text>
        {/* b branch */}
        <line x1={390} y1={46} x2={430} y2={68} stroke="#374151" strokeWidth="1"/>
        <circle cx={430} cy={78} r="12" fill="#161b22" stroke="#374151" strokeWidth="1"/>
        <text x={430} y={82} fill="#9ca3af" fontSize="10" textAnchor="middle">b</text>
        <line x1={430} y1={90} x2={430} y2={112} stroke="#374151" strokeWidth="1"/>
        <circle cx={430} cy={122} r="12" fill="#161b22" stroke="#374151" strokeWidth="1"/>
        <text x={430} y={126} fill="#9ca3af" fontSize="10" textAnchor="middle">a</text>
        <line x1={430} y1={134} x2={430} y2={152} stroke="#374151" strokeWidth="1"/>
        <circle cx={430} cy={162} r="12" fill="#10b98122" stroke="#10b981" strokeWidth="1.5"/>
        <text x={430} y={166} fill="#10b981" fontSize="9" textAnchor="middle">t*</text>
        <text x={390} y={185} fill="#4b5563" fontSize="9" textAnchor="middle">* = terminal · O(m) search where m = key length</text>
      </svg>
    ),
    "heaps": (c) => (
      <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#4b5563" /></marker></defs>
        {/* Min-Heap tree */}
        <text x="150" y="12" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">MIN-HEAP (tree view)</text>
        {[[150,30,80,72],[150,30,220,72],[80,72,44,114],[80,72,116,114],[220,72,184,114],[220,72,256,114]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1+14} x2={x2} y2={y2+14} stroke="#374151" strokeWidth="1.5"/>
        ))}
        {[{v:1,x:150,y:30,c:"#f59e0b"},{v:3,x:80,y:72},{v:5,x:220,y:72},{v:7,x:44,y:114},{v:4,x:116,y:114},{v:9,x:184,y:114},{v:6,x:256,y:114}].map(({v,x,y,c:nc})=>(
          <g key={v}>
            <circle cx={x} cy={y+14} r="16" fill={nc?"#f59e0b22":"#161b22"} stroke={nc||"#374151"} strokeWidth={nc?2:1}/>
            <text x={x} y={y+19} fill={nc?"#f59e0b":"#9ca3af"} fontSize="13" textAnchor="middle">{v}</text>
          </g>
        ))}
        {/* Array representation */}
        <text x="150" y="155" fill="#6b7280" fontSize="9" textAnchor="middle">array representation</text>
        {[1,3,5,7,4,9,6].map((v,i)=>(
          <g key={i}>
            <rect x={20+i*62} y={160} width={54} height={24} rx="3" fill={i===0?"#f59e0b22":"#161b22"} stroke={i===0?"#f59e0b":"#374151"} strokeWidth={i===0?1.5:1}/>
            <text x={47+i*62} y={177} fill={i===0?"#f59e0b":"#9ca3af"} fontSize="12" textAnchor="middle">{v}</text>
          </g>
        ))}
        <text x={350} y={140} fill="#4b5563" fontSize="8" textAnchor="middle">parent(i)=⌊(i-1)/2⌋</text>
        <text x={350} y={150} fill="#4b5563" fontSize="8" textAnchor="middle">left(i)=2i+1 · right(i)=2i+2</text>
      </svg>
    ),
    "graphs": (c) => (
      <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }}>
        <defs>
          <marker id={`ah-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#ef4444" /></marker>
          <marker id={`bu-${c}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#3b82f6" /></marker>
        </defs>
        {/* Directed weighted graph */}
        <text x="140" y="12" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">WEIGHTED DIRECTED GRAPH</text>
        {/* Edges with weights */}
        {[[60,60,160,60,"4",true],[60,60,80,140,"2",true],[160,60,260,60,"1",true],[160,60,80,140,"5",false],[80,140,260,140,"3",true],[260,60,260,140,"7",false]].map(([x1,y1,x2,y2,w,dir],i)=>(
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={dir?"#ef4444":"#374151"} strokeWidth="1.5" markerEnd={dir?`url(#ah-${c})`:undefined}/>
            <rect x={(x1+x2)/2-8} y={(y1+y2)/2-8} width="16" height="14" rx="2" fill="#0f1117"/>
            <text x={(x1+x2)/2} y={(y1+y2)/2+3} fill={dir?"#f59e0b":"#4b5563"} fontSize="10" textAnchor="middle">{w}</text>
          </g>
        ))}
        {/* Nodes */}
        {[{l:"A",x:60,y:60},{l:"B",x:160,y:60},{l:"C",x:260,y:60},{l:"D",x:80,y:140},{l:"E",x:260,y:140}].map(({l,x,y})=>(
          <g key={l}>
            <circle cx={x} cy={y} r="18" fill={l==="A"?"#3b82f622":"#161b22"} stroke={l==="A"?"#3b82f6":"#374151"} strokeWidth={l==="A"?2:1}/>
            <text x={x} y={y+5} fill={l==="A"?"#3b82f6":"#9ca3af"} fontSize="13" textAnchor="middle" fontWeight="600">{l}</text>
          </g>
        ))}
        {/* BFS order annotation */}
        <text x="140" y="178" fill="#4b5563" fontSize="9" textAnchor="middle">BFS from A: A→B→D→C→E · Dijkstra finds shortest weighted path</text>
        {/* Adjacency list */}
        <text x="400" y="12" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">ADJACENCY LIST</text>
        {[["A","→ B(4), D(2)"],["B","→ C(1), D(5)"],["D","→ E(3)"],["C","→ E(7)"],["E","→ (none)"]].map(([node,edges],i)=>(
          <g key={node}>
            <rect x={310} y={20+i*30} width={24} height={22} rx="3" fill="#3b82f622" stroke="#3b82f688" strokeWidth="1"/>
            <text x={322} y={35+i*30} fill="#3b82f6" fontSize="10" textAnchor="middle">{node}</text>
            <text x={340} y={35+i*30} fill="#6b7280" fontSize="9">{edges}</text>
          </g>
        ))}
      </svg>
    ),
    "sorting": (c) => (
      <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#3b82f6" /></marker></defs>
        {/* Merge sort tree */}
        <text x="170" y="12" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">MERGE SORT — divide & conquer</text>
        {/* Level 0: full array */}
        {[5,2,8,1,9,3,7,4].map((v,i)=>(
          <g key={i}><rect x={10+i*38} y={18} width={32} height={22} rx="3" fill="#3b82f622" stroke="#3b82f688" strokeWidth="1"/>
          <text x={26+i*38} y={33} fill="#3b82f6" fontSize="12" textAnchor="middle">{v}</text></g>
        ))}
        {/* Split arrows */}
        <line x1={155} y1={42} x2={80} y2={58} stroke="#374151" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        <line x1={165} y1={42} x2={250} y2={58} stroke="#374151" strokeWidth="1" markerEnd={`url(#ah-${c})`}/>
        {/* Level 1 */}
        {[5,2,8,1].map((v,i)=>(
          <g key={i}><rect x={10+i*38} y={60} width={32} height={22} rx="3" fill="#161b22" stroke="#374151" strokeWidth="1"/>
          <text x={26+i*38} y={75} fill="#9ca3af" fontSize="12" textAnchor="middle">{v}</text></g>
        ))}
        {[9,3,7,4].map((v,i)=>(
          <g key={i}><rect x={168+i*38} y={60} width={32} height={22} rx="3" fill="#161b22" stroke="#374151" strokeWidth="1"/>
          <text x={184+i*38} y={75} fill="#9ca3af" fontSize="12" textAnchor="middle">{v}</text></g>
        ))}
        {/* Merge arrow */}
        <line x1={80} y1={105} x2={155} y2={118} stroke="#10b981" strokeWidth="1.5" markerEnd={`url(#ah-${c})`}/>
        <line x1={250} y1={105} x2={165} y2={118} stroke="#10b981" strokeWidth="1.5" markerEnd={`url(#ah-${c})`}/>
        <text x={160} y={112} fill="#10b981" fontSize="9" textAnchor="middle">merge</text>
        {/* Level 2: sorted result */}
        {[1,2,3,4,5,7,8,9].map((v,i)=>(
          <g key={i}><rect x={10+i*38} y={122} width={32} height={22} rx="3" fill="#10b98122" stroke="#10b98188" strokeWidth="1.5"/>
          <text x={26+i*38} y={137} fill="#10b981" fontSize="12" textAnchor="middle">{v}</text></g>
        ))}
        {/* Complexity comparison bar */}
        <text x="260" y="162" fill="#6b7280" fontSize="9" textAnchor="middle">comparison lower bound: Ω(n log n) · merge sort = O(n log n) stable</text>
        <text x="260" y="176" fill="#4b5563" fontSize="9" textAnchor="middle">quicksort avg O(n log n) · radix sort O(d·n) bypasses comparison bound</text>
      </svg>
    ),
    "dp": (c) => (
      <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }}>
        <defs><marker id={`ah-${c}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#8b5cf6" /></marker></defs>
        {/* Edit distance table */}
        <text x="160" y="12" fill="#9ca3af" fontSize="10" fontWeight="600" textAnchor="middle">EDIT DISTANCE — "kit" → "sit"</text>
        {/* Column headers */}
        {["","","s","i","t"].map((h,i)=>(
          <text key={i} x={60+i*52} y={28} fill="#6b7280" fontSize="10" textAnchor="middle">{h}</text>
        ))}
        {/* Row headers & cells */}
        {[["",0,1,2,3],["k",1,1,2,3],["i",2,2,1,2],["t",3,3,2,1]].map((row,ri)=>(
          <g key={ri}>
            <text x={28} y={50+ri*36} fill="#6b7280" fontSize="10" textAnchor="middle">{row[0]}</text>
            {row.slice(1).map((v,ci)=>{
              const isOpt = ri===3&&ci===3;
              const isDiag = (ri===1&&ci===1)||(ri===2&&ci===2)||(ri===3&&ci===3);
              return (
                <g key={ci}>
                  <rect x={38+ci*52} y={36+ri*36} width={44} height={28} rx="4"
                    fill={isOpt?"#8b5cf622":isDiag?"#3b82f611":"#161b22"}
                    stroke={isOpt?"#8b5cf6":isDiag?"#3b82f644":"#374151"}
                    strokeWidth={isOpt?2:1}/>
                  <text x={60+ci*52} y={54+ri*36} fill={isOpt?"#8b5cf6":isDiag?"#3b82f6":"#9ca3af"} fontSize="13" textAnchor="middle">{v}</text>
                </g>
              );
            })}
          </g>
        ))}
        {/* Arrow showing recurrence */}
        <text x="320" y="28" fill="#9ca3af" fontSize="10" fontWeight="600">RECURRENCE</text>
        <text x="310" y="48" fill="#6b7280" fontSize="9">if s[i]==t[j]:</text>
        <text x="320" y="62" fill="#8b5cf6" fontSize="9">dp[i][j] = dp[i-1][j-1]</text>
        <text x="310" y="78" fill="#6b7280" fontSize="9">else:</text>
        <text x="320" y="92" fill="#8b5cf6" fontSize="9">1 + min(</text>
        <text x="330" y="106" fill="#3b82f6" fontSize="9">dp[i-1][j-1],  ← replace</text>
        <text x="330" y="120" fill="#10b981" fontSize="9">dp[i-1][j],    ← delete</text>
        <text x="330" y="134" fill="#f59e0b" fontSize="9">dp[i][j-1])    ← insert</text>
        <text x="320" y="152" fill="#4b5563" fontSize="9">optimal substructure:</text>
        <text x="320" y="164" fill="#4b5563" fontSize="9">cell built from 3 neighbours</text>
        <text x="160" y="182" fill="#4b5563" fontSize="9" textAnchor="middle">bottom-up tabulation · O(mn) time · O(n) space with rolling array</text>
      </svg>
    ),
  };

  const render = diagrams[topic.id];
  const uid = topic.id;

  return (
    <div style={{ background: "#0d1117", borderRadius: 12, border: "1px solid #2d3139", padding: "20px 16px" }}>
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: topic.color, fontSize: 20 }}>{topic.emoji}</span>
        <span style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 14 }}>{topic.name}</span>
        <span style={{ color: "#4b5563", fontSize: 12, marginLeft: 4 }}>— structure & behaviour</span>
      </div>
      {render ? render(uid) : <text fill="#6b7280">No diagram</text>}
    </div>
  );
}

function ConceptCard({ c }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #2d3139", borderRadius: 10, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ color: "#e5e7eb", fontWeight: 600, fontSize: 14 }}>{c.term}</span>
        {c.source && <span style={{ color: "#6b7280", fontSize: 11, fontStyle: "italic" }}>— {c.source}</span>}
      </div>
      <p style={{ color: "#d1d5db", fontSize: 13, margin: "0 0 8px", lineHeight: 1.6 }}>{c.def}</p>
      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <span style={{ color: "#3b82f6", fontSize: 11, fontWeight: 700, minWidth: 80 }}>WHY IT MATTERS</span>
          <span style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.5 }}>{c.why}</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, minWidth: 80 }}>COMMON MISTAKE</span>
          <span style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.5 }}>{c.mistake}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function DSAReference() {
  const [activeTopic, setActiveTopic] = useState(DSA_TOPICS[0].id);
  const [activeTab, setActiveTab] = useState("architecture");
  const [activeLang, setActiveLang] = useState("python");
  const [tierFilter, setTierFilter] = useState("all");

  const topic = DSA_TOPICS.find(t => t.id === activeTopic);
  const filtered = tierFilter === "all" ? DSA_TOPICS : DSA_TOPICS.filter(t => t.tier === tierFilter);

  const TABS = [
    { id: "architecture", label: "Architecture" },
    { id: "concepts", label: "Core Concepts" },
    { id: "implementations", label: "Implementations" },
    { id: "leadership", label: "Leadership" },
  ];

  const TIER_COLORS = { beginner: "#10b981", intermediate: "#f59e0b", advanced: "#ef4444" };

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh", color: "#e5e7eb", fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #2d3139", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, color: "#3b82f6" }}>◈</span>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", color: "#f1f5f9" }}>DSA Reference</span>
            <span style={{ background: "#1a1d24", border: "1px solid #2d3139", borderRadius: 5, padding: "2px 8px", fontSize: 11, color: "#6b7280" }}>Beginner → Advanced</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Data Structures & Algorithms · Production-grade reference · CLRS · Real-world applications</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["all","beginner","intermediate","advanced"].map(t => (
            <button key={t} onClick={() => { setTierFilter(t); if(t !== "all") { const first = DSA_TOPICS.find(x => x.tier === t); if(first) setActiveTopic(first.id); } }}
              style={{ background: tierFilter === t ? "#1a1d24" : "transparent", border: `1px solid ${tierFilter === t ? "#2d3139" : "transparent"}`, borderRadius: 6, padding: "4px 10px", color: tierFilter === t ? "#e5e7eb" : "#6b7280", cursor: "pointer", fontSize: 12, textTransform: "capitalize" }}>
              {t === "all" ? "All" : <><span style={{ width: 7, height: 7, borderRadius: "50%", background: TIER_COLORS[t], display: "inline-block", marginRight: 5 }} />{t}</>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "#0d1117", borderRight: "1px solid #2d3139", overflowY: "auto", padding: "12px 0", flexShrink: 0 }}>
          {filtered.map(t => (
            <button key={t.id} onClick={() => { setActiveTopic(t.id); setActiveTab("architecture"); }}
              style={{ width: "100%", background: activeTopic === t.id ? "#1a1d24" : "transparent", border: "none", borderLeft: activeTopic === t.id ? `3px solid ${t.color}` : "3px solid transparent", padding: "10px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
              <span style={{ color: t.color, fontSize: 16 }}>{t.emoji}</span>
              <div>
                <div style={{ color: activeTopic === t.id ? "#f1f5f9" : "#9ca3af", fontSize: 12.5, fontWeight: activeTopic === t.id ? 600 : 400 }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: TIER_COLORS[t.tier] }} />
                  <span style={{ color: "#6b7280", fontSize: 10, textTransform: "capitalize" }}>{t.tier}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* Tab Bar */}
          <div style={{ background: "#0d1117", borderBottom: "1px solid #2d3139", padding: "0 24px", display: "flex", gap: 0, flexShrink: 0 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ background: "transparent", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${topic?.color || "#3b82f6"}` : "2px solid transparent", padding: "14px 18px", color: activeTab === tab.id ? "#f1f5f9" : "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, transition: "all 0.15s" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: 24, flex: 1 }}>
            {/* Topic header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ color: topic?.color, fontSize: 28 }}>{topic?.emoji}</span>
              <div>
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 20, fontWeight: 700 }}>{topic?.name}</h2>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{topic?.realWorld}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: TIER_COLORS[topic?.tier] + "22", border: `1px solid ${TIER_COLORS[topic?.tier]}55`, color: TIER_COLORS[topic?.tier], borderRadius: 6, padding: "4px 12px", fontSize: 12, textTransform: "capitalize" }}>{topic?.tier}</span>
              </div>
            </div>

            {/* ── Architecture Tab ── */}
            {activeTab === "architecture" && (
              <div>
                <DSAVisual topic={topic} />
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Time & Space Complexity</h3>
                  <ComplexityTable c={topic.complexity} />
                  <p style={{ color: "#6b7280", fontSize: 11, margin: "8px 0 0" }}>* Amortised average case. Worst case may differ.</p>
                </div>
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Production Applications</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                    {(REAL_WORLD_APPS[topic.id] || []).map(app => (
                      <div key={app.name} style={{ background: "#161b22", border: "1px solid #2d3139", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 18 }}>{app.icon}</span>
                          <div>
                            <div style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 600 }}>{app.name}</div>
                            <div style={{ color: topic.color, fontSize: 10, marginTop: 1 }}>{app.who}</div>
                          </div>
                        </div>
                        <p style={{ color: "#6b7280", fontSize: 11.5, margin: 0, lineHeight: 1.6 }}>{app.what}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Concepts Tab ── */}
            {activeTab === "concepts" && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  {topic.concepts.map((c, i) => <ConceptCard key={i} c={c} />)}
                </div>
                <div style={{ background: "#161b22", border: "1px solid #2d3139", borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ color: "#10b981", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✓ When To Use</div>
                      <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{topic.tradeoffs.use}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✗ When To Avoid</div>
                      <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{topic.tradeoffs.avoid}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Implementations Tab ── */}
            {activeTab === "implementations" && (
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  {LANGS.map(l => (
                    <button key={l} onClick={() => setActiveLang(l)}
                      style={{ background: activeLang === l ? "#1a1d24" : "transparent", border: `1px solid ${activeLang === l ? "#3b82f6" : "#2d3139"}`, borderRadius: 6, padding: "5px 11px", color: activeLang === l ? "#3b82f6" : "#6b7280", cursor: "pointer", fontSize: 11.5, fontWeight: activeLang === l ? 600 : 400 }}>
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
                <div style={{ background: "#161b22", border: "1px solid #2d3139", borderRadius: 10, padding: "10px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#6b7280", fontSize: 11 }}>// implementations/core/{activeLang}/{topic.id}.{activeLang === "python" ? "py" : activeLang === "go" ? "go" : activeLang === "rust" ? "rs" : activeLang === "java" ? "java" : "ts"}</span>
                </div>
                <CodeBlock code={topic.code[activeLang]} lang={activeLang} />
              </div>
            )}

            {/* ── Leadership Tab ── */}
            {activeTab === "leadership" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    icon: "💬", title: "Explain to Your Team",
                    color: "#3b82f6",
                    content: `"${topic.name} gives us ${topic.tradeoffs.use.split(".")[0].toLowerCase()}. The key invariant is that ${topic.concepts[0]?.def?.split(".")[0].toLowerCase() || "it maintains its core property through all operations"}. We'd choose this over alternatives when ${topic.tradeoffs.use.split(",")[0].toLowerCase()}."`
                  },
                  {
                    icon: "🏛️", title: "Justify the Decision",
                    color: "#8b5cf6",
                    content: `Frame it as: "${topic.name} is the right choice here because it provides ${topic.complexity.search} search and ${topic.complexity.insert} insert. The alternative was [X], which trades [Y] for [Z]. Given our access pattern skews toward [reads/writes], this is the better fit. Authoritative reference: ${topic.concepts[0]?.source || "CLRS"}."`
                  },
                  {
                    icon: "🔥", title: "Failure Modes & Observability",
                    color: "#ef4444",
                    content: [
                      topic.concepts.find(c => c.mistake)?.mistake,
                      `Monitor: operation latency p99, memory usage per instance, error rate on edge cases.`,
                      `Alert when: latency p99 > 10× median (indicates degradation), memory grows unbounded (memory leak in recursive implementations), or error rate spikes on concurrent access.`
                    ].filter(Boolean).join(" | ")
                  },
                  {
                    icon: "📈", title: "Scale Implications",
                    color: "#f59e0b",
                    content: `At 10× load: ${topic.complexity.space === "O(n)" ? "memory grows linearly — profile heap allocation and consider pooling." : "space is bounded — focus on operation latency."} At 100× load: concurrency contention becomes the bottleneck; consider sharding the data structure or using lock-free variants. Revisit when: a single instance holds > 1M items or operation latency > 1ms p99.`
                  },
                  {
                    icon: "✅", title: "Code Review Checklist",
                    color: "#10b981",
                    content: [
                      "Invariant maintained after every public method (esp. insert/delete)",
                      "Empty collection and single-element edge cases handled",
                      "Concurrent access: are mutations guarded by mutex or lock-free?",
                      `Correct complexity: is the implementation actually ${topic.complexity.search} for search, not accidentally worse?`,
                      "No silent panic/out-of-bounds: bounds checked before index access",
                      "Iterator/traversal doesn't hold a reference that prevents GC"
                    ].map((item, i) => `${i+1}. ${item}`).join("\n")
                  },
                  {
                    icon: "🎯", title: "Design Review Questions",
                    color: "#6b7280",
                    content: [
                      `What's the expected read:write ratio? (${topic.name} optimises for ${topic.complexity.search !== "O(n)" ? "reads" : "balanced operations"})`,
                      "Is the data size bounded or unbounded? What's the eviction strategy?",
                      "Do we need ordered iteration? If yes, does this structure support it?",
                      "What's the concurrency model? Single-writer or multi-writer?",
                      "Can we tolerate approximate results? (bloom filters, sketches) or must it be exact?",
                      `What are the latency SLAs? Can we afford ${topic.complexity.insert} inserts at peak traffic?`
                    ].map((q, i) => `Q${i+1}: ${q}`).join("\n")
                  }
                ].map(({ icon, title, color, content }) => (
                  <div key={title} style={{ background: "#161b22", border: `1px solid #2d3139`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{title}</span>
                    </div>
                    <pre style={{ color: "#9ca3af", fontSize: 12.5, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{content}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#0d1117", borderTop: "1px solid #2d3139", padding: "10px 24px", display: "flex", gap: 16, flexWrap: "wrap" }}>
        <span style={{ color: "#4b5563", fontSize: 11 }}>Sources: CLRS 4th Ed · Sedgewick Algorithms · Knuth TAOCP · Martin Fowler · Official language docs</span>
        <span style={{ color: "#4b5563", fontSize: 11, marginLeft: "auto" }}>Tech Lead Reference · {DSA_TOPICS.length} topics · Beginner → Advanced</span>
      </div>
    </div>
  );
}
