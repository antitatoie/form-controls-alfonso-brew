/**
 * Alfonso Brew — Form Portal Interactions
 */

import { DataHandler } from './data-handler.js';
import { ValidationRules } from './validation.js';

const formTypes = {
  'product-form': 'product',
  'checkout-form': 'checkout',
  'feedback-form': 'feedback',
};

const demoValues = {
  'product-form': {
    product_name: 'Alfonso Signature Spanish Latte',
    product_sku: 'PRD-ESP-001',
    category: 'Espresso',
    price: '155',
    unit_cost: '52.50',
    prep_time: '4',
    serving_temp: 'Hot and Iced',
    addons: ['Extra Espresso Shot', 'Oat Milk Sub'],
    description: 'Smooth espresso with milk and a balanced caramel finish.',
    is_available: true,
  },
  'checkout-form': {
    customer_name: 'Juan Dela Cruz',
    customer_email: 'juan.delacruz@example.com',
    customer_phone: '0917-123-4567',
    order_type: 'Dine-In',
    pickup_time: '10:30',
    selected_beverage: 'Signature Spanish Latte',
    order_qty: '1',
    discount_type: 'None',
    discount_id_number: '',
    payment_method: 'Cash',
    amount_tendered: '200',
    special_instructions: 'Less ice, please.',
    loyalty_optin: true,
  },
  'feedback-form': {
    reviewer_name: 'Maria Clara Santos',
    reviewer_email: 'maria.santos@example.com',
    branch_visited: 'Alfonso Town Proper Flagship',
    visit_date: todayLocal(),
    overall_rating: '5 - Exceptional',
    items_tried: ['Espresso Beverages', 'Artisanal Pastries'],
    ambiance_score: '9',
    review_comments: 'Excellent coffee, friendly service, and a comfortable atmosphere.',
    allow_followup: true,
  },
  'filter-form': {
    search_keyword: '',
    audit_category: 'All',
    date_from: '',
    date_to: '',
    price_min: '',
    price_max: '',
    stock_status: 'All',
    visible_columns: ['SKU Code', 'Unit Cost', 'Gross Margin'],
    sort_by: 'Newest First',
    auditor_pin: '1234',
  },
};

let statusTimer;
let previewUrl;

function todayLocal() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function showStatus(message, kind = 'info') {
  const banner = document.getElementById('global-status-banner');
  if (!banner) return;

  window.clearTimeout(statusTimer);
  banner.textContent = message;
  banner.className = `status-banner ${kind}`;
  banner.hidden = false;
  statusTimer = window.setTimeout(() => {
    banner.hidden = true;
  }, 6500);
}

function setActiveTab(tab, moveFocus = false) {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panelId = tab.getAttribute('aria-controls');

  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;

    const panel = document.getElementById(item.getAttribute('aria-controls'));
    if (panel) panel.hidden = !active;
  });

  if (moveFocus) tab.focus();
  document.getElementById(panelId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function initializeTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActiveTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      setActiveTab(tabs[nextIndex], true);
    });
  });
}

function setControlValue(form, name, value) {
  const controls = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
  if (!controls.length) return;

  if (controls[0].type === 'checkbox' && controls.length > 1) {
    controls.forEach((control) => {
      control.checked = value.includes(control.value);
    });
  } else if (controls[0].type === 'radio') {
    controls.forEach((control) => {
      control.checked = control.value === value;
    });
  } else if (controls[0].type === 'checkbox') {
    controls[0].checked = Boolean(value);
  } else {
    controls[0].value = value;
  }
}

function fillDemo(form) {
  const values = demoValues[form.id];
  if (!values) return;

  ValidationRules.clearErrors(form);
  form.dataset.submitted = 'false';
  Object.entries(values).forEach(([name, value]) => setControlValue(form, name, value));
  form.querySelectorAll('input, select, textarea').forEach((control) => {
    control.dispatchEvent(new Event('input', { bubbles: true }));
    control.dispatchEvent(new Event('change', { bubbles: true }));
  });
  updateDerivedFields(form);
  showStatus('Sample values are ready. Review them, then submit the form to save.', 'success');
}

function triggerErrors(form) {
  ValidationRules.clearErrors(form);
  form.dataset.submitted = 'true';
  form.querySelectorAll('input:not([type="hidden"]):not([type="range"]):not([type="file"]), select, textarea')
    .forEach((control) => {
      if (control.type === 'checkbox' || control.type === 'radio') control.checked = false;
      else if (control.type !== 'submit' && control.type !== 'reset' && control.type !== 'button') control.value = '';
    });
  const discount = form.elements.discount_type;
  if (discount) discount.value = 'None';
  updateDerivedFields(form);
  ValidationRules.validateForm(form);
  showStatus('Error-state preview: required values are missing. Correct the fields before submitting.', 'error');
}

function formValues(form) {
  const values = {};
  for (const [name, value] of new FormData(form)) {
    if (name === 'product_image') {
      values[name] = form.elements.product_image.files[0]?.name || '';
      continue;
    }

    if (Object.hasOwn(values, name)) {
      values[name] = Array.isArray(values[name]) ? [...values[name], value] : [values[name], value];
    } else {
      values[name] = value;
    }
  }

  const checkboxes = [...form.querySelectorAll('input[type="checkbox"]')];
  const checkboxNames = new Set(checkboxes.map((control) => control.name));
  checkboxNames.forEach((name) => {
    const group = checkboxes.filter((control) => control.name === name);
    if (group.length === 1) values[name] = group[0].checked;
    else values[name] = group.filter((control) => control.checked).map((control) => control.value);
  });
  return values;
}

function orderTotals(form) {
  const item = form.querySelector('#chk-item');
  const quantity = Number(form.elements.order_qty.value) || 0;
  const gross = Number(item?.selectedOptions[0]?.dataset.price || 0) * quantity;
  const rate = Number(form.elements.discount_type.selectedOptions[0]?.dataset.rate || 0);
  const discount = gross * rate;
  return { gross, discount, net: gross - discount };
}

function updateOrderSummary(form) {
  const totals = orderTotals(form);
  document.getElementById('summary-gross').textContent = DataHandler.currency.format(totals.gross);
  document.getElementById('summary-discount').textContent = DataHandler.currency.format(totals.discount);
  document.getElementById('summary-net').textContent = DataHandler.currency.format(totals.net);

  const tendered = form.elements.amount_tendered;
  if (tendered.value) {
    tendered.setCustomValidity(Number(tendered.value) < totals.net
      ? `Amount tendered must be at least ${DataHandler.currency.format(totals.net)}.`
      : '');
  } else {
    tendered.setCustomValidity('');
  }
}

function updateDiscountRequirement(form) {
  const discount = form.elements.discount_type.value;
  const id = form.elements.discount_id_number;
  const requiredBadge = document.getElementById('discount-id-req');
  const required = discount !== 'None';
  id.required = required;
  id.setAttribute('aria-required', String(required));
  requiredBadge.hidden = !required;
}

function updateRangeOutput(input) {
  const output = document.querySelector(`output[for="${CSS.escape(input.id)}"]`);
  if (!output) return;
  output.textContent = input.id === 'prod-prep-time'
    ? `${input.value} mins`
    : `${input.value} / 10`;
}

function updateCharacterCounter(form) {
  const textarea = form.querySelector('#prod-desc');
  const counter = document.getElementById('prod-desc-counter');
  if (textarea && counter) counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
}

function updateDerivedFields(form) {
  if (form.id === 'checkout-form') {
    updateDiscountRequirement(form);
    updateOrderSummary(form);
  }
  if (form.id === 'product-form') updateCharacterCounter(form);
}

function setFeedbackDateLimit() {
  const date = document.getElementById('fb-date');
  if (date) date.max = todayLocal();
}

function updateImagePreview(input) {
  const file = input.files[0];
  const group = input.closest('.form-group');
  if (!group) return;

  group.querySelector('.image-preview')?.remove();
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = undefined;
  if (!file) return;
  if (!file.type.startsWith('image/')) return;

  previewUrl = URL.createObjectURL(file);
  const preview = document.createElement('img');
  preview.className = 'image-preview';
  preview.alt = `Preview of ${file.name}`;
  preview.src = previewUrl;
  group.append(preview);
}

function resetForm(form) {
  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      ValidationRules.clearErrors(form);
      form.dataset.submitted = 'false';
      if (form.id === 'product-form') {
        form.querySelector('.image-preview')?.remove();
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = undefined;
      }
      updateDerivedFields(form);
      form.querySelectorAll('.form-range').forEach(updateRangeOutput);
      if (form.id === 'filter-form') DataHandler.clearFilteredProducts();
      if (form.dataset.quietReset !== 'true') {
        showStatus('Form reset to its default values.', 'info');
      }
      delete form.dataset.quietReset;
    }, 0);
  });
}

function createRecord(form, type) {
  const record = formValues(form);
  const timestamp = new Date();
  record.id = globalThis.crypto?.randomUUID?.() || `record-${Date.now()}`;
  record.createdAt = timestamp.toISOString();
  record.createdLabel = timestamp.toLocaleString();

  if (type === 'checkout') {
    const totals = orderTotals(form);
    record.gross_total = totals.gross.toFixed(2);
    record.discount_total = totals.discount.toFixed(2);
    record.net_total = totals.net.toFixed(2);
    record.change_due = (Number(record.amount_tendered) - totals.net).toFixed(2);
    record.transaction_number = `TXN-${timestamp.getTime()}`;
    form.elements.transaction_number.value = record.transaction_number;
  }

  if (type === 'feedback' && Array.isArray(record.items_tried)) {
    record.items_tried = record.items_tried.join(', ');
  }
  return record;
}

function submitForm(form) {
  const type = formTypes[form.id];
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.dataset.submitted = 'true';
    if (!ValidationRules.validateForm(form)) {
      showStatus('Please correct the highlighted fields before continuing.', 'error');
      return;
    }

    if (form.id === 'filter-form') {
      const values = formValues(form);
      const results = DataHandler.filterProducts(values);
      DataHandler.renderFilteredProducts(results, values.visible_columns || []);
      showStatus(`${results.length} catalog item${results.length === 1 ? '' : 's'} match the selected filters.`, 'success');
      return;
    }

    try {
      const record = createRecord(form, type);
      DataHandler.saveRecord(type, record);
      const label = type === 'product' ? 'Product' : type === 'checkout' ? 'Order' : 'Feedback';
      form.dataset.quietReset = 'true';
      form.reset();
      showStatus(`${label} saved successfully.`, 'success');
    } catch (error) {
      showStatus(`Unable to save this record in browser storage: ${error.message}`, 'error');
    }
  });
}

function attachFieldInteractions(form) {
  form.addEventListener('input', (event) => {
    const control = event.target;
    if (!control.matches('input, select, textarea')) return;
    if (control.type === 'range') updateRangeOutput(control);
    if (control.type === 'file') updateImagePreview(control);
    if (form.dataset.submitted === 'true') ValidationRules.clearFieldError(control);
    updateDerivedFields(form);
  });
  form.addEventListener('change', (event) => {
    const control = event.target;
    if (!control.matches('input, select, textarea')) return;
    if (form.dataset.submitted === 'true') ValidationRules.clearFieldError(control);
    updateDerivedFields(form);
  });
  form.addEventListener('blur', (event) => {
    const control = event.target;
    if (!control.matches('input, select, textarea')) return;
    ValidationRules.validateControl(control);
  }, true);
}

function initializeForms() {
  document.querySelectorAll('.system-form').forEach((form) => {
    form.dataset.submitted = 'false';
    attachFieldInteractions(form);
    resetForm(form);
    submitForm(form);
    form.querySelectorAll('.form-range').forEach(updateRangeOutput);
    updateDerivedFields(form);
  });
}

function initializeUtilities() {
  document.getElementById('btn-fill-demo').addEventListener('click', () => {
    const activeForm = document.querySelector('.tab-panel:not([hidden]) .system-form');
    if (activeForm) fillDemo(activeForm);
  });
  document.getElementById('btn-trigger-errors').addEventListener('click', () => {
    const activeForm = document.querySelector('.tab-panel:not([hidden]) .system-form');
    if (activeForm) triggerErrors(activeForm);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  initializeForms();
  initializeUtilities();
  setFeedbackDateLimit();

  try {
    DataHandler.initialize();
  } catch (error) {
    showStatus(`Unable to load saved records from browser storage: ${error.message}`, 'error');
  }
});
