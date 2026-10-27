# Alfonso Brew — Form Controls Implementation Plan

## Project Overview
* **System:** Alfonso Brew POS & Cafe Management System
* **Repository:** [github.com/antitatoie/form-controls-alfonso-brew](https://github.com/antitatoie/form-controls-alfonso-brew)
* **Goal:** Implement 2 Major Forms and 2 Supporting Forms with comprehensive form controls (8-10+ each), validation, UX/accessibility, and interactive data handling to fulfill all Canvas activity requirements.

---

## 1. Form Specifications (8–10+ Controls Each)

### Major Form 1: Add / Edit Product & Recipe Management (Admin/Inventory)
* **Purpose:** Allows administrators and store managers to catalog new coffee beans, beverages, and pastries, configure pricing, recipes, and POS availability.
* **Controls (11 controls):**
  1. `product_name` (Text) — Product name (min 3 chars, max 60 chars)
  2. `product_sku` (Text) — SKU format regex: `^PRD-[A-Z]{3}-\d{3}$` (e.g., `PRD-ESP-001`)
  3. `category` (Dropdown / Select) — Espresso, Brewed Coffee, Cold Brew, Pastry, Seasonal
  4. `price` (Number) — Base selling price in PHP (₱20 to ₱1000)
  5. `cost` (Number) — Raw cost in PHP (must be less than price)
  6. `prep_time` (Slider / Range) — Preparation time in minutes (1–20 min) with live badge
  7. `temperature` (Radio Group) — Serving type: *Hot Only*, *Iced Only*, or *Both Available*
  8. `addons` (Checkbox Group) — Extra Shot, Oat Milk, Caramel Drizzle, Vanilla Syrup
  9. `image` (File Upload) — Product image preview (`.png, .jpg, .webp`, max 2MB)
  10. `description` (Textarea) — Flavor notes, allergens (max 250 characters with live counter)
  11. `is_available` (Toggle / Switch) — Display item on POS cashier menu
  * *Actions:* "Save Product" (Submit) & "Clear Form" (Reset) + Hidden field for `product_id`

---

### Major Form 2: Customer Order & Checkout Processing (POS / Counter Cashier)
* **Purpose:** Used by cashiers or customers to process orders, apply discounts, select payment options, and generate digital invoices.
* **Controls (11 controls):**
  1. `customer_name` (Text) — Customer full name
  2. `customer_email` (Email) — Email for digital receipt (valid email regex)
  3. `customer_phone` (Tel) — Philippine mobile format (`09XX-XXX-XXXX`)
  4. `order_type` (Dropdown / Select) — Dine-In, Takeout, Curbside Pickup
  5. `pickup_time` (Time) — Target preparation / pickup time
  6. `discount_type` (Dropdown / Select) — None, Senior Citizen (20%), PWD (20%), Alfonso Club (10%), Barista Promo
  7. `id_number` (Text) — Senior/PWD/Member ID (conditionally required when discount selected)
  8. `payment_method` (Radio Group) — Cash, GCash, Maya, Card
  9. `amount_tendered` (Number) — Amount paid by customer (must meet or exceed total)
  10. `special_instructions` (Textarea) — Dietary notes or customization requests
  11. `loyalty_optin` (Checkbox) — "Enroll customer in Alfonso Brew Perks Program"
  * *Actions:* "Complete Checkout" (Submit) & "Clear Order" (Reset) + Hidden field for `order_id` & `timestamp`

---

### Supporting Form 1: Customer Quality Feedback & Tasting Review
* **Purpose:** Collects customer experience ratings on beverages, staff courtesy, and cafe ambiance for continuous quality improvement.
* **Controls (9 controls):**
  1. `reviewer_name` (Text) — Customer name
  2. `reviewer_email` (Email) — Customer email
  3. `branch_visited` (Dropdown / Select) — Alfonso Brew Flagship, Branch 2 (Tagaytay), Mobile Kiosk
  4. `visit_date` (Date) — Date of visit (max: today)
  5. `overall_rating` (Radio Group) — 5-star rating (1 to 5)
  6. `ordered_categories` (Checkbox Group) — Espresso, Pourover, Pastry, Cold Brew
  7. `ambiance_score` (Slider / Range) — Cafe Atmosphere & Cleanliness rating (1 to 10)
  8. `review_comment` (Textarea) — Detailed feedback / suggestions
  9. `contact_consent` (Toggle / Switch) — "Allow manager to follow up with me"
  * *Actions:* "Submit Feedback" & "Clear"

---

### Supporting Form 2: Inventory & Transaction Audit Filter
* **Purpose:** Allows staff and auditors to filter products, inventory stock levels, and transaction records with multi-criteria search.
* **Controls (9 controls):**
  1. `search_keyword` (Text / Search) — Search by SKU, Item Name, or Invoice #
  2. `filter_category` (Dropdown / Select) — All Categories, Beverages, Bakery, Raw Beans, Syrups
  3. `date_from` (Date) — Starting date
  4. `date_to` (Date) — Ending date
  5. `price_min` (Number) — Minimum price limit
  6. `price_max` (Number) — Maximum price limit
  7. `stock_status` (Radio Group) — *All*, *In Stock*, *Low Stock (< 10)*, *Out of Stock*
  8. `include_archived` (Checkbox) — "Include archived / seasonal items"
  9. `sort_by` (Dropdown / Select) — Sort by: Newest First, Price (Low to High), Price (High to Low), Name (A-Z)
  * *Actions:* "Apply Filters" & "Reset Filters"

---

## 2. Directory Structure

```
form-controls-alfonso-brew/
│
├── index.html                   # Multi-form interactive portal with tabs
├── css/
│   ├── style.css                # Alfonso Brew coffee theme (espresso, cream, amber)
│   └── forms.css                # Form layout, inputs, states, error badges, accessibility
├── js/
│   ├── app.js                   # Tab navigation and UI state
│   ├── validation.js            # Custom validation engine & accessible error handling
│   └── data-handler.js          # Live data processing (localStorage + dynamic ledger display)
├── assets/
│   └── logo.svg                 # Alfonso Brew branding icon
├── docs/
│   ├── FORM_DOCUMENTATION.md    # Ready-to-export Canvas submission document
│   └── screenshots/             # Folder for final submission screenshots
├── PLAN.md                      # This plan
└── README.md                    # Project README
```

---

## 3. Step-by-Step Milestones

1. **Step 1: Planning & Form Selection** *(Done — confirmed complete)*
2. **Step 2: Semantic HTML Form Architecture**
3. **Step 3: Responsive CSS & Alfonso Brew Coffee Theme** *(Done)*
4. **Step 4: JavaScript Validation Engine & Live Data Handling**
5. **Step 5: Accessibility Verification & Screenshot Capture**
6. **Step 6: PDF Documentation & Git Commit**

### Step 1 Completion Check
Step 1 is complete for its stated scope: the plan selects two major forms and two supporting forms, describes the purpose of each, lists the controls and actions, and records key field constraints and conditional behavior. This confirms that planning and form selection are done; it does **not** mean the forms or their behavior have been implemented. Those are addressed by Steps 2–5.

### Step 3: Responsive CSS & Alfonso Brew Coffee Theme — Implementation Breakdown

**Goal:** Apply a consistent Alfonso Brew visual theme and responsive layout to the portal and all four forms specified above.

**Prerequisite:** Finish Step 2 first. Use the actual form structure, class names, and state hooks established there. If Step 2 has not supplied a needed hook, resolve that in Step 2 rather than adding form structure or behavior in this milestone.

**Scope**
* `css/style.css` — shared theme tokens, page shell, header, navigation, and overall layout.
* `css/forms.css` — form and field layout, control styling, action buttons, and visual feedback states.
* Keep changes within these stylesheets. Form markup, navigation behavior, validation, data handling, and accessibility verification belong to their respective milestones.

#### 3.1 Apply the shared theme
1. Review the existing CSS custom properties and reuse the established espresso, amber, cream, typography, border, radius, and shadow values.
2. Add or change a shared token only when needed for consistent styling; avoid introducing a competing palette or unnecessary one-off values.
3. Set the global page background, text, typography, and content width to match the brand and existing page structure.
4. Style the existing header and logo proportionally, preserving the logo's aspect ratio and the established brand hierarchy.

#### 3.2 Style the portal layout and navigation
1. Style the existing main content container and form-section navigation using the Step 2 markup and semantics.
2. Make navigation items visually distinct in their normal and selected states, and style their hover and keyboard-focus states.
3. Keep the navigation and displayed form visually connected. At narrow widths, allow navigation items to wrap or otherwise fit without causing page-level horizontal scrolling.

#### 3.3 Establish form and field styling
1. Apply a consistent card or section treatment to each of the four forms, using the existing brand tokens.
2. Define spacing and alignment for form headings, field groups, labels, hints, required indicators, feedback messages, and action buttons.
3. Keep fields in one column on narrow screens. Use multiple columns at wider sizes only where the form content remains easy to scan and related controls stay grouped.
4. Preserve semantic grouping and clear visual hierarchy for radio groups, checkbox groups, and other related controls.

#### 3.4 Style the controls specified in the form requirements
Provide a consistent treatment for every applicable control in the four planned forms:
* Text, email, telephone, search, number, date, and time inputs.
* Select menus and textareas.
* Radio buttons and checkbox groups.
* Range sliders and their value displays, where included in the markup.
* File upload controls and the image-preview area, where included in the markup.
* Toggle or switch controls, where included in the markup.
* Submit, reset, and other form action buttons.

Controls should fit the layout, inherit the project typography, and retain usable browser-native behavior. Do not add a control or visual component that is not supported by the form specifications or Step 2 markup.

#### 3.5 Style visual interaction and feedback states
1. Provide clear default, hover, focus-visible, active, and selected states for the elements that support them.
2. Style invalid fields and their associated error messages using the state hooks that Step 4 provides; style success feedback only if Step 4 defines and renders it.
3. Show disabled styling only for controls that the implementation actually disables.
4. Keep state styling presentational: do not add validation rules, state-changing behavior, or JavaScript in this milestone.

#### 3.6 Make the layout responsive
1. Build from the narrow layout outward and introduce breakpoints only where the content needs them.
2. Check the completed portal and all four forms at 320 px, 768 px, and 1280 px viewport widths.
3. At each width, check for page-level horizontal scrolling, clipped content, overlapping navigation, and controls or buttons that are too constrained to use.
4. Ensure the header, navigation, form cards, field layout, and actions wrap or resize cleanly. Stack form columns and action buttons on narrow screens where needed.

#### 3.7 Confirm Step 3 is complete
* The header, portal, navigation, and all four forms use a consistent Alfonso Brew theme.
* Every control type specified for the forms has a usable style, including applicable selected, focus, invalid, and disabled states.
* The layout works at the specified phone, tablet, and desktop widths without page-level horizontal scrolling or clipped content.
* CSS changes use the structure and state hooks from the other milestones and do not alter form structure, navigation behavior, validation, or data handling.
* Step 5 remains responsible for formal accessibility verification; Step 3 must preserve visible focus styling and must not remove browser affordances.
