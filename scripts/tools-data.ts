// Starter tools published to WordPress by scripts/seed-tools.ts.
// After seeding, WordPress is the source of truth — edit tools there.

export type SeedTool = {
  type: "calculator" | "image-compressor" | "embed";
  code?: string; // embed tools: HTML/CSS/JS run in the sandboxed frame
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  icon: string;
  order: number;
  metaTitle: string;
  metaDescription: string;
  config: unknown;
  faq: { q: string; a: string }[];
  content: string; // article HTML shown under the calculator
};

const ROI_OUTPUTS_TAIL = [
  { key: "cpa", label: "Cost per conversion", formula: "if(conversions > 0, budget / conversions, 0)", prefix: "₹", decimals: 0, help: "What each lead or sale costs you in ad spend." },
  { key: "revenue", label: "Estimated revenue", formula: "conversions * value", prefix: "₹", decimals: 0 },
  { key: "roas", label: "ROAS", formula: "if(budget > 0, revenue / budget, 0)", suffix: "x", decimals: 2, highlight: true, help: "Revenue earned for every ₹1 spent on ads." },
  { key: "profit", label: "Estimated profit", formula: "revenue * margin / 100 - budget", prefix: "₹", decimals: 0, highlight: true, help: "Gross profit after paying for the ads." },
  { key: "roi", label: "ROI", formula: "if(budget > 0, profit / budget * 100, 0)", suffix: "%", decimals: 1 },
  { key: "max_cpa", label: "Break-even cost per conversion", formula: "value * margin / 100", prefix: "₹", decimals: 0, help: "The most you can pay per conversion before you lose money." },
];

const ROI_INSIGHTS = [
  { when: "conversions < 1", text: "At this budget you would get fewer than one conversion a month. Raise the budget or improve your conversion rate before judging the channel." },
  { when: "conversions >= 1 && profit < 0", text: "You are losing money at these numbers: your cost per conversion is above the break-even figure. Lower your cost, lift your conversion rate or raise your order value." },
  { when: "profit >= 0 && roas >= 4", text: "A ROAS of 4x or more is generally considered healthy. You have room to test a higher budget." },
];

export const SEED_TOOLS: SeedTool[] = [
  {
    type: "calculator",
    slug: "google-ads-budget-roi-calculator",
    title: "Google Ads Budget & ROI Calculator",
    excerpt: "Estimate clicks, conversions, cost per lead, ROAS and profit from your Google Ads budget before you spend a rupee.",
    category: "Advertising",
    icon: "megaphone",
    order: 1,
    metaTitle: "Google Ads Calculator: Budget, ROAS & ROI Estimator (Free)",
    metaDescription: "Free Google Ads calculator. Enter your budget, CPC and conversion rate to estimate clicks, cost per conversion, ROAS, profit and break-even CPA.",
    config: {
      inputs: [
        { key: "budget", label: "Monthly ad budget", type: "number", default: 50000, min: 0, step: 1000, prefix: "₹", help: "What you plan to spend on Google Ads each month." },
        { key: "cpc", label: "Average cost per click (CPC)", type: "number", default: 30, min: 0.01, step: 0.5, prefix: "₹", help: "Find this in Google Ads or the Keyword Planner." },
        { key: "cr", label: "Conversion rate", type: "number", default: 3, min: 0, max: 100, step: 0.1, suffix: "%", help: "Share of clicks that become a lead or sale." },
        { key: "value", label: "Average order / lead value", type: "number", default: 3000, min: 0, step: 100, prefix: "₹" },
        { key: "margin", label: "Profit margin", type: "number", default: 40, min: 0, max: 100, step: 1, suffix: "%", help: "Gross margin on each sale, before ad costs." },
      ],
      outputs: [
        { key: "clicks", label: "Estimated clicks", formula: "if(cpc > 0, budget / cpc, 0)", decimals: 0 },
        { key: "conversions", label: "Estimated conversions", formula: "clicks * cr / 100", decimals: 1 },
        ...ROI_OUTPUTS_TAIL,
      ],
      insights: ROI_INSIGHTS,
      disclaimer: "Estimates for planning only. Actual results depend on your keywords, ads, landing page and competition.",
    },
    faq: [
      { q: "What is a good ROAS for Google Ads?", a: "It depends on your margin. Divide 100 by your profit margin to get your break-even ROAS (a 40% margin breaks even at 2.5x). Anything above that is profit; 4x or more is generally considered healthy for e-commerce." },
      { q: "How do I find my average CPC?", a: "Open your Google Ads account and look at the Avg. CPC column for your campaigns. If you have no data yet, use the Keyword Planner's suggested bid range for your keywords as a starting point." },
      { q: "What conversion rate should I use?", a: "Use your website's real conversion rate if you have one. New landing pages commonly convert between 2% and 5%; lead forms often sit near the top of that range and e-commerce near the bottom." },
      { q: "Does this include my agency or management fees?", a: "No. Add those to the monthly budget field if you want the profit figure to include them." },
    ],
    content:
      "<h2>How this Google Ads calculator works</h2><p>The calculator turns your monthly budget into clicks (budget divided by cost per click), then into conversions using your conversion rate. From the number of conversions it works out what each conversion costs you, the revenue you can expect, and the profit left after paying for the ads.</p><h2>The numbers that matter</h2><ul><li><strong>ROAS</strong> (return on ad spend) is revenue divided by ad spend. It tells you how hard each rupee works.</li><li><strong>Break-even cost per conversion</strong> is the most you can pay for a lead or sale before the campaign loses money. If your actual cost per conversion is higher, fix the funnel before raising the budget.</li><li><strong>ROI</strong> includes your margin, so it shows real profit instead of just revenue.</li></ul><h2>How to improve your results</h2><p>Three levers move these numbers: a lower CPC (better Quality Score and tighter keywords), a higher conversion rate (a faster, clearer landing page) and a higher order value (bundles, upsells). Change one input at a time in the calculator to see which lever matters most for your business.</p>",
  },
  {
    type: "calculator",
    slug: "meta-ads-budget-roi-calculator",
    title: "Meta Ads (Facebook & Instagram) Budget & ROI Calculator",
    excerpt: "Plan your Facebook and Instagram ad spend: estimate impressions, clicks, cost per result, ROAS and profit from your CPM, CTR and conversion rate.",
    category: "Advertising",
    icon: "share",
    order: 2,
    metaTitle: "Meta Ads Calculator: Facebook & Instagram Ad ROI Estimator",
    metaDescription: "Free Meta Ads calculator for Facebook and Instagram. Enter budget, CPM, CTR and conversion rate to estimate clicks, CPA, ROAS, profit and break-even.",
    config: {
      inputs: [
        { key: "budget", label: "Monthly ad budget", type: "number", default: 50000, min: 0, step: 1000, prefix: "₹" },
        { key: "cpm", label: "CPM (cost per 1,000 impressions)", type: "number", default: 150, min: 0.01, step: 5, prefix: "₹", help: "Shown in Ads Manager. Typical range is ₹100 to ₹300 in India." },
        { key: "ctr", label: "Click-through rate (CTR)", type: "number", default: 1, min: 0, max: 100, step: 0.1, suffix: "%", help: "Link click-through rate. 1% to 2% is common." },
        { key: "cr", label: "Conversion rate", type: "number", default: 1.5, min: 0, max: 100, step: 0.1, suffix: "%", help: "Share of link clicks that become a lead or sale." },
        { key: "value", label: "Average order / lead value", type: "number", default: 3000, min: 0, step: 100, prefix: "₹" },
        { key: "margin", label: "Profit margin", type: "number", default: 40, min: 0, max: 100, step: 1, suffix: "%" },
      ],
      outputs: [
        { key: "impressions", label: "Estimated impressions", formula: "if(cpm > 0, budget / cpm * 1000, 0)", decimals: 0 },
        { key: "clicks", label: "Estimated link clicks", formula: "impressions * ctr / 100", decimals: 0 },
        { key: "cpc", label: "Cost per click", formula: "if(clicks > 0, budget / clicks, 0)", prefix: "₹", decimals: 2 },
        { key: "conversions", label: "Estimated conversions", formula: "clicks * cr / 100", decimals: 1 },
        ...ROI_OUTPUTS_TAIL,
      ],
      insights: ROI_INSIGHTS,
      disclaimer: "Estimates for planning only. Meta delivery varies by audience, creative quality, season and learning phase.",
    },
    faq: [
      { q: "What is a good CTR for Facebook and Instagram ads?", a: "Link click-through rates of 1% to 2% are common. Below 0.7% usually means the creative or audience needs work." },
      { q: "What CPM should I expect?", a: "CPM changes with audience, placement and season, and spikes around festivals and sale periods. Use the CPM from your recent campaigns in Ads Manager for the most realistic estimate." },
      { q: "Why is my real ROAS lower than the estimate?", a: "Most often the conversion rate on the landing page is lower than assumed, or the campaign is still in the learning phase. Update the inputs with your real numbers after a week of data." },
      { q: "Should I use link clicks or all clicks?", a: "Use link clicks (clicks that actually go to your site). All clicks include likes and profile taps and will make the estimate too optimistic." },
    ],
    content:
      "<h2>How this Meta Ads calculator works</h2><p>Meta charges by impressions, so the calculator starts from your CPM: budget divided by CPM, times 1,000, gives the impressions you can buy. Your click-through rate turns impressions into clicks, and your conversion rate turns clicks into leads or sales.</p><h2>Reading the results</h2><ul><li><strong>Cost per click</strong> is derived from your CPM and CTR. A weak CTR makes every click more expensive.</li><li><strong>ROAS and profit</strong> compare revenue and margin with what you spend. Anything below the break-even cost per conversion means the campaign loses money.</li></ul><h2>Where to look first when numbers are weak</h2><p>If CTR is low, test new creative and hooks. If CTR is healthy but conversions are low, the problem is usually the landing page or offer. If CPM is high, widen the audience or test different placements.</p>",
  },
  {
    type: "calculator",
    slug: "roas-break-even-calculator",
    title: "ROAS & Break-Even Calculator",
    excerpt: "Find your break-even ROAS, the most you can pay per sale, and the ROAS you need to hit a profit target.",
    category: "Advertising",
    icon: "target",
    order: 3,
    metaTitle: "ROAS Break-Even Calculator: Target ROAS & Max CPA",
    metaDescription: "Free break-even ROAS calculator. Enter your margin, order value and ad spend to find break-even ROAS, maximum CPA and the target ROAS for your profit goal.",
    config: {
      inputs: [
        { key: "price", label: "Average order value", type: "number", default: 2000, min: 0, step: 100, prefix: "₹" },
        { key: "margin", label: "Profit margin", type: "number", default: 40, min: 1, max: 100, step: 1, suffix: "%", help: "Gross margin on each sale, before ad costs." },
        { key: "spend", label: "Monthly ad spend", type: "number", default: 50000, min: 0, step: 1000, prefix: "₹" },
        { key: "target", label: "Monthly profit goal", type: "number", default: 20000, min: 0, step: 1000, prefix: "₹", help: "Profit you want after paying for ads." },
      ],
      outputs: [
        { key: "be_roas", label: "Break-even ROAS", formula: "if(margin > 0, 100 / margin, 0)", suffix: "x", decimals: 2, highlight: true, help: "Below this ROAS every sale loses money." },
        { key: "max_cpa", label: "Maximum cost per sale", formula: "price * margin / 100", prefix: "₹", decimals: 0, highlight: true, help: "Pay more than this per sale and you lose money." },
        { key: "be_orders", label: "Orders needed to break even", formula: "if(max_cpa > 0, spend / max_cpa, 0)", decimals: 0 },
        { key: "be_revenue", label: "Revenue needed to break even", formula: "be_orders * price", prefix: "₹", decimals: 0 },
        { key: "target_revenue", label: "Revenue needed for your profit goal", formula: "if(margin > 0, (spend + target) * 100 / margin, 0)", prefix: "₹", decimals: 0 },
        { key: "target_roas", label: "Target ROAS for your profit goal", formula: "if(spend > 0, target_revenue / spend, 0)", suffix: "x", decimals: 2, highlight: true },
      ],
      insights: [
        { when: "margin < 15", text: "Margins below 15% leave very little room for paid ads. Raise prices, reduce costs or focus on repeat purchases." },
      ],
      disclaimer: "Uses gross margin on the order value you enter and ignores shipping, returns and agency fees unless you include them in the margin.",
    },
    faq: [
      { q: "What is break-even ROAS?", a: "It is the return on ad spend at which your gross profit exactly covers the ad cost. It equals 100 divided by your profit margin: a 40% margin breaks even at 2.5x." },
      { q: "What is the difference between ROAS and ROI?", a: "ROAS is revenue divided by ad spend and ignores your costs. ROI includes your margin, so it shows actual profit. A 3x ROAS can still be a loss if your margin is below 33%." },
      { q: "How do I include shipping and returns?", a: "Lower the profit margin to what is left after shipping, payment fees and an average return rate." },
    ],
    content:
      "<h2>Why break-even ROAS matters</h2><p>A ROAS number means nothing until you compare it with your margin. A 3x ROAS is great for a 50% margin product and a loss for a 25% margin one. This calculator turns your margin into the single number you need to beat.</p><h2>What each result tells you</h2><ul><li><strong>Break-even ROAS</strong> is the floor for every campaign you run.</li><li><strong>Maximum cost per sale</strong> is the ceiling for what you can pay to acquire a customer.</li><li><strong>Target ROAS</strong> is what you must reach to hit your profit goal, not just break even. Use it as the target in your ad platform's bidding settings.</li></ul>",
  },
  {
    type: "image-compressor",
    slug: "image-compressor",
    title: "Free Image Compressor (JPG, PNG, WebP)",
    excerpt: "Shrink images in your browser without uploading them anywhere. Convert to WebP or JPEG, resize and download in seconds.",
    category: "Images",
    icon: "image",
    order: 4,
    metaTitle: "Free Image Compressor: Compress JPG, PNG & WebP Online",
    metaDescription: "Compress images online for free. Reduce JPG, PNG and WebP file size, convert to WebP and resize, all in your browser. Nothing is uploaded.",
    config: { quality: 80, format: "webp", maxWidth: 0, maxFiles: 20, maxFileSizeMB: 25 },
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. Compression happens inside your browser tab using your own device. Your images never leave your computer or phone." },
      { q: "What quality should I choose?", a: "70 to 85% is usually visually identical to the original and much smaller. Go lower for thumbnails and backgrounds, higher for photography portfolios." },
      { q: "WebP or JPEG?", a: "WebP is typically 25 to 35% smaller than JPEG at the same quality and is supported by all modern browsers. Choose JPEG only if you need compatibility with older software." },
      { q: "Why did my file not get smaller?", a: "Some images are already well optimised. Try a lower quality or set a maximum width, since resizing is the biggest saver for large photos." },
    ],
    content:
      "<h2>Why compress images?</h2><p>Images are usually the heaviest part of a web page. Smaller images load faster, improve your Core Web Vitals and Largest Contentful Paint score, and help both rankings and conversions.</p><h2>How to get the best result</h2><ul><li><strong>Resize first.</strong> A 6000px photo shown at 1200px wide wastes most of its bytes. Set a maximum width that matches where the image is displayed.</li><li><strong>Use WebP.</strong> It gives the smallest files with no visible loss for most photos and graphics.</li><li><strong>Keep quality around 80%.</strong> Past this point file size drops quickly while the difference is hard to see.</li></ul><h2>Your privacy</h2><p>Everything runs locally in your browser. No upload, no account and no limits beyond your device's memory.</p>",
  },
  {
    type: "embed",
    slug: "word-and-character-counter",
    title: "Word & Character Counter",
    excerpt: "Count words, characters, sentences and paragraphs, estimate reading time and see your most-used keywords as you type.",
    category: "Writing & SEO",
    icon: "file-text",
    order: 5,
    metaTitle: "Word Counter & Keyword Density Checker (Free Online Tool)",
    metaDescription: "Free word counter. Count words, characters, sentences and paragraphs, see reading time and your top keywords with density as you type.",
    config: { height: 640, autoHeight: true },
    code: "<style>\n  .wc textarea{width:100%;min-height:220px;padding:16px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#fff;resize:vertical;outline:none}\n  .wc textarea:focus{border-color:#C56E3D}\n  .wc .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:16px}\n  .wc .card{border-radius:14px;padding:14px 16px;background:rgba(197,110,61,.1);border:1px solid rgba(197,110,61,.3)}\n  .wc .card b{display:block;font-size:26px;line-height:1.1}\n  .wc .card span{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#C56E3D;font-weight:800}\n  .wc h3{margin:24px 0 8px;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#C56E3D}\n  .wc ol{margin:0;padding-left:20px;color:rgba(255,255,255,.7)}\n  .wc button{margin-top:12px;padding:10px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;cursor:pointer}\n  .wc .hint{list-style:none;margin-left:-20px;color:rgba(255,255,255,.4)}\n</style>\n<div class=\"wc\">\n  <label for=\"txt\" style=\"display:block;margin-bottom:8px;font-weight:700\">Paste or type your text</label>\n  <textarea id=\"txt\" placeholder=\"Start typing...\"></textarea>\n  <div class=\"grid\">\n    <div class=\"card\"><span>Words</span><b id=\"w\">0</b></div>\n    <div class=\"card\"><span>Characters</span><b id=\"c\">0</b></div>\n    <div class=\"card\"><span>No spaces</span><b id=\"cn\">0</b></div>\n    <div class=\"card\"><span>Sentences</span><b id=\"s\">0</b></div>\n    <div class=\"card\"><span>Paragraphs</span><b id=\"p\">0</b></div>\n    <div class=\"card\"><span>Reading time</span><b id=\"r\">0 min</b></div>\n  </div>\n  <h3>Top keywords</h3>\n  <ol id=\"k\"><li class=\"hint\">Type some text to see the most used words.</li></ol>\n  <button id=\"clear\" type=\"button\">Clear text</button>\n</div>\n<script>\n  var STOP = new Set('a an and are as at be but by for from has have he her his i in is it its of on or our she so that the their them they this to was we were will with you your'.split(' '));\n  var t = document.getElementById('txt');\n  function $(id){return document.getElementById(id)}\n  function update(){\n    var v = t.value;\n    var words = (v.match(/[\\p{L}\\p{N}'-]+/gu) || []);\n    $('w').textContent = words.length.toLocaleString();\n    $('c').textContent = v.length.toLocaleString();\n    $('cn').textContent = v.replace(/\\s/g,'').length.toLocaleString();\n    $('s').textContent = (v.match(/[^.!?]+[.!?]+(\\s|$)|[^.!?]+$/g) || []).filter(function(x){return x.trim()}).length;\n    $('p').textContent = v.split(/\\n\\s*\\n/).filter(function(x){return x.trim()}).length;\n    var mins = words.length / 200;\n    $('r').textContent = words.length === 0 ? '0 min' : (mins < 1 ? '< 1 min' : Math.ceil(mins) + ' min');\n    var freq = {};\n    words.forEach(function(w){ w = w.toLowerCase(); if (w.length > 2 && !STOP.has(w)) freq[w] = (freq[w]||0) + 1; });\n    var top = Object.keys(freq).sort(function(a,b){return freq[b]-freq[a]}).slice(0,8);\n    var k = $('k'); k.innerHTML = '';\n    if (!top.length) { var li = document.createElement('li'); li.className='hint'; li.textContent='Type some text to see the most used words.'; k.appendChild(li); return; }\n    top.forEach(function(w){ var li = document.createElement('li'); li.textContent = w + ' (' + freq[w] + ', ' + (freq[w]/words.length*100).toFixed(1) + '%)'; k.appendChild(li); });\n  }\n  t.addEventListener('input', update);\n  $('clear').addEventListener('click', function(){ t.value=''; update(); t.focus(); });\n</script>",
    faq: [
      { q: "How is reading time calculated?", a: "It assumes an average adult reading speed of 200 words per minute." },
      { q: "What is keyword density?", a: "The percentage of your text made up by one word. For SEO, aim for natural writing; there is no magic target, but a word making up more than 3% of the text can look stuffed." },
      { q: "Is my text saved?", a: "No. Everything stays in your browser and disappears when you close the page." },
    ],
    content:
      "<h2>Word counts that matter</h2><p>Meta descriptions work best around 150 to 160 characters, page titles around 60, and most blog posts that rank are 1,000 words or more. Paste your draft above to check where you stand.</p><h2>Use the keyword list</h2><p>The top keywords list ignores common filler words. If the words you want to rank for are missing, your copy may not be focused on the topic yet.</p>",
  },
];
