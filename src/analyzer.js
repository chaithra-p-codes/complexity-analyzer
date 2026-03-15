//Complexity Analyzer 

const COMPLEXITY_ORDER = [
  'O(1)', 'O(log n)', 'O(n)', 'O(n log n)',
  'O(n^2)', 'O(n^3)', 'O(V + E)', 'O(2^n)', 'O(n!)'
];

function getRank(c) {
  if (!c) return 2;
  const clean = c.replace(/\s/g, '').toLowerCase();
  const i = COMPLEXITY_ORDER.findIndex(x => x.replace(/\s/g, '').toLowerCase() === clean);
  return i === -1 ? 2 : i;
}

function maxComplexity(a, b) {
  return getRank(a) >= getRank(b) ? a : b;
}

function getSeverity(c) {
  const r = getRank(c);
  if (r <= 1) return 'low';
  if (r <= 2) return 'medium';
  if (r <= 3) return 'high';
  return 'critical';
}

//Algorithm Pattern Detector 

function detectAlgorithmPatterns(body) {
  const detected = [];

  const patterns = {
    binarySearch: {
      label: 'Binary Search',
      complexity: 'O(log n)',
      reason: 'Detected binary search pattern — input halves each iteration',
      checks: [
        /while\s*\(\s*low\s*<=\s*high/,
        /mid\s*=.*low.*high|mid\s*=.*high.*low/,
        /low\s*=\s*mid|high\s*=\s*mid/,
        /\[\s*mid\s*\]/
      ],
      threshold: 2
    },
    twoPointer: {
      label: 'Two Pointer',
      complexity: 'O(n)',
      reason: 'Detected two pointer pattern — single pass through input',
      checks: [
        /(left|right)\s*\+\+/,
        /(left|right)\s*--/,
        /while\s*\(\s*(left|lo)\s*</
      ],
      threshold: 2
    },
    slidingWindow: {
      label: 'Sliding Window',
      complexity: 'O(n)',
      reason: 'Detected sliding window — single pass with a window',
      checks: [
        /(start|begin|left)\s*\+\+/,
        /(window|windowSum|windowSize)/,
        /(end|right)\s*\+\+/
      ],
      threshold: 2
    },
    bfs: {
      label: 'BFS (Breadth-First Search)',
      complexity: 'O(V + E)',
      reason: 'Detected BFS — visits all vertices and edges once',
      checks: [
        /queue\./i,
        /(poll|offer|dequeue|enqueue|push|shift)\s*\(/,
        /while\s*\(.*queue/i,
        /visited/
      ],
      threshold: 2
    },
    dfs: {
      label: 'DFS (Depth-First Search)',
      complexity: 'O(V + E)',
      reason: 'Detected DFS — visits all vertices and edges once',
      checks: [
        /\bdfs\s*\(/i,
        /visited/,
        /stack\./i,
        /neighbors|adjacent|adj\[/
      ],
      threshold: 2
    },
    dynamicProgramming: {
      label: 'Dynamic Programming',
      complexity: 'O(n^2)',
      reason: 'Detected DP — stores subproblem results to avoid recomputation',
      checks: [
        /dp\s*\[/,
        /memo\s*\[|memo\s*\{/,
        /cache\s*\[|cache\s*\{/
      ],
      threshold: 2
    },
    backtracking: {
      label: 'Backtracking',
      complexity: 'O(2^n)',
      reason: 'Detected backtracking — explores all possibilities',
      checks: [
        /backtrack\s*\(/i,
        /result\.push|res\.push/,
        /path\.push/,
        /path\.pop/
      ],
      threshold: 2
    },
    divideAndConquer: {
      label: 'Divide and Conquer',
      complexity: 'O(n log n)',
      reason: 'Detected divide and conquer — splits problem into subproblems',
      checks: [
        /mid\s*=.*\/\s*2/,
        /(mergeSort|quickSort|merge)\s*\(/i,
      ],
      threshold: 2
    }
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    let score = 0;
    for (const regex of pattern.checks) {
      if (regex.test(body)) score++;
    }
    if (score >= pattern.threshold) {
      detected.push({
        key,
        label: pattern.label,
        complexity: pattern.complexity,
        reason: pattern.reason
      });
    }
  }

  return detected;
}

//Language Patterns 

const LANGUAGE_PATTERNS = {
  javascript: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
      { regex: /\.forEach\s*\(/, label: '.forEach()' },
      { regex: /\.map\s*\(/, label: '.map()' },
      { regex: /\.filter\s*\(/, label: '.filter()' },
      { regex: /\.reduce\s*\(/, label: '.reduce()' },
      { regex: /\.flatMap\s*\(/, label: '.flatMap()' },
      { regex: /\.some\s*\(/, label: '.some()' },
      { regex: /\.every\s*\(/, label: '.every()' },
      { regex: /\.find\b/, label: '.find()' },
    ],
    sort:   [{ regex: /\.sort\s*\(/, label: '.sort()', complexity: 'O(n log n)' }],
    search: [
      { regex: /\.indexOf\s*\(/, label: '.indexOf()' },
      { regex: /\.includes\s*\(/, label: '.includes()' },
      { regex: /\.findIndex\s*\(/, label: '.findIndex()' },
    ],
    hashDS: [{ regex: /new\s+(Map|Set)\s*\(/, label: 'Map/Set' }],
    logOp:  [{ regex: /Math\.log\s*\(/, label: 'Math.log()' }],
    funcDecl: /^(?:async\s+)?function\s+(\w+)\s*\(|^(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*\)\s*=>)\s*\{?/,
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*'),
    isPython: false,
  },
  python: {
    loops: [
      { regex: /^\s*for\s+.+\s+in\s+/, label: 'for loop' },
      { regex: /^\s*while\s+/, label: 'while loop' },
      { regex: /\[.+\s+for\s+.+\s+in\s+/, label: 'list comprehension' },
    ],
    sort:   [{ regex: /\.sort\s*\(|sorted\s*\(/, label: 'sort()/sorted()', complexity: 'O(n log n)' }],
    search: [
      { regex: /\.index\s*\(/, label: '.index()' },
      { regex: /\.count\s*\(/, label: '.count()' },
    ],
    hashDS: [{ regex: /=\s*\{\}|=\s*dict\s*\(|=\s*set\s*\(|defaultdict|Counter\s*\(/, label: 'dict/set' }],
    logOp:  [{ regex: /math\.log\s*\(/, label: 'math.log()' }],
    funcDecl: /^\s*def\s+(\w+)\s*\(/,
    comment: line => line.trim().startsWith('#'),
    isPython: true,
  },
  java: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
      { regex: /\.forEach\s*\(/, label: '.forEach()' },
      { regex: /\.stream\s*\(\s*\)/, label: '.stream()' },
    ],
    sort:   [{ regex: /Arrays\.sort\s*\(|Collections\.sort\s*\(|\.sort\s*\(/, label: 'Arrays/Collections.sort()', complexity: 'O(n log n)' }],
    search: [
      { regex: /\.contains\s*\(/, label: '.contains()' },
      { regex: /\.indexOf\s*\(/, label: '.indexOf()' },
      { regex: /Arrays\.binarySearch\s*\(/, label: 'Arrays.binarySearch()', note: 'O(log n)' },
    ],
    hashDS: [{ regex: /new\s+HashMap\s*\(|new\s+HashSet\s*\(/, label: 'HashMap/HashSet' }],
    logOp:  [{ regex: /Math\.log\s*\(/, label: 'Math.log()' }],
    funcDecl: /(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\([^)]*\)\s*(?:throws\s+\w+\s*)?\{?/,
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*'),
    isPython: false,
  },
  c: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
    ],
    sort:   [{ regex: /\bqsort\s*\(/, label: 'qsort()', complexity: 'O(n log n)' }],
    search: [{ regex: /\bbsearch\s*\(/, label: 'bsearch()', note: 'O(log n)' }],
    hashDS: [],
    logOp:  [{ regex: /\blog\s*\(|\blog2\s*\(/, label: 'log()' }],
    funcDecl: /^[\w\s\*]+\s+(\w+)\s*\([^)]*\)\s*\{?/,
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*'),
    isPython: false,
  },
  cpp: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
      { regex: /for\s*\(\s*auto/, label: 'range-based for' },
      { regex: /std::for_each\s*\(/, label: 'std::for_each()' },
    ],
    sort:   [{ regex: /std::sort\s*\(|sort\s*\(/, label: 'std::sort()', complexity: 'O(n log n)' }],
    search: [
      { regex: /std::find\s*\(/, label: 'std::find()' },
      { regex: /std::binary_search\s*\(/, label: 'std::binary_search()', note: 'O(log n)' },
    ],
    hashDS: [{ regex: /unordered_map|unordered_set/, label: 'unordered_map/set' }],
    logOp:  [{ regex: /\blog\s*\(|\blog2\s*\(/, label: 'log()' }],
    funcDecl: /^(?:[\w:<>*&\s]+)\s+(\w+)\s*\([^)]*\)\s*(?:const\s*)?\{?/,
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*'),
    isPython: false,
  }
};

LANGUAGE_PATTERNS.typescript = { ...LANGUAGE_PATTERNS.javascript };

// Function Extraction 

function extractFunctions(lines, lang) {
  const patterns = LANGUAGE_PATTERNS[lang] || LANGUAGE_PATTERNS.javascript;
  if (patterns.isPython) return extractPythonFunctions(lines);

  const functions = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed || patterns.comment(lines[i])) { i++; continue; }

    const match = trimmed.match(patterns.funcDecl);
    if (match) {
      const funcName = match[1] || match[2] || 'anonymous';
      const startLine = i;
      let depth = 0, endLine = i, foundOpen = false;

      // Search for opening brace 
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        if (lines[j].includes('{')) { foundOpen = true; break; }
      }

      if (!foundOpen) { i++; continue; }

      // Now counting braces to find closing
      for (let j = i; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === '{') depth++;
          if (ch === '}') depth--;
        }
        if (depth > 0 || (j === i && depth === 0 && !lines[j].includes('{'))) continue;
        if (depth === 0 && j > i) { endLine = j; break; }
        if (depth === 0 && j === i) continue;
      }

      if (endLine > startLine) {
        functions.push({
          name: funcName,
          startLine,
          endLine,
          lines: lines.slice(startLine, endLine + 1)
        });
        i = endLine + 1;
        continue;
      }
    }
    i++;
  }

  if (functions.length === 0) {
    functions.push({ name: '(global scope)', startLine: 0, endLine: lines.length - 1, lines });
  }
  return functions;
}

function extractPythonFunctions(lines) {
  const functions = [];
  let i = 0;
  while (i < lines.length) {
    const match = lines[i].match(/^(\s*)def\s+(\w+)\s*\(/);
    if (match) {
      const indent = match[1].length;
      const funcName = match[2];
      const startLine = i;
      let endLine = i;
      for (let j = i + 1; j < lines.length; j++) {
        const l = lines[j];
        if (l.trim() === '') { endLine = j; continue; }
        if (l.match(/^(\s*)/)[1].length <= indent && l.trim() !== '') { endLine = j - 1; break; }
        endLine = j;
      }
      functions.push({ name: funcName, startLine, endLine, lines: lines.slice(startLine, endLine + 1) });
      i = endLine + 1;
      continue;
    }
    i++;
  }
  if (functions.length === 0) {
    functions.push({ name: '(global scope)', startLine: 0, endLine: lines.length - 1, lines });
  }
  return functions;
}

//Function Analyzer 

function analyzeFunction(func, lang) {
  const { name, startLine, lines } = func;
  const patterns = LANGUAGE_PATTERNS[lang] || LANGUAGE_PATTERNS.javascript;
  const steps = [];
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let spaceFactors = [];
  let braceDepth = 0;
  let loopStack = [];

  const bodyText = lines.join('\n');
  const isRecursive = new RegExp(`\\b${name}\\s*\\(`).test(lines.slice(1).join('\n'));
  const detectedAlgorithms = detectAlgorithmPatterns(bodyText);
  const algorithmOverride = detectedAlgorithms.length > 0 ? detectedAlgorithms[0] : null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = startLine + i + 1;
    const trimmed = line.trim();

    if (!trimmed || patterns.comment(line)) {
      const o = (line.match(/\{/g) || []).length;
      const c = (line.match(/\}/g) || []).length;
      braceDepth += o - c;
      while (loopStack.length > 0 && braceDepth < loopStack[loopStack.length - 1]) {
        loopStack.pop();
      }
      continue;
    }

    const opens  = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    let annotated = false;

    for (const p of patterns.loops) {
      if (p.regex.test(line)) {
        const depth = loopStack.length;
        loopStack.push(braceDepth + opens);

        if (algorithmOverride) {
          annotated = true;
          break;
        }

        let c, reason;
        if (depth === 0)      { c = 'O(n)';           reason = `Single ${p.label} — iterates over n elements`; }
        else if (depth === 1) { c = 'O(n^2)';         reason = `Nested inside 1 loop → O(n) x O(n) = O(n^2)`; }
        else if (depth === 2) { c = 'O(n^3)';         reason = `Nested inside 2 loops → O(n^3)`; }
        else                  { c = `O(n^${depth+1})`; reason = `${depth+1}-level deep nested loop`; }

        steps.push({ lineNum, code: trimmed, type: 'loop', label: p.label, complexity: c, reason, nestingDepth: depth, severity: getSeverity(c) });
        timeComplexity = maxComplexity(timeComplexity, c);
        annotated = true;
        break;
      }
    }

    // ── Sort ──
    if (!annotated) {
      for (const p of patterns.sort) {
        if (p.regex.test(line)) {
          const c = p.complexity || 'O(n log n)';
          steps.push({ lineNum, code: trimmed, type: 'sort', label: p.label, complexity: c, reason: `${p.label} — O(n log n) sorting algorithm`, severity: 'high' });
          timeComplexity = maxComplexity(timeComplexity, c);
          annotated = true; break;
        }
      }
    }

    // ── Log ──
    if (!annotated) {
      for (const p of patterns.logOp) {
        if (p.regex.test(line)) {
          steps.push({ lineNum, code: trimmed, type: 'log', label: p.label, complexity: 'O(log n)', reason: 'Logarithmic operation', severity: 'low' });
          timeComplexity = maxComplexity(timeComplexity, 'O(log n)');
          annotated = true; break;
        }
      }
    }

    // ── Search ──
    if (!annotated) {
      for (const p of patterns.search) {
        if (p.regex.test(line)) {
          const isLogN = p.note && p.note.includes('log n');
          const depth = loopStack.length;
          const baseC = isLogN ? 'O(log n)' : 'O(n)';
          const c = depth > 0 && !isLogN ? `O(n^${depth + 1})` : baseC;
          steps.push({ lineNum, code: trimmed, type: 'search', label: p.label, complexity: c, reason: depth > 0 ? `Search inside a loop -> ${c}` : (p.note || 'Linear search'), severity: getSeverity(c) });
          timeComplexity = maxComplexity(timeComplexity, c);
          annotated = true; break;
        }
      }
    }

    // ── Hash DS ──
    if (!annotated && patterns.hashDS) {
      for (const p of patterns.hashDS) {
        if (p.regex.test(line)) {
          steps.push({ lineNum, code: trimmed, type: 'data-structure', label: p.label, complexity: 'O(1) lookup', reason: `${p.label}: O(1) average lookup and insert, O(n) space`, severity: 'low' });
          spaceFactors.push('O(n)');
          annotated = true; break;
        }
      }
    }

    braceDepth += opens - closes;
    while (loopStack.length > 0 && braceDepth < loopStack[loopStack.length - 1]) {
      loopStack.pop();
    }
  }

  for (const algo of detectedAlgorithms) {
    steps.unshift({
      lineNum: startLine + 1,
      code: lines[0].trim(),
      type: 'algorithm',
      label: algo.label,
      complexity: algo.complexity,
      reason: algo.reason,
      severity: getSeverity(algo.complexity)
    });
    timeComplexity = algo.complexity;
  }

  // ── Recursion ──
  if (isRecursive) {
    steps.unshift({
      lineNum: startLine + 1,
      code: lines[0].trim(),
      type: 'recursion',
      label: `recursive: ${name}()`,
      complexity: 'O(2^n)',
      reason: `${name}() calls itself — exponential growth. Use memoization to reduce to O(n).`,
      severity: 'critical'
    });
    timeComplexity = maxComplexity(timeComplexity, 'O(2^n)');
  }

  if (spaceFactors.length > 0) spaceComplexity = 'O(n)';
  if (isRecursive) spaceComplexity = maxComplexity(spaceComplexity, 'O(n)');

  return {
    name,
    startLine: startLine + 1,
    endLine: func.endLine + 1,
    timeComplexity,
    spaceComplexity,
    steps,
    explanation: generateExplanation(timeComplexity),
    tips: generateTips(steps, timeComplexity, isRecursive, detectedAlgorithms),
    severity: getSeverity(timeComplexity),
    isRecursive,
    detectedAlgorithms
  };
}

//Main Entry 

function analyzeCode(code, lang = 'javascript') {
  const langMap = {
    'java': 'java', 'javascript': 'javascript', 'typescript': 'typescript',
    'python': 'python', 'c': 'c', 'cpp': 'cpp', 'c++': 'cpp'
  };
  const normalizedLang = langMap[lang.toLowerCase()] || 'javascript';
  const lines = code.split('\n');
  const functions = extractFunctions(lines, normalizedLang);
  const analyzedFunctions = functions.map(fn => analyzeFunction(fn, normalizedLang));

  const overallTimeComplexity = analyzedFunctions.reduce((w, f) => maxComplexity(w, f.timeComplexity), 'O(1)');
  const overallSpaceComplexity = analyzedFunctions.reduce((w, f) => maxComplexity(w, f.spaceComplexity), 'O(1)');
  const allSteps = analyzedFunctions.flatMap(f => f.steps);

  return {
    language: normalizedLang,
    functions: analyzedFunctions,
    steps: allSteps,
    overallTimeComplexity,
    overallSpaceComplexity,
    explanation: generateExplanation(overallTimeComplexity),
    tips: generateTips(allSteps, overallTimeComplexity, analyzedFunctions.some(f => f.isRecursive), [])
  };
}

//Explanation & Tips 

function generateExplanation(c) {
  const map = {
    'O(1)':       'Constant time — same speed regardless of input size. Ideal!',
    'O(log n)':   'Logarithmic — very efficient, halves the problem each step.',
    'O(n)':       'Linear — grows proportionally with input. Good for most cases.',
    'O(n log n)': 'Linearithmic — typical of efficient sorting algorithms.',
    'O(n^2)':     'Quadratic — grows with square of input. Avoid on large data!',
    'O(n^3)':     'Cubic — very slow for large inputs. Refactor if possible.',
    'O(V + E)':   'Graph traversal — visits every vertex and edge once.',
    'O(2^n)':     'Exponential — doubles with each input. Only for tiny inputs.',
    'O(n!)':      'Factorial — extremely slow. Brute-force only.',
  };
  return map[c] || `Complexity: ${c}`;
}

function generateTips(steps, overall, hasRecursion, detectedAlgorithms) {
  const tips = [];
  if (steps.some(s => s.type === 'loop' && s.nestingDepth >= 1)) {
    tips.push({ icon: 'TIP', tip: 'Nested loops detected. Use a HashMap/Set to reduce O(n^2) to O(n).', example: 'const map = new Map();\nfor (const val of arr) {\n  if (map.has(target - val)) return true;\n  map.set(val, true);\n}' });
  }
  if (steps.some(s => s.type === 'search' && s.nestingDepth > 0)) {
    tips.push({ icon: 'TIP', tip: 'Linear search inside a loop = O(n^2). Use a Set for O(1) lookups.', example: 'const set = new Set(arr);\nif (set.has(val)) { ... }' });
  }
  if (hasRecursion) {
    tips.push({ icon: 'TIP', tip: 'Recursion without memoization = O(2^n). Cache results to get O(n).', example: 'const memo = {};\nfunction solve(n) {\n  if (memo[n]) return memo[n];\n  return memo[n] = solve(n-1) + solve(n-2);\n}' });
  }
  if (detectedAlgorithms && detectedAlgorithms.some(a => a.key === 'dynamicProgramming')) {
    tips.push({ icon: 'TIP', tip: 'DP detected. Fill table bottom-up to avoid stack overflow.', example: 'for (let i = 1; i <= n; i++) {\n  dp[i] = dp[i-1] + dp[i-2];\n}' });
  }
  return tips;
}

module.exports = { analyzeCode };
