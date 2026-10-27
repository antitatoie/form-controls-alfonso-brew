/**
 * Alfonso Brew — Local Data Storage & Ledger Rendering
 */

const STORAGE_KEYS = {
  product: 'alfonso-brew.products',
  checkout: 'alfonso-brew.checkouts',
  feedback: 'alfonso-brew.feedback',
};

const LEDGERS = {
  product: { list: 'product-ledger-list', count: 'product-count-pill', noun: 'Items' },
  checkout: { list: 'checkout-ledger-list', count: 'checkout-count-pill', noun: 'Orders' },
  feedback: { list: 'feedback-ledger-list', count: 'feedback-count-pill', noun: 'Reviews' },
};

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

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

function makeCard(title, subtitle, details = []) {
  const card = createElement('article', 'ledger-item');
  card.append(createElement('h4', 'ledger-item-title', title));
  if (subtitle) card.append(createElement('p', 'ledger-item-subtitle', subtitle));
  details.forEach(([label, value]) => appendDetail(card, label, value));
  return card;
}

function renderEmpty(list, message) {
  list.replaceChildren(createElement('p', 'ledger-empty', message));
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
    if (type === 'product') {
      return makeCard(record.product_name, record.category, [
        ['SKU', record.product_sku],
        ['Price', currency.format(Number(record.price))],
        ['Status', record.is_available ? 'Available on POS' : 'Draft / unavailable'],
        ['Image', record.product_image],
      ]);
    }

    if (type === 'checkout') {
      return makeCard(record.customer_name, `${record.selected_beverage} · ${record.createdLabel}`, [
        ['Quantity', record.order_qty],
        ['Payment', record.payment_method],
        ['Amount due', currency.format(Number(record.net_total))],
        ['Tendered', currency.format(Number(record.amount_tendered))],
        ['Change', currency.format(Number(record.change_due))],
        ['Receipt', record.transaction_number],
      ]);
    }

    return makeCard(record.reviewer_name, `${record.branch_visited} · ${record.createdLabel}`, [
      ['Rating', record.overall_rating],
      ['Categories', record.items_tried],
      ['Follow-up', record.allow_followup ? 'Allowed' : 'Not requested'],
    ]);
  });

  list.replaceChildren(...cards);
}

function saveRecord(type, record) {
  const records = readCollection(type);
  records.push(record);
  window.localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(records));
  renderCollection(type);
}

function filterProducts(filters) {
  const records = readCollection('product');
  const keyword = filters.search_keyword.trim().toLocaleLowerCase();
  const minimum = filters.price_min === '' ? null : Number(filters.price_min);
  const maximum = filters.price_max === '' ? null : Number(filters.price_max);
  const from = filters.date_from || '';
  const to = filters.date_to || '';

  const results = records.filter((product) => {
    const matchesKeyword = !keyword
      || `${product.product_name} ${product.product_sku}`.toLocaleLowerCase().includes(keyword);
    const matchesCategory = filters.audit_category === 'All'
      || product.category === filters.audit_category;
    const price = Number(product.price);
    const recordDate = (product.createdAt || '').slice(0, 10);
    const matchesPrice = (minimum === null || price >= minimum)
      && (maximum === null || price <= maximum);
    const matchesDates = (!from || !recordDate || recordDate >= from)
      && (!to || !recordDate || recordDate <= to);
    const matchesAvailability = filters.stock_status === 'All'
      || (filters.stock_status === 'Active Only' && product.is_available)
      || (filters.stock_status === 'Inactive/Draft' && !product.is_available);
    return matchesKeyword && matchesCategory && matchesPrice
      && matchesDates && matchesAvailability;
  });

  const sorters = {
    'Newest First': (left, right) => (right.createdAt || '').localeCompare(left.createdAt || ''),
    'Price (Low to High)': (left, right) => Number(left.price) - Number(right.price),
    'Price (High to Low)': (left, right) => Number(right.price) - Number(left.price),
    'Name (A-Z)': (left, right) => left.product_name.localeCompare(right.product_name),
  };
  results.sort(sorters[filters.sort_by] || sorters['Newest First']);
  return results;
}

function renderFilteredProducts(results, columns) {
  const list = document.getElementById('filter-ledger-list');
  const count = document.getElementById('filter-count-pill');
  if (!list || !count) return;

  count.textContent = `${results.length} Matches`;
  if (!results.length) {
    renderEmpty(list, 'No catalog items match these filters.');
    return;
  }

  const cards = results.map((product) => {
    const card = makeCard(product.product_name, product.category, [
      columns.includes('SKU Code') && ['SKU', product.product_sku],
      ['Price', currency.format(Number(product.price))],
      columns.includes('Unit Cost') && ['Unit cost', currency.format(Number(product.unit_cost))],
      columns.includes('Gross Margin') && [
        'Gross margin',
        `${(100 * (Number(product.price) - Number(product.unit_cost)) / Number(product.price)).toFixed(1)}%`,
      ],
      columns.includes('Prep Time') && ['Prep time', `${product.prep_time} minutes`],
      ['Status', product.is_available ? 'Available on POS' : 'Draft / unavailable'],
    ].filter(Boolean));
    return card;
  });
  list.replaceChildren(...cards);
}

function clearFilteredProducts() {
  const list = document.getElementById('filter-ledger-list');
  const count = document.getElementById('filter-count-pill');
  if (!list || !count) return;
  count.textContent = '0 Matches';
  renderEmpty(list, 'Apply filters to view matching catalog items.');
}

export const DataHandler = {
  initialize() {
    Object.keys(LEDGERS).forEach(renderCollection);
  },
  saveRecord,
  filterProducts,
  renderFilteredProducts,
  clearFilteredProducts,
  currency,
};
