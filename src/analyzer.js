/**
 * Complexity Analyzer
 * Multi-language: JavaScript, TypeScript, Python, Java, C, C++
 */

// Complexity Helpers 

const COMPLEXITY_ORDER = [
  'O(1)', 'O(log n)', 'O(n)', 'O(n log n)',
  'O(n^2)', 'O(n^3)', 'O(2^n)', 'O(n!)'
];

function getComplexityRank(c) {
  const clean = c.replace(/\s/g, '').toLowerCase();
  const idx = COMPLEXITY_ORDER.findIndex(x => x.replace(/\s/g,'').toLowerCase() === clean);
  return idx === -1 ? 2 : idx;
}

function maxComplexity(a, b) {
  return getComplexityRank(a) >= getComplexityRank(b) ? a : b;
}

function getSeverity(c) {
  const r = getComplexityRank(c);
  if (r <= 1) return 'low';
  if (r <= 2) return 'medium';
  if (r <= 3) return 'high';
  return 'critical';
}

//Language Pattern Definitions

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
    sort:      [{ regex: /\.sort\s*\(/, label: '.sort()', complexity: 'O(n log n)' }],
    search:    [
      { regex: /\.indexOf\s*\(/, label: '.indexOf()' },
      { regex: /\.includes\s*\(/, label: '.includes()' },
      { regex: /\.findIndex\s*\(/, label: '.findIndex()' },
    ],
    hashDS:    [{ regex: /new\s+(Map|Set)\s*\(/, label: 'Map/Set' }],
    logOp:     [{ regex: /Math\.log\s*\(/, label: 'Math.log()' }],
    funcDecl:  /^(?:async\s+)?function\s+(\w+)\s*\(|^(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*\)\s*=>)\s*\{/,
    blockOpen: '{', blockClose: '}',
    comment:   line => line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*'),
    singleLine: false,
  },

  typescript: null, 

  python: {
    loops: [
      { regex: /^\s*for\s+.+\s+in\s+/, label: 'for loop' },
      { regex: /^\s*while\s+/, label: 'while loop' },
      { regex: /\[.+\s+for\s+.+\s+in\s+/, label: 'list comprehension' },
      { regex: /\{.+\s+for\s+.+\s+in\s+/, label: 'dict/set comprehension' },
    ],
    sort:   [
      { regex: /\.sort\s*\(|sorted\s*\(/, label: 'sort()/sorted()', complexity: 'O(n log n)' },
    ],
    search: [
      { regex: /\bin\s+/, label: 'in operator', note: 'O(n) for list, O(1) for set/dict' },
      { regex: /\.index\s*\(/, label: '.index()' },
      { regex: /\.count\s*\(/, label: '.count()' },
    ],
    hashDS: [
      { regex: /=\s*\{\}|=\s*dict\s*\(|=\s*set\s*\(|defaultdict|Counter\s*\(/, label: 'dict/set' },
    ],
    logOp:  [{ regex: /math\.log\s*\(|log\s*\(/, label: 'math.log()' }],
    funcDecl: /^\s*def\s+(\w+)\s*\(/,
    blockOpen: ':',
    blockClose: null, // Python uses indentation
    comment: line => line.trim().startsWith('#'),
    singleLine: true, // indentation-based
  },

  java: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
      { regex: /\.forEach\s*\(/, label: '.forEach()' },
      { regex: /\.stream\s*\(\s*\)/, label: '.stream()' },
      { regex: /\.map\s*\(/, label: 'stream .map()' },
      { regex: /\.filter\s*\(/, label: 'stream .filter()' },
    ],
    sort:   [
      { regex: /Arrays\.sort\s*\(|Collections\.sort\s*\(|\.sort\s*\(/, label: 'Arrays/Collections.sort()', complexity: 'O(n log n)' },
    ],
    search: [
      { regex: /\.contains\s*\(/, label: '.contains()' },
      { regex: /\.indexOf\s*\(/, label: '.indexOf()' },
      { regex: /Arrays\.binarySearch\s*\(/, label: 'Arrays.binarySearch()', note: 'O(log n) — binary search' },
    ],
    hashDS: [
      { regex: /new\s+HashMap\s*\(|new\s+HashSet\s*\(|new\s+LinkedHashMap\s*\(/, label: 'HashMap/HashSet' },
    ],
    logOp:  [{ regex: /Math\.log\s*\(/, label: 'Math.log()' }],
    funcDecl: /(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\([^)]*\)\s*(?:throws\s+\w+\s*)?\{/,
    blockOpen: '{', blockClose: '}',
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*'),
    singleLine: false,
  },

  c: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
    ],
    sort:   [
      { regex: /\bqsort\s*\(/, label: 'qsort()', complexity: 'O(n log n)' },
    ],
    search: [
      { regex: /\bbsearch\s*\(/, label: 'bsearch()', note: 'O(log n) — binary search' },
      { regex: /\bstrstr\s*\(/, label: 'strstr()' },
    ],
    hashDS: [],
    logOp:  [{ regex: /\blog\s*\(|\blog2\s*\(/, label: 'log()' }],
    funcDecl: /^[\w\s\*]+\s+(\w+)\s*\([^)]*\)\s*\{/,
    blockOpen: '{', blockClose: '}',
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*'),
    singleLine: false,
  },

  cpp: {
    loops: [
      { regex: /\bfor\s*\(/, label: 'for loop' },
      { regex: /\bwhile\s*\(/, label: 'while loop' },
      { regex: /\bdo\s*\{/, label: 'do-while loop' },
      { regex: /for\s*\(auto/, label: 'range-based for loop' },
      { regex: /std::for_each\s*\(/, label: 'std::for_each()' },
    ],
    sort:   [
      { regex: /std::sort\s*\(|sort\s*\(/, label: 'std::sort()', complexity: 'O(n log n)' },
      { regex: /std::stable_sort\s*\(/, label: 'std::stable_sort()', complexity: 'O(n log n)' },
    ],
    search: [
      { regex: /std::find\s*\(|find\s*\(/, label: 'std::find()' },
      { regex: /std::binary_search\s*\(/, label: 'std::binary_search()', note: 'O(log n)' },
      { regex: /\.count\s*\(/, label: '.count()' },
    ],
    hashDS: [
      { regex: /unordered_map|unordered_set/, label: 'unordered_map/set' },
      { regex: /\bmap\s*<|\bset\s*</, label: 'map/set (tree-based)', note: 'O(log n) operations' },
    ],
    logOp:  [{ regex: /\blog\s*\(|\blog2\s*\(/, label: 'log()' }],
    funcDecl: /^(?:[\w:<>*&\s]+)\s+(\w+)\s*\([^)]*\)\s*(?:const\s*)?\{/,
    blockOpen: '{', blockClose: '}',
    comment: line => line.trim().startsWith('//') || line.trim().startsWith('*'),
    singleLine: false,
  },
};

// TypeScript = same as JavaScript
LANGUAGE_PATTERNS.typescript = { ...LANGUAGE_PATTERNS.javascript };

// ─── Function Boundary Extractor ─────────────────────────────────────────────

function extractFunctions(lines, lang) {
  const patterns = LANGUAGE_PATTERNS[lang] || LANGUAGE_PATTERNS.javascript;
  const functions = [];

  if (patterns.singleLine) {
    // Python: indentation-based
    return extractPythonFunctions(lines);
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (patterns.comment(line)) { i++; continue; }

    const match = trimmed.match(patterns.funcDecl);
    if (match) {
      const funcName = match[1] || match[2] || 'anonymous';
      const startLine = i;
      let depth = 0, endLine = i, foundOpen = false;

      for (let j = i; j < lines.length; j++) {
        for (const ch of lines[j]) {
          if (ch === '{') { depth++; foundOpen = true; }
          if (ch === '}') depth--;
        }
        if (foundOpen && depth === 0) { endLine = j; break; }
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

function extractPythonFunctions(lines) {
  const functions = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\s*)def\s+(\w+)\s*\(/);
    if (match) {
      const indent = match[1].length;
      const funcName = match[2];
      const startLine = i;
      let endLine = i;

      for (let j = i + 1; j < lines.length; j++) {
        const l = lines[j];
        if (l.trim() === '') { endLine = j; continue; }
        const lineIndent = l.match(/^(\s*)/)[1].length;
        if (lineIndent <= indent && l.trim() !== '') { endLine = j - 1; break; }
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

// Single Function Analyzer 

function analyzeFunction(func, lang) {
  const { name, startLine, lines } = func;
  const patterns = LANGUAGE_PATTERNS[lang] || LANGUAGE_PATTERNS.javascript;
  const steps = [];
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let loopDepths = [];
  let spaceFactors = [];

  const bodyText = lines.slice(1).join('\n');
  const isRecursive = new RegExp(`\\b${name}\\s*\\(`).test(bodyText);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = startLine + i + 1;
    const trimmed = line.trim();

    if (!trimmed || patterns.comment(line)) {
      // Still pop loop stack on closing braces even in "empty" lines
      if (patterns.blockClose) {
        const closes = (line.match(/\}/g) || []).length;
        for (let b = 0; b < closes; b++) { if (loopDepths.length > 0) loopDepths.pop(); }
      }
      continue;
    }

    const opens  = patterns.blockOpen  ? (line.match(/\{/g) || []).length : 0;
    const closes = patterns.blockClose ? (line.match(/\}/g) || []).length : 0;
    let annotated = false;

    //Loops 
    for (const p of patterns.loops) {
      if (p.regex.test(line)) {
        const depth = loopDepths.length;
        loopDepths.push(lineNum);
        let c, reason;
        if (depth === 0)      { c = 'O(n)';       reason = `Single ${p.label} — iterates over n elements`; }
        else if (depth === 1) { c = 'O(n^2)';     reason = `Nested inside 1 loop → O(n) × O(n) = O(n²)`; }
        else if (depth === 2) { c = 'O(n^3)';     reason = `Nested inside 2 loops → O(n³)`; }
        else                  { c = `O(n^${depth+1})`; reason = `${depth+1}-level deep nested loop`; }
        steps.push({ lineNum, code: trimmed, type: 'loop', label: p.label, complexity: c, reason, nestingDepth: depth, severity: getSeverity(c) });
        timeComplexity = maxComplexity(timeComplexity, c);
        annotated = true;
        break;
      }
    }

    // Sort
    if (!annotated) {
      for (const p of patterns.sort) {
        if (p.regex.test(line)) {
          steps.push({ lineNum, code: trimmed, type: 'sort', label: p.label, complexity: p.complexity || 'O(n log n)', reason: `${p.label} — typically O(n log n)`, severity: 'high' });
          timeComplexity = maxComplexity(timeComplexity, p.complexity || 'O(n log n)');
          annotated = true; break;
        }
      }
    }

    // Log ops 
    if (!annotated) {
      for (const p of patterns.logOp) {
        if (p.regex.test(line)) {
          steps.push({ lineNum, code: trimmed, type: 'log', label: p.label, complexity: 'O(log n)', reason: 'Logarithmic operation', severity: 'low' });
          timeComplexity = maxComplexity(timeComplexity, 'O(log n)');
          annotated = true; break;
        }
      }
    }

    // Linear search 
    if (!annotated) {
      for (const p of patterns.search) {
        if (p.regex.test(line)) {
          const depth = loopDepths.length;
          const note = p.note || 'Linear search';
          // Special case: if it's a known O(log n) search
          const baseC = (note.includes('log n')) ? 'O(log n)' : 'O(n)';
          const c = depth > 0 && baseC === 'O(n)' ? `O(n^${depth+1})` : baseC;
          steps.push({ lineNum, code: trimmed, type: 'search', label: p.label, complexity: c, reason: depth > 0 ? `${note} inside a loop → ${c}` : note, severity: getSeverity(c) });
          timeComplexity = maxComplexity(timeComplexity, c);
          annotated = true; break;
        }
      }
    }

    // Hash data structures 
    if (!annotated && patterns.hashDS) {
      for (const p of patterns.hashDS) {
        if (p.regex.test(line)) {
          const note = p.note || 'O(1) average lookup & insert, O(n) space';
          steps.push({ lineNum, code: trimmed, type: 'data-structure', label: p.label, complexity: 'O(1) lookup', reason: `${p.label}: ${note}`, severity: 'low' });
          spaceFactors.push('O(n)');
          annotated = true; break;
        }
      }
    }

    // Pop loop stack on closing braces
    if (closes > 0 && loopDepths.length > 0) {
      for (let b = 0; b < closes; b++) { if (loopDepths.length > 0) loopDepths.pop(); }
    }

    // Python: pop loop based on dedent
    if (patterns.singleLine && loopDepths.length > 0) {
      const currentIndent = (line.match(/^(\s*)/) || ['',''])[1].length;
      // rough heuristic: if indent went back to 0, reset loop stack
      if (currentIndent === 0 && i > 0) loopDepths = [];
    }
  }

  // Recursion
  if (isRecursive) {
    steps.unshift({ lineNum: startLine + 1, code: lines[0].trim(), type: 'recursion', label: `recursive: ${name}()`, complexity: 'O(2<sup>n</sup>)', reason: `${name}() calls itself → exponential growth. Use memoization to reduce to O(n).`, severity: 'critical' });
    timeComplexity = maxComplexity(timeComplexity, 'O(2^n)');
  }

  if (spaceFactors.length > 0) spaceComplexity = 'O(n)';
  if (isRecursive) spaceComplexity = maxComplexity(spaceComplexity, 'O(n)');

  return {
    name, startLine: startLine + 1, endLine: func.endLine + 1,
    timeComplexity, spaceComplexity, steps,
    explanation: generateExplanation(timeComplexity),
    tips: generateTips(steps, timeComplexity, isRecursive),
    severity: getSeverity(timeComplexity), isRecursive
  };
}

// Main Entry 

function analyzeCode(code, lang = 'javascript') {
  const normalizedLang = lang.toLowerCase();
  const lines = code.split('\n');
  const functions = extractFunctions(lines, normalizedLang);
  const analyzedFunctions = functions.map(fn => analyzeFunction(fn, normalizedLang));

  const overallTimeComplexity = analyzedFunctions.reduce((w, f) => maxComplexity(w, f.timeComplexity), 'O(1)');
  const overallSpaceComplexity = analyzedFunctions.reduce((w, f) => maxComplexity(w, f.spaceComplexity), 'O(1)');
  const allSteps = analyzedFunctions.flatMap(f => f.steps);

  return {
    language: normalizedLang,
    functions: analyzedFunctions, steps: allSteps,
    overallTimeComplexity, overallSpaceComplexity,
    explanation: generateExplanation(overallTimeComplexity),
    tips: generateTips(allSteps, overallTimeComplexity, analyzedFunctions.some(f => f.isRecursive))
  };
}

// Explanation & Tips 

function generateExplanation(c) {
  const map = {
    'O(1)':       'Constant time — same speed regardless of input size. Ideal!',
    'O(log n)':   'Logarithmic — very efficient, halves the problem each step.',
    'O(n)':       'Linear — grows proportionally with input. Good for most cases.',
    'O(n log n)': 'Linearithmic — typical of efficient sorting algorithms.',
    'O(n^2)':     'Quadratic — grows with square of input. Avoid on large data!',
    'O(n^3)':     'Cubic — very slow for large inputs. Refactor if possible.',
    'O(2^n)':     'Exponential — doubles with each input. Only for tiny inputs.',
    'O(n!)':      'Factorial — extremely slow. Brute-force only. ',
  };
  return map[c] || `Complexity: ${c}`;
}

function generateTips(steps, overall, hasRecursion) {
  const tips = [];
  if (steps.some(s => s.type === 'loop' && s.nestingDepth >= 1))
    tips.push({ icon: '', tip: 'Nested loops detected. Use a HashMap/Set to reduce O(n²) → O(n).', example: '// Use a hash map instead of nested loops\nconst seen = new Map();\nfor (const val of arr) { ... }' });
  if (steps.some(s => s.type === 'search' && s.nestingDepth > 0))
    tips.push({ icon: '', tip: 'Linear search inside a loop = O(n²). Use a Set/dict for O(1) lookups.', example: 'const set = new Set(arr); // O(1) lookup\nif (set.has(val)) { ... }' });
  if (hasRecursion)
    tips.push({ icon: '', tip: 'Recursion without memoization = O(2<sup>n</sup>). Cache results to get O(n).', example: 'const memo = {};\nfunction solve(n) {\n  if (memo[n]) return memo[n];\n  return memo[n] = solve(n-1) + solve(n-2);\n}' });
  if (overall === 'O(1)' && steps.length === 0)
    tips.push({ icon: '2', tip: 'All functions run in constant time. No performance concerns!', example: null });
  return tips;
}

module.exports = { analyzeCode, LANGUAGE_PATTERNS };
