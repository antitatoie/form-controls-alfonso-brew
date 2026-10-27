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

1. **Step 1: Planning & Form Selection** *(Done)*
2. **Step 2: Semantic HTML Form Architecture**
3. **Step 3: Responsive CSS & Alfonso Brew Coffee Theme**
4. **Step 4: JavaScript Validation Engine & Live Data Handling**
5. **Step 5: Accessibility Verification & Screenshot Capture**
6. **Step 6: PDF Documentation & Git Commit**
