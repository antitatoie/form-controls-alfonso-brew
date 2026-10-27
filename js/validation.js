/**
 * Alfonso Brew — Form Validation Engine & Accessible Error Feedback
 */

const PATTERN_MESSAGES = {
  product_sku: 'SKU must follow the format PRD-XXX-000 (3 uppercase letters and 3 digits, e.g., PRD-ESP-001).',
  customer_phone: 'Enter a valid Philippine mobile number (e.g., 0917-123-4567 or +639171234567).',
  discount_id_number: 'Discount ID must be 4 to 18 alphanumeric characters or hyphens (e.g., OSCA-12345).',
  auditor_pin: 'Auditor PIN must be 4 to 8 letters or digits (e.g., 1234 or AUD2026).',
};

function getErrorElement(control) {
  const describedBy = control.getAttribute('aria-describedby') || '';
  for (const id of describedBy.split(/\s+/)) {
    const element = id ? document.getElementById(id) : null;
    if (element?.classList.contains('form-error')) return element;
  }
  const group = control.closest('[role="radiogroup"], [role="group"], .form-group');
  return group?.querySelector('.form-error') || null;
}

function getFieldLabel(control) {
  if (control.labels?.length) {
    return control.labels[0].textContent.replace(/\*/g, '').trim();
  }
  const group = control.closest('[role="radiogroup"], [role="group"], .form-group');
  const labelEl = group?.querySelector('.form-label');
  return labelEl ? labelEl.textContent.replace(/\*/g, '').trim() : 'This field';
}

function messageFor(control) {
  const validity = control.validity;
  const label = getFieldLabel(control);

  if (validity.valueMissing) {
    if (control.tagName === 'SELECT') return `Please select an option for ${label}.`;
    return `${label} is required.`;
  }
  if (validity.typeMismatch) {
    if (control.type === 'email') {
      return `Enter a valid email address for ${label} (e.g., name@example.com).`;
    }
    return `Enter a valid value for ${label}.`;
  }
  if (validity.patternMismatch) {
    if (PATTERN_MESSAGES[control.name]) return PATTERN_MESSAGES[control.name];
    return `Enter ${label} in the required format shown in the helper hint.`;
  }
  if (validity.tooShort) {
    return `${label} must be at least ${control.minLength} characters (currently ${control.value.length}).`;
  }
  if (validity.tooLong) {
    return `${label} must not exceed ${control.maxLength} characters.`;
  }
  if (validity.rangeUnderflow) {
    if (control.type === 'time') return `${label} must be at or after ${control.min} (store opening).`;
    if (control.type === 'date') return `${label} cannot be earlier than ${control.min}.`;
    return `${label} must be at least ${control.min}.`;
  }
  if (validity.rangeOverflow) {
    if (control.type === 'time') return `${label} must be at or before ${control.max} (store closing).`;
    if (control.type === 'date') return `${label} cannot be a future date (latest allowed: ${control.max}).`;
    return `${label} must be no more than ${control.max}.`;
  }
  if (validity.stepMismatch) {
    return `Enter a valid increment for ${label} (step of ${control.step}).`;
  }
  if (validity.badInput) {
    return `Enter a valid numeric value for ${label}.`;
  }
  if (validity.customError) {
    return control.validationMessage;
  }
  return `${label} is invalid.`;
}

function setError(control, message, target = control) {
  target.setAttribute('aria-invalid', 'true');
  if (target.classList?.contains('form-control')) {
    target.classList.add('is-invalid');
    target.classList.remove('is-valid');
  }
  if (control.classList?.contains('form-control')) {
    control.classList.add('is-invalid');
    control.classList.remove('is-valid');
    control.setAttribute('aria-invalid', 'true');
  }

  const error = getErrorElement(target) || getErrorElement(control);
  if (error) {
    error.textContent = message;
    error.classList.add('visible');
  }
}

function setValid(control) {
  if (!control.classList?.contains('form-control')) return;
  if (control.type === 'hidden' || control.type === 'file') return;
  if (control.value.trim() !== '') {
    control.classList.remove('is-invalid');
    control.classList.add('is-valid');
    control.removeAttribute('aria-invalid');
  }
}

function clearControl(control) {
  control.removeAttribute('aria-invalid');
  control.classList?.remove('is-invalid', 'is-valid');
  const error = getErrorElement(control);
  if (error) {
    error.textContent = '';
    error.classList.remove('visible');
  }
  control.closest('[role="radiogroup"], [role="group"]')?.removeAttribute('aria-invalid');
}

function clearErrors(form) {
  form.querySelectorAll('input, select, textarea, [role="radiogroup"], [role="group"]')
    .forEach((control) => {
      control.setCustomValidity?.('');
      clearControl(control);
    });
  form.querySelectorAll('.form-error').forEach((error) => {
    error.textContent = '';
    error.classList.remove('visible');
  });
}

function collectControls(form) {
  const seenRadioGroups = new Set();
  return [...form.elements].filter((control) => {
    if (!control.matches?.('input, select, textarea')) return false;
    if (control.type === 'hidden' || control.disabled) return false;
    if (control.type !== 'radio') return true;
    if (seenRadioGroups.has(control.name)) return false;
    seenRadioGroups.add(control.name);
    return true;
  });
}

function namedControl(form, name) {
  return [...form.elements].find((control) => control.name === name);
}

function computeCheckoutNet(form) {
  const item = form.querySelector('#chk-item');
  const quantity = Number(form.elements.order_qty?.value) || 0;
  const gross = Number(item?.selectedOptions[0]?.dataset.price || 0) * quantity;
  const rate = Number(form.elements.discount_type?.selectedOptions[0]?.dataset.rate || 0);
  const discount = gross * rate;
  return Math.max(0, gross - discount);
}

function evaluateCrossFieldRules(form) {
  const crossErrors = [];
  const addError = (name, message, target) => {
    const control = namedControl(form, name);
    if (control) crossErrors.push({ control, target: target || control, message });
  };

  if (form.id === 'product-form') {
    const priceRaw = form.elements.price?.value;
    const costRaw = form.elements.unit_cost?.value;
    if (priceRaw !== '' && costRaw !== '') {
      const price = Number(priceRaw);
      const cost = Number(costRaw);
      if (!Number.isNaN(price) && !Number.isNaN(cost) && cost >= price) {
        addError('unit_cost', 'Recipe unit cost must be strictly lower than the selling price.');
      }
    }

    const image = form.elements.product_image?.files?.[0];
    if (image) {
      if (image.size > 2 * 1024 * 1024) {
        addError('product_image', 'Product image must be 2 MB or smaller.');
      } else if (!/\.(jpe?g|png|webp)$/i.test(image.name)) {
        addError('product_image', 'Unsupported file format. Choose a .jpg, .png, or .webp image.');
      }
    }
  }

  if (form.id === 'checkout-form') {
    const discount = form.elements.discount_type?.value;
    const discountId = form.elements.discount_id_number;
    if (discount && discount !== 'None' && !discountId?.value.trim()) {
      addError('discount_id_number', `Privilege ID number is required when "${discount}" is selected.`);
    }

    const tenderedRaw = form.elements.amount_tendered?.value;
    const netDue = computeCheckoutNet(form);
    if (tenderedRaw !== '' && netDue > 0 && Number(tenderedRaw) < netDue) {
      addError(
        'amount_tendered',
        `Amount tendered (PHP ${Number(tenderedRaw).toFixed(2)}) cannot be less than Net Amount Due (PHP ${netDue.toFixed(2)}).`
      );
    }
  }

  if (form.id === 'feedback-form') {
    const items = [...form.querySelectorAll('input[name="items_tried"]:checked')];
    if (!items.length) {
      const control = namedControl(form, 'items_tried');
      const group = form.querySelector('[aria-labelledby="fb-items-label"]');
      if (control && group) {
        crossErrors.push({
          control,
          target: group,
          message: 'Select at least one product category sampled during your visit.',
        });
      }
    }
  }

  if (form.id === 'filter-form') {
    const from = form.elements.date_from?.value;
    const to = form.elements.date_to?.value;
    if (from && to && from > to) {
      addError('date_to', 'Audit End Date must be on or after the Start Date.');
    }

    const minimum = form.elements.price_min?.value;
    const maximum = form.elements.price_max?.value;
    if (minimum !== '' && maximum !== '' && Number(minimum) > Number(maximum)) {
      addError('price_max', 'Maximum selling price must be greater than or equal to Minimum selling price.');
    }
  }

  return crossErrors;
}

function validateNativeControls(form, errors) {
  for (const control of collectControls(form)) {
    if (control.type === 'radio') {
      const group = [...form.elements].filter((item) => item.type === 'radio' && item.name === control.name);
      if (group.some((item) => item.required) && !group.some((item) => item.checked)) {
        const target = control.closest('[role="radiogroup"]') || control;
        errors.push({
          control,
          target,
          message: `Please select an option for ${getFieldLabel(control)}.`,
        });
      }
      continue;
    }

    if (!control.checkValidity()) {
      errors.push({ control, target: control, message: messageFor(control) });
    }
  }
}

function validateForm(form) {
  clearErrors(form);
  const errors = [];
  validateNativeControls(form, errors);
  const crossErrors = evaluateCrossFieldRules(form);

  const errorControls = new Set(errors.map((e) => e.control));
  for (const crossErr of crossErrors) {
    if (!errorControls.has(crossErr.control)) {
      errors.push(crossErr);
      errorControls.add(crossErr.control);
    }
  }

  for (const control of collectControls(form)) {
    if (!errorControls.has(control) && control.type !== 'radio' && control.type !== 'checkbox') {
      setValid(control);
    }
  }

  errors.forEach(({ control, target, message }) => setError(control, message, target));
  if (errors.length) {
    const firstInvalid = errors[0].control;
    firstInvalid.focus();
    return false;
  }
  return true;
}

function validateControl(control) {
  const form = control.form;
  if (!form || control.disabled || control.type === 'hidden') return true;
  clearFieldError(control);

  if (control.type === 'radio') {
    const group = [...form.elements].filter((item) => item.type === 'radio' && item.name === control.name);
    if (!group.some((item) => item.required) || group.some((item) => item.checked)) return true;
    const target = control.closest('[role="radiogroup"]') || control;
    setError(control, `Please select an option for ${getFieldLabel(control)}.`, target);
    return false;
  }

  if (control.type === 'checkbox' && control.name === 'items_tried') {
    const checked = form.querySelectorAll('input[name="items_tried"]:checked');
    const group = form.querySelector('[aria-labelledby="fb-items-label"]');
    if (!checked.length && group) {
      setError(control, 'Select at least one product category sampled during your visit.', group);
      return false;
    }
    return true;
  }

  if (!control.checkValidity()) {
    setError(control, messageFor(control));
    return false;
  }

  const crossErrors = evaluateCrossFieldRules(form);
  const matchingCrossError = crossErrors.find((item) => item.control === control);
  if (matchingCrossError) {
    setError(control, matchingCrossError.message, matchingCrossError.target);
    return false;
  }

  setValid(control);
  return true;
}

function clearFieldError(control) {
  control.setCustomValidity?.('');
  clearControl(control);
  const group = control.closest('[role="radiogroup"], [role="group"]');
  if (group) {
    group.removeAttribute('aria-invalid');
    group.querySelectorAll('input').forEach((item) => {
      item.removeAttribute('aria-invalid');
      item.classList?.remove('is-invalid');
      const error = getErrorElement(item);
      if (error) {
        error.textContent = '';
        error.classList.remove('visible');
      }
    });
    const groupError = group.querySelector('.form-error') || group.parentElement?.querySelector('.form-error');
    if (groupError) {
      groupError.textContent = '';
      groupError.classList.remove('visible');
    }
  }
}

export const ValidationRules = {
  validateForm,
  validateControl,
  clearErrors,
  clearFieldError,
};
