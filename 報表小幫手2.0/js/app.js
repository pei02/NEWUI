// js/app.js

const MIN_MATCH_SCORE = 0.45;

function normalizeText(text) {
  return String(text || "")
    .toUpperCase()
    .replace(/[：:]/g, " ")
    .replace(/[　\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTimeToMinutes(timeText) {
  const match = String(timeText).match(/^(\d{2})(\d{2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 24 || minute > 59) return null;
  if (hour === 24 && minute !== 0) return null;

  return hour * 60 + minute;
}

function diffMinutes(rangeText) {
  const match = String(rangeText).match(/(\d{4})\s*-\s*(\d{4})/);
  if (!match) return null;

  const start = parseTimeToMinutes(match[1]);
  const end = parseTimeToMinutes(match[2]);
  if (start === null || end === null) return null;

  let diff = end - start;
  if (diff < 0) diff += 24 * 60;

  return diff;
}

function parseInput(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map(line => normalizeText(line))
    .filter(Boolean);

  const records = [];
  let pendingReason = "";

  lines.forEach(line => {
    const ranges = [...line.matchAll(/\d{4}\s*-\s*\d{4}/g)]
      .map(match => match[0].replace(/\s/g, ""));

    const reason = line.replace(/\d{4}\s*-\s*\d{4}/g, "").trim();

    if (ranges.length === 0) {
      pendingReason = line;
      return;
    }

    const finalReason = reason || pendingReason || "";

    ranges.forEach(range => {
      const minutes = diffMinutes(range);
      if (minutes === null) return;

      records.push({
        range,
        reason: finalReason,
        minutes
      });
    });
  });

  return records;
}

function getRules() {
  if (!Array.isArray(keywordRules)) return [];

  return keywordRules.flatMap(rule => {
    return rule.keywords.map(keyword => ({
      result: rule.result,
      priority: Number(rule.priority || 0),
      keyword: normalizeText(keyword),
      length: normalizeText(keyword).length
    }));
  }).filter(rule => rule.keyword)
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return b.length - a.length;
    });
}

function similarityScore(text, keyword) {
  if (!text || !keyword) return 0;

  if (text.includes(keyword)) {
    return 1 + keyword.length / Math.max(text.length, 1);
  }

  const textParts = text.split(" ").filter(Boolean);
  const keywordParts = keyword.split(" ").filter(Boolean);
  let hitLength = 0;

  keywordParts.forEach(part => {
    if (part.length < 2) return;

    const hit = textParts.some(textPart => {
      return textPart.includes(part) || part.includes(textPart);
    });

    if (hit) hitLength += part.length;
  });

  return hitLength / Math.max(keyword.length, text.length, 1);
}

function categorizeText(reason) {
  const text = normalizeText(reason);
  const rules = getRules();

  let best = null;
  let bestRank = -Infinity;

  rules.forEach(rule => {
    const score = similarityScore(text, rule.keyword);
    if (score < MIN_MATCH_SCORE) return;

    const rank = (score * 1000) + rule.priority + (rule.length / 100);

    if (rank > bestRank) {
      bestRank = rank;
      best = {
        category: rule.result,
        keyword: rule.keyword,
        score
      };
    }
  });

  return best || {
    category: "",
    keyword: "",
    score: 0
  };
}

function roundToHalfHour(minutes) {
  return Math.round((minutes / 60) * 2) / 2;
}

function renderTimeResult(records) {
  const container = document.getElementById("timeResult");

  if (!records.length) {
    container.className = "result-list empty";
    container.innerHTML = "沒有抓到時間資料";
    return;
  }

  container.className = "result-list";
  container.innerHTML = records.map(record => `
    <div class="result-row">
      <span>${record.range} ${record.reason}</span>
      <span class="minutes">${record.minutes}分</span>
    </div>
  `).join("");
}

function renderCalculation(records) {
  const calcContainer = document.getElementById("calcResult");
  const unknownContainer = document.getElementById("unknownResult");

  const summary = {};
  const unknown = [];

  records.forEach(record => {
    const matched = categorizeText(record.reason);

    if (!matched.category) {
      unknown.push(record);
      return;
    }

    if (!summary[matched.category]) summary[matched.category] = 0;
    summary[matched.category] += record.minutes;
  });

  const summaryHtml = Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .map(([category, minutes]) => {
      return `
        <div class="summary-item">
          <span>${category}</span>
          <span class="hour">${roundToHalfHour(minutes)}H</span>
        </div>
      `;
    }).join("");

  calcContainer.className = summaryHtml ? "summary-list" : "summary-list empty";
  calcContainer.innerHTML = summaryHtml || "尚無分類結果";

  const unknownHtml = unknown.map(record => `
    <div class="result-row">
      <span>${record.range} ${record.reason}</span>
      <span class="minutes">${record.minutes}分</span>
    </div>
  `).join("");

  unknownContainer.className = unknownHtml ? "result-list" : "result-list empty";
  unknownContainer.innerHTML = unknownHtml || "尚無未分類項目";
}

function runAll() {
  const rawText = document.getElementById("inputText").value;
  const records = parseInput(rawText);

  renderTimeResult(records);
  renderCalculation(records);
}

function clearAll() {
  document.getElementById("inputText").value = "";

  document.getElementById("timeResult").className = "result-list empty";
  document.getElementById("timeResult").innerHTML = "尚未運算";

  document.getElementById("calcResult").className = "summary-list empty";
  document.getElementById("calcResult").innerHTML = "尚未分類";

  document.getElementById("unknownResult").className = "result-list empty";
  document.getElementById("unknownResult").innerHTML = "尚無資料";
}

function copyResult() {
  const items = document.querySelectorAll("#calcResult .summary-item");

  const text = [...items].map(item => {
    const category = item.querySelector("span:first-child")?.innerText.trim() || "";
    const hour = item.querySelector(".hour")?.innerText.trim() || "";
    return `${category} ${hour}`;
  }).join("\n");

  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    showCopyToast();
  });
}

function showCopyToast() {
  const toast = document.getElementById("copyToast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}