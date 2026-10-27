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
* **Portal navigation:** Select forms with the tabs, or use the arrow keys, Home, and End while a tab is focused.
* **Form actions:** Each form can be submitted or reset. The header's sample-data and error-state buttons work on the currently selected form.
* **Validation:** Field feedback appears on blur and submit; cross-field checks cover pricing, checkout totals and discounts, feedback selections, and audit filter ranges.
* **POS interaction:** Selecting a menu item, quantity, or discount updates the subtotal and amount due. Product image selection displays a preview.
* **Data handling:** Products, completed orders, and feedback entries are saved in browser `localStorage` and shown in their ledgers. The audit form filters saved catalog products.
* **Local demo limitation:** Data and PIN-format checks run in the browser only; this project does not provide a server, shared database, or real auditor authentication.
