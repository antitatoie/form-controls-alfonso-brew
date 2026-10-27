/**
 * Alfonso Brew — Form Validation & Accessible Error Feedback
 */

function getErrorElement(control) {
  const describedBy = control.getAttribute('aria-describedby') || '';
  for (const id of describedBy.split(/\s+/)) {
    const element = id ? document.getElementById(id) : null;
    if (element?.classList.contains('form-error')) return element;
  }
  return null;
}

function getFieldLabel(control) {
  if (control.labels?.length) return control.labels[0].textContent.trim();
  const group = control.closest('[role="radiogroup"], [role="group"]');
  return group?.querySelector('.form-label')?.textContent.trim() || 'This field';
}

function messageFor(control) {
  const validity = control.validity;
  const label = getFieldLabel(control).replace(/\*/g, '').trim();
  if (validity.valueMissing) return `${label} is required.`;
  if (validity.typeMismatch) return `Enter a valid ${control.type === 'email' ? 'email address' : 'value'} for ${label}.`;
  if (validity.patternMismatch) return `Enter ${label} in the format shown in the hint.`;
  if (validity.tooShort) return `${label} must contain at least ${control.minLength} characters.`;
  if (validity.tooLong) return `${label} must contain no more than ${control.maxLength} characters.`;
  if (validity.rangeUnderflow) return `${label} must be at least ${control.min}.`;
  if (validity.rangeOverflow) return `${label} must be no more than ${control.max}.`;
  if (validity.stepMismatch) return `Enter an allowed value for ${label}.`;
  if (validity.badInput) return `Enter a valid value for ${label}.`;
  if (validity.customError) return control.validationMessage;
  return `${label} is invalid.`;
}

function setError(control, message, target = control) {
  target.setAttribute('aria-invalid', 'true');
  const error = getErrorElement(target) || getErrorElement(control);
  if (error) {
    error.textContent = message;
    error.classList.add('visible');
  }
}

function clearControl(control) {
  control.removeAttribute('aria-invalid');
  const error = getErrorElement(control);
  if (error) {
    error.textContent = '';
    error.classList.remove('visible');
  }
  control.closest('[role="radiogroup"], [role="group"]')?.removeAttribute('aria-invalid');
}

function clearErrors(form) {
  form.querySelectorAll('input, select, textarea, [role="radiogroup"], [role="group"]')
    .forEach((control) => clearControl(control));
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

function validateNativeControls(form, errors) {
  for (const control of collectControls(form)) {
    if (control.type === 'radio') {
      const group = [...form.elements].filter((item) => item.type === 'radio' && item.name === control.name);
      if (group.some((item) => item.required) && !group.some((item) => item.checked)) {
        const target = control.closest('[role="radiogroup"]') || control;
        errors.push({ control, target, message: `${getFieldLabel(control)} requires a selection.` });
      }
      continue;
    }

    if (!control.checkValidity()) {
      errors.push({ control, target: control, message: messageFor(control) });
    }
  }
}

function validateCrossFieldRules(form, errors) {
  const addError = (name, message, target) => {
    const control = namedControl(form, name);
    if (control) errors.push({ control, target: target || control, message });
  };

  if (form.id === 'product-form') {
    const price = Number(form.elements.price.value);
    const cost = Number(form.elements.unit_cost.value);
    if (form.elements.price.value && form.elements.unit_cost.value && cost >= price) {
      addError('unit_cost', 'Recipe unit cost must be lower than the selling price.');
    }

    const image = form.elements.product_image.files[0];
    if (image && image.size > 2 * 1024 * 1024) {
      addError('product_image', 'Product image must be 2 MB or smaller.');
    } else if (image && !/\.(jpe?g|png|webp)$/i.test(image.name)) {
      addError('product_image', 'Choose a JPG, PNG, or WebP image.');
    }
  }

  if (form.id === 'checkout-form') {
    const discount = form.elements.discount_type.value;
    const discountId = form.elements.discount_id_number;
    if (discount !== 'None' && !discountId.value.trim()) {
      addError('discount_id_number', 'Enter the required ID for the selected discount.');
    }

  }

  if (form.id === 'feedback-form') {
    const items = [...form.querySelectorAll('input[name="items_tried"]:checked')];
    if (!items.length) {
      const control = namedControl(form, 'items_tried');
      const group = form.querySelector('[aria-labelledby="fb-items-label"]');
      if (control && group) {
        errors.push({ control, target: group, message: 'Select at least one product category.' });
      }
    }
  }

  if (form.id === 'filter-form') {
    const from = form.elements.date_from.value;
    const to = form.elements.date_to.value;
    if (from && to && from > to) {
      addError('date_to', 'End date must be on or after the start date.');
    }

    const minimum = form.elements.price_min.value;
    const maximum = form.elements.price_max.value;
    if (minimum !== '' && maximum !== '' && Number(minimum) > Number(maximum)) {
      addError('price_max', 'Maximum price must be greater than or equal to minimum price.');
    }
  }
}

function validateForm(form) {
  clearErrors(form);
  const errors = [];
  validateNativeControls(form, errors);
  validateCrossFieldRules(form, errors);

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
    setError(control, `${getFieldLabel(control)} requires a selection.`, target);
    return false;
  }

  if (!control.checkValidity()) {
    setError(control, messageFor(control));
    return false;
  }
  return true;
}

function clearFieldError(control) {
  clearControl(control);
  const group = control.closest('[role="radiogroup"], [role="group"]');
  if (group) {
    group.querySelectorAll('input').forEach((item) => {
      item.removeAttribute('aria-invalid');
      const error = getErrorElement(item);
      if (error) {
        error.textContent = '';
        error.classList.remove('visible');
      }
    });
  }
}

export const ValidationRules = {
  validateForm,
  validateControl,
  clearErrors,
  clearFieldError,
};
