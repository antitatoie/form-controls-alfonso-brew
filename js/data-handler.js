/**
 * Alfonso Brew — Local Data Storage, Seed Catalog & Live Ledger Rendering
 */

const STORAGE_KEYS = {
  product: 'alfonso-brew.products',
  checkout: 'alfonso-brew.checkouts',
  feedback: 'alfonso-brew.feedback',
  seeded: 'alfonso-brew.seeded-v1',
};

const LEDGERS = {
  product: { list: 'product-ledger-list', count: 'product-count-pill', noun: 'Items' },
  checkout: { list: 'checkout-ledger-list', count: 'checkout-count-pill', noun: 'Orders' },
  feedback: { list: 'feedback-ledger-list', count: 'feedback-count-pill', noun: 'Reviews' },
};

const DEFAULT_PRODUCTS = [
  {
    id: 'seed-prd-1',
    product_id: 'PRD-2026-001',
    product_name: 'Signature Spanish Latte',
    product_sku: 'PRD-ESP-001',
    category: 'Espresso',
    price: '155',
    unit_cost: '52.50',
    prep_time: '4',
    serving_temp: 'Hot and Iced',
    addons: ['Extra Espresso Shot', 'Oat Milk Sub'],
    description: 'Double ristretto pulled over sweetened condensed milk and textured whole milk.',
    is_available: true,
    createdAt: '2026-10-15T08:30:00.000Z',
    createdLabel: '10/15/2026, 4:30:00 PM',
  },
  {
    id: 'seed-prd-2',
    product_id: 'PRD-2026-002',
    product_name: 'Alfonso Highland Cold Brew',
    product_sku: 'PRD-CLD-002',
    category: 'Cold Brew',
    price: '140',
    unit_cost: '44.00',
    prep_time: '2',
    serving_temp: 'Iced Only',
    addons: ['Vanilla Bean Syrup', 'Oat Milk Sub'],
    description: '18-hour slow-steeped Cavite highland Arabica-Robusta blend with dark cocoa notes.',
    is_available: true,
    createdAt: '2026-10-18T09:15:00.000Z',
    createdLabel: '10/18/2026, 5:15:00 PM',
  },
  {
    id: 'seed-prd-3',
    product_id: 'PRD-2026-003',
    product_name: 'Pour Over Cavite Barako',
    product_sku: 'PRD-BRW-003',
    category: 'Brewed Coffee',
    price: '130',
    unit_cost: '38.00',
    prep_time: '6',
    serving_temp: 'Hot Only',
    addons: [],
    description: 'Single-origin Liberica hand-poured via V60, bold body with jackfruit aroma.',
    is_available: true,
    createdAt: '2026-10-20T10:00:00.000Z',
    createdLabel: '10/20/2026, 6:00:00 PM',
  },
  {
    id: 'seed-prd-4',
    product_id: 'PRD-2026-004',
    product_name: 'Artisanal Butter Croissant',
    product_sku: 'PRD-PST-004',
    category: 'Pastry',
    price: '110',
    unit_cost: '42.00',
    prep_time: '3',
    serving_temp: 'Hot Only',
    addons: ['Caramel Drizzle'],
    description: 'Flaky French-style laminated pastry baked fresh every morning. Contains wheat and dairy.',
    is_available: false,
    createdAt: '2026-10-22T07:45:00.000Z',
    createdLabel: '10/22/2026, 3:45:00 PM',
  },
];

const DEFAULT_CHECKOUTS = [
  {
    id: 'seed-chk-1',
    transaction_number: 'TXN-AB-1001',
    customer_name: 'Lorenzo Bautista',
    customer_email: 'lorenzo.bautista@example.com',
    customer_phone: '0917-842-9910',
    order_type: 'Dine-In',
    pickup_time: '09:30',
    selected_beverage: 'Signature Spanish Latte',
    order_qty: '2',
    discount_type: 'Alfonso Brew Club (10%)',
    discount_id_number: 'ABC-9042',
    payment_method: 'GCash',
    amount_tendered: '300',
    gross_total: '310.00',
    discount_total: '31.00',
    net_total: '279.00',
    change_due: '21.00',
    special_instructions: 'One hot, one iced with less sweet.',
    loyalty_optin: true,
    createdAt: '2026-10-26T01:30:00.000Z',
    createdLabel: '10/26/2026, 9:30:00 AM',
  },
];

const DEFAULT_FEEDBACK = [
  {
    id: 'seed-fb-1',
    feedback_id: 'FB-2026-01',
    reviewer_name: 'Clarisse Villanueva',
    reviewer_email: 'clarisse.v@example.com',
    branch_visited: 'Alfonso Town Proper Flagship',
    visit_date: '2026-10-25',
    overall_rating: '5 - Exceptional',
    items_tried: 'Espresso Beverages, Artisanal Pastries',
    ambiance_score: '9',
    review_comments: 'Loved the Spanish Latte and the quiet study corners. Baristas were very attentive.',
    allow_followup: true,
    createdAt: '2026-10-25T06:20:00.000Z',
    createdLabel: '10/25/2026, 2:20:00 PM',
  },
];

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

function ensureSeedData() {
  if (window.localStorage.getItem(STORAGE_KEYS.seeded)) return;
  if (!window.localStorage.getItem(STORAGE_KEYS.product)) {
    window.localStorage.setItem(STORAGE_KEYS.product, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.checkout)) {
    window.localStorage.setItem(STORAGE_KEYS.checkout, JSON.stringify(DEFAULT_CHECKOUTS));
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.feedback)) {
    window.localStorage.setItem(STORAGE_KEYS.feedback, JSON.stringify(DEFAULT_FEEDBACK));
  }
  window.localStorage.setItem(STORAGE_KEYS.seeded, 'true');
}

function readCollection(type) {
  const rawValue = window.localStorage.getItem(STORAGE_KEYS[type]);
  if (!rawValue) return [];

  const records = JSON.parse(rawValue);
  if (!Array.isArray(records)) {
    throw new Error(`Saved ${type} data is not in the expected format.`);
  }
  return records;
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function appendDetail(card, label, value) {
  if (value === undefined || value === null || value === '') return;
  const detail = createElement('p', 'ledger-item-detail');
  const labelElement = createElement('span', 'ledger-item-label', `${label}: `);
  detail.append(labelElement, document.createTextNode(String(value)));
  card.append(detail);
}

function makeCard(title, subtitle, details = [], onDelete = null) {
  const card = createElement('article', 'ledger-item');
  const headerRow = createElement('div', 'ledger-header');
  headerRow.append(createElement('h4', 'ledger-item-title', title));

  if (onDelete) {
    const deleteBtn = createElement('button', 'btn btn-secondary btn-sm', 'Remove');
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', `Remove ${title}`);
    deleteBtn.addEventListener('click', onDelete);
    headerRow.append(deleteBtn);
  }

  card.append(headerRow);
  if (subtitle) card.append(createElement('p', 'ledger-item-subtitle', subtitle));
  details.forEach(([label, value]) => appendDetail(card, label, value));
  return card;
}

function renderEmpty(list, message) {
  list.replaceChildren(createElement('p', 'ledger-empty', message));
}

function computeMarginPercent(product) {
  const price = Number(product.price) || 0;
  const cost = Number(product.unit_cost) || 0;
  if (price <= 0) return 0;
  return (100 * (price - cost)) / price;
}

function syncCheckoutMenuOptions() {
  const select = document.getElementById('chk-item');
  if (!select) return;

  const currentVal = select.value;
  const products = readCollection('product').filter((item) => item.is_available);
  if (!products.length) return;

  const placeholder = createElement('option', '', '-- Choose Menu Item --');
  placeholder.value = '';
  placeholder.dataset.price = '0';

  const options = products.map((item) => {
    const opt = createElement(
      'option',
      '',
      `${item.product_name} — ${currency.format(Number(item.price))}`
    );
    opt.value = item.product_name;
    opt.dataset.price = String(item.price);
    return opt;
  });

  select.replaceChildren(placeholder, ...options);
  if ([...select.options].some((o) => o.value === currentVal)) {
    select.value = currentVal;
  }
}

function deleteRecord(type, id) {
  const records = readCollection(type).filter((item) => item.id !== id);
  window.localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(records));
  renderCollection(type);
  if (type === 'product') {
    syncCheckoutMenuOptions();
  }
}

function renderCollection(type) {
  const config = LEDGERS[type];
  const list = document.getElementById(config.list);
  const count = document.getElementById(config.count);
  if (!list || !count) return;

  const records = readCollection(type);
  count.textContent = `${records.length} ${config.noun}`;
  if (!records.length) {
    renderEmpty(list, `No ${config.noun.toLowerCase()} have been saved yet.`);
    return;
  }

  const cards = records.slice().reverse().map((record) => {
    const handleRemove = () => deleteRecord(type, record.id);

    if (type === 'product') {
      const addonsText = Array.isArray(record.addons) && record.addons.length
        ? record.addons.join(', ')
        : 'None';
      return makeCard(
        record.product_name,
        `${record.category} · ${record.serving_temp || 'Standard'}`,
        [
          ['SKU', record.product_sku],
          ['Price / Cost', `${currency.format(Number(record.price))} (Cost: ${currency.format(Number(record.unit_cost))})`],
          ['Prep Time', `${record.prep_time} mins`],
          ['Add-ons', addonsText],
          ['Status', record.is_available ? 'Active on POS Menu' : 'Draft / Hidden'],
          ['Image', record.product_image],
        ],
        handleRemove
      );
    }

    if (type === 'checkout') {
      return makeCard(
        record.customer_name,
        `${record.selected_beverage} (x${record.order_qty}) · ${record.order_type}`,
        [
          ['Receipt #', record.transaction_number],
          ['Payment', `${record.payment_method} (${record.discount_type || 'No Discount'})`],
          ['Net Total', currency.format(Number(record.net_total))],
          ['Tendered / Change', `${currency.format(Number(record.amount_tendered))} / Change: ${currency.format(Number(record.change_due))}`],
          ['Pickup Time', record.pickup_time],
          ['Notes', record.special_instructions],
        ],
        handleRemove
      );
    }

    return makeCard(
      record.reviewer_name,
      `${record.branch_visited} · Visited ${record.visit_date}`,
      [
        ['Rating', record.overall_rating],
        ['Ambiance', `${record.ambiance_score} / 10`],
        ['Sampled', record.items_tried],
        ['Comments', record.review_comments],
        ['Follow-up', record.allow_followup ? 'Manager contact permitted' : 'No follow-up requested'],
      ],
      handleRemove
    );
  });

  list.replaceChildren(...cards);
}

function saveRecord(type, record) {
  const records = readCollection(type);
  records.push(record);
  window.localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(records));
  renderCollection(type);
  if (type === 'product') {
    syncCheckoutMenuOptions();
  }
}

function filterProducts(filters) {
  const records = readCollection('product');
  const keyword = (filters.search_keyword || '').trim().toLocaleLowerCase();
  const minimum = filters.price_min === '' || filters.price_min === undefined ? null : Number(filters.price_min);
  const maximum = filters.price_max === '' || filters.price_max === undefined ? null : Number(filters.price_max);
  const from = filters.date_from || '';
  const to = filters.date_to || '';

  const results = records.filter((product) => {
    const matchesKeyword = !keyword
      || `${product.product_name} ${product.product_sku} ${product.description || ''}`
        .toLocaleLowerCase()
        .includes(keyword);
    const matchesCategory = !filters.audit_category
      || filters.audit_category === 'All'
      || product.category === filters.audit_category;
    const price = Number(product.price);
    const recordDate = (product.createdAt || '').slice(0, 10);
    const matchesPrice = (minimum === null || price >= minimum)
      && (maximum === null || price <= maximum);
    const matchesDates = (!from || !recordDate || recordDate >= from)
      && (!to || !recordDate || recordDate <= to);
    const matchesAvailability = !filters.stock_status
      || filters.stock_status === 'All'
      || (filters.stock_status === 'Active Only' && Boolean(product.is_available))
      || (filters.stock_status === 'Inactive/Draft' && !product.is_available);

    return matchesKeyword && matchesCategory && matchesPrice && matchesDates && matchesAvailability;
  });

  const sorters = {
    'name-asc': (left, right) => left.product_name.localeCompare(right.product_name),
    'price-asc': (left, right) => Number(left.price) - Number(right.price),
    'price-desc': (left, right) => Number(right.price) - Number(left.price),
    'margin-desc': (left, right) => computeMarginPercent(right) - computeMarginPercent(left),
    'Newest First': (left, right) => (right.createdAt || '').localeCompare(left.createdAt || ''),
    'Price (Low to High)': (left, right) => Number(left.price) - Number(right.price),
    'Price (High to Low)': (left, right) => Number(right.price) - Number(left.price),
    'Name (A-Z)': (left, right) => left.product_name.localeCompare(right.product_name),
  };

  results.sort(sorters[filters.sort_by] || sorters['name-asc']);
  return results;
}

function renderFilteredProducts(results, columns = ['SKU Code', 'Unit Cost', 'Gross Margin']) {
  const list = document.getElementById('filter-ledger-list');
  const count = document.getElementById('filter-count-pill');
  if (!list || !count) return;

  count.textContent = `${results.length} Matches`;
  if (!results.length) {
    renderEmpty(list, 'No catalog items match the specified filter criteria.');
    return;
  }

  const cards = results.map((product) => {
    const margin = computeMarginPercent(product).toFixed(1);
    const card = makeCard(product.product_name, product.category, [
      columns.includes('SKU Code') && ['SKU', product.product_sku],
      ['Selling Price', currency.format(Number(product.price))],
      columns.includes('Unit Cost') && ['Unit Cost', currency.format(Number(product.unit_cost))],
      columns.includes('Gross Margin') && ['Gross Margin', `${margin}%`],
      columns.includes('Prep Time') && ['Prep Time', `${product.prep_time} mins`],
      ['POS Status', product.is_available ? 'Active on POS' : 'Inactive / Draft'],
    ].filter(Boolean));
    return card;
  });
  list.replaceChildren(...cards);
}

function clearFilteredProducts() {
  const list = document.getElementById('filter-ledger-list');
  const count = document.getElementById('filter-count-pill');
  if (!list || !count) return;
  const allProducts = readCollection('product');
  renderFilteredProducts(allProducts, ['SKU Code', 'Unit Cost', 'Gross Margin']);
}

export const DataHandler = {
  initialize() {
    ensureSeedData();
    Object.keys(LEDGERS).forEach(renderCollection);
    syncCheckoutMenuOptions();
    clearFilteredProducts();
  },
  saveRecord,
  filterProducts,
  renderFilteredProducts,
  clearFilteredProducts,
  currency,
};
