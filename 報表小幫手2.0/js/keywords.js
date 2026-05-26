// js/keywords.js
// 維護方式：
// 1. 已有分類：找到對應 result，新增 keywords 即可
// 2. 全新分類：新增一包物件
// 3. priority 可重複，不是 ID，是優先權等級
// 建議：900=超明確，800=明確設備詞，700=普通，500=模糊，300=危險泛用詞

const keywordRules = [
  {
    result: "U/L真空不良(BOAT變形)",
    priority: 900,
    keywords: [
      "U/L測高失敗鎖機",
      "U/L HIGH AB SUBS",
      "上蓋測高",
      "U/L上蓋高度異常",
      "出料BUFFER卡料"
    ]
  },
  {
    result: "U/L真空不良(基板偏移)",
    priority: 850,
    keywords: [
      "U/L吸料不良",
      "U/L真空異常鎖機",
      "U/L SUBS VACUUM NG",
      "U/L NG",
      "U/L真空",
      "U/L ERROR",
      "B13 VAC",
      "SUBS. VACUUM NG",
      "真空解鎖",
      "收料機台鎖定",
      "收料機",
      "UNLOADER",
      "B13"
    ]
  },
  {
    result: "U/L真空不良",
    priority: 760,
    keywords: [
      "U/L下蓋吸取異常",
      "U/L下蓋吸不起來",
      "出料BUFFER",
      "出料"
    ]
  },
  {
    result: "U/L測高異常",
    priority: 820,
    keywords: ["測高解鎖"]
  },
  {
    result: "U/L 2D讀不良",
    priority: 900,
    keywords: ["U/L BOAT READER NG"]
  },

  {
    result: "Minami印刷調整",
    priority: 820,
    keywords: [
      "印刷異常",
      "印刷不良",
      "印刷缺錫",
      "印刷位偏",
      "刮刀刮不乾淨",
      "刮刀",
      "SPI ALWAYS ALARM",
      "SPI每條ALARM",
      "SPI每條叫"
    ]
  },
  {
    result: "Minami機故",
    priority: 800,
    keywords: [
      "MINAMI NG",
      "MINAMI",
      "SQUEEGEE PRESSURE OVER",
      "印刷機離線",
      "印刷機真空",
      "印刷機",
      "MINAMI定位點不良"
    ]
  },
  {
    result: "鋼板保養",
    priority: 760,
    keywords: ["鋼板保養", "D06"]
  },

  {
    result: "SPI機故",
    priority: 800,
    keywords: [
      "SPI檢測影像模糊",
      "SPI每條模糊",
      "SPI模糊",
      "SPI NG",
      "SPI"
    ]
  },

  {
    result: "AOI機故",
    priority: 800,
    keywords: [
      "AOI定位點失敗",
      "AOI ERROR",
      "AOI STOP",
      "AOI鎖機",
      "AOI當機",
      "AOI異物待ME確認",
      "AOI一直叫",
      "AOI每條ALARM",
      "AOI"
    ]
  },

  {
    result: "NXT置件調整",
    priority: 850,
    keywords: [
      "NXT 電容位偏",
      "NXT 位偏",
      "NXT位偏",
      "置件頭",
      "更換置件頭",
      "連續置件偏移",
      "連續缺件",
      "缺件"
    ]
  },
  {
    result: "NXT機故",
    priority: 820,
    keywords: [
      "NXT真空不良",
      "NXT真空",
      "NXT PRESSURE NG",
      "NXT基板漏真空",
      "NXT ERROR",
      "NXT VAC. NG",
      "NXT VAC",
      "NXT"
    ]
  },

  {
    result: "入料機機故",
    priority: 790,
    keywords: [
      "LOADER馬達伺服器異常",
      "LOADER無動作",
      "LOADER NG 推桿",
      "LOADER當機",
      "LOADER NG",
      "LOADER",
      "B12"
    ]
  },
  {
    result: "過帳失敗",
    priority: 760,
    keywords: [
      "LOADER不夾盒",
      "無法過帳",
      "MES NO GOOD",
      "MOVE IN"
    ]
  },
  {
    result: "輸送不良",
    priority: 740,
    keywords: [
      "輸送不良",
      "入料卡貨",
      "卡流道",
      "卡貨",
      "CIM"
    ]
  },

  {
    result: "BSK 2D讀取不良",
    priority: 840,
    keywords: [
      "BSK讀檔失敗",
      "BSK 無法讀取",
      "BSK READER NG",
      "BSK NO READ"
    ]
  },
  {
    result: "BSK機故",
    priority: 760,
    keywords: ["BSK NG", "BSK"]
  },

  {
    result: "配合2900作業(堆貨)",
    priority: 760,
    keywords: [
      "I06/WAIT 2900",
      "I06 WT2900",
      "I01 WT2900",
      "I06 Q-TIME",
      "I06 Q TIME",
      "2900 QTIME"
    ]
  },
  {
    result: "配合2900作業(換貨)",
    priority: 750,
    keywords: [
      "WAIT 2900 Y01",
      "W2900 Y01",
      "WAITING(82) Y01",
      "待 2900 下貨",
      "待2900換貨",
      "I06/82Y01",
      "I06 WT82",
      "I06(WT2900-Y01)",
      "WAIT 2900",
      "W 2900",
      "WT 2900",
      "待82"
    ]
  },
  {
    result: "配合2900作業",
    priority: 700,
    keywords: ["WT2900"]
  },
  {
    result: "待基板",
    priority: 740,
    keywords: [
      "I04 WT2845",
      "I04/WAIT 2845",
      "I04 WT 2845",
      "WAIT 2845",
      "W 2845 補基板",
      "補基板",
      "WT2845",
      "待基板",
      "2845",
      "基板",
      "I04"
    ]
  },
  {
    result: "待下底板",
    priority: 730,
    keywords: [
      "待A2底板",
      "待下蓋",
      "待底板",
      "待下底板",
      "待BOAT",
      "I04/WT BOAT",
      "W09 BOAT",
      "WAITING BOAT",
      "WT BOAT",
      "W BOAT",
      "WAIT BOAT"
    ]
  },
  {
    result: "待上蓋板",
    priority: 730,
    keywords: [
      "W09 COVER",
      "WT COVER",
      "W COVER",
      "WAIT COVER",
      "WAITING COVER",
      "待上蓋",
      "上蓋",
      "COVER"
    ]
  },
  {
    result: "待保養",
    priority: 700,
    keywords: ["保養", "PM"]
  },
  {
    result: "打DUMMY",
    priority: 700,
    keywords: ["RUN DUMMY", "DUMMY*8", "W ME DUMMY * 8"]
  },

  {
    result: "Y41/Y00",
    priority: 700,
    keywords: ["Y41.Y00", "Y41+Y00", "Y41", "Y00"]
  },
  { result: "Y01", priority: 690, keywords: ["Y01"] },
  { result: "Y02", priority: 690, keywords: ["Y02"] },
  { result: "Y03", priority: 690, keywords: ["Y03"] },

  { result: "待WAFER", priority: 650, keywords: ["I02 WAFER", "I02"] },
  { result: "單機作業", priority: 650, keywords: ["I03"] },
  { result: "材料異常", priority: 650, keywords: ["I05"] },
  { result: "機台電源關閉", priority: 650, keywords: ["I99"] },
  { result: "待OP", priority: 650, keywords: ["NO OP", "WAIT OP", "WT OP", "OP WASH", "待OP", "W01", "W06"] },
  { result: "待QA", priority: 650, keywords: ["W02"] },
  { result: "待PE或RD", priority: 650, keywords: ["W03"] },
  {
    result: "待週邊工具(非機台Tool, 如Magazine, Cassette 等夾治具)",
    priority: 500,
    keywords: ["W09"]
  },

  { result: "跳電", priority: 700, keywords: ["跳電"] }
];
