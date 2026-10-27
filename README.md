# Alfonso Brew — UI Form Controls Activity

[![GitHub](https://img.shields.io/badge/Repository-form--controls--alfonso--brew-2C1810?style=flat&logo=github)](https://github.com/antitatoie/form-controls-alfonso-brew)
[![Project](https://img.shields.io/badge/Project-Alfonso%20Brew%20POS-C4823F?style=flat)](https://github.com/antitatoie/form-controls-alfonso-brew)

This project contains the implementation of user interface form controls for the **Alfonso Brew POS & Cafe Management System**, developed as part of the Software Engineering Form Controls Group Activity.

---

## Implemented Forms

### Major Forms (Required)
1. **Product & Recipe Catalog Management** *(Admin / Inventory)*
   * 11 form controls including Textbox, SKU pattern validation, Category dropdown, Numeric pricing/cost, Preparation time slider, Temperature radio group, Add-on checkboxes, File upload preview, Description textarea, and POS availability toggle.
2. **Customer Order & Checkout Processing** *(POS Cashier)*
   * 11 form controls including Customer name, Email, Phone number, Order type, Pickup time, Discount selection, ID number verification, Payment method radios, Tendered amount validation, Special instructions textarea, and Perks program checkbox.

### Supporting Forms
1. **Customer Tasting & Experience Feedback**
   * 9 form controls for branch rating, star selection, beverage checkboxes, atmosphere slider, review comments, and follow-up toggle.
2. **Inventory & Transaction Audit Filter**
   * 9 form controls for multi-criteria search, date ranges, price filters, stock status radios, and sorting options.

---

## Directory Structure

```
form-controls-alfonso-brew/
│
├── index.html                   # Multi-form interactive portal
├── css/
│   ├── style.css                # Alfonso Brew coffee branding theme
│   └── forms.css                # Form styling, states, validation & accessibility
├── js/
│   ├── app.js                   # Application controller and tab navigation
│   ├── validation.js            # Custom validation engine & accessible feedback
│   └── data-handler.js          # Client-side data storage and dynamic ledger
├── assets/
│   └── logo.svg                 # Alfonso Brew vector logo
├── docs/
│   ├── FORM_DOCUMENTATION.md    # Complete documentation for Canvas PDF export
│   └── screenshots/             # Screenshots of valid and error states
├── PLAN.md                      # Implementation roadmap and specifications
└── README.md                    # Project README
```

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/antitatoie/form-controls-alfonso-brew.git
   cd form-controls-alfonso-brew
   ```
2. Open `index.html` in any modern web browser or use VS Code Live Server.

---

## Features and Compliance
* **Accessibility (WCAG):** Semantic `<label>` association, keyboard navigation, focus indicators, and `aria-describedby` error states.
* **Validation:** Immediate feedback on blur, format regex enforcement, and submit prevention on invalid inputs.
* **Data Handling:** Dynamic reflection in UI and persistent storage via `localStorage`.
