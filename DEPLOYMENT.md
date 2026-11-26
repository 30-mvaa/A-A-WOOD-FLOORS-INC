# A&A Wood Flooring, Inc. — Production Deployment & SEO Guide

This document provides step-by-step instructions for deploying the website to free static hosting, configuring Google Search Console, setting up Google Business Profile for local map rankings, and activating lead notifications.

---

## 1. Free Static Hosting Setup

The website is a high-performance static project (HTML5, CSS3, Vanilla JavaScript, optimized assets) with zero server dependencies or build steps required.

### Recommended Platform: Cloudflare Pages (100% Free)
**Website:** [https://pages.cloudflare.com/](https://pages.cloudflare.com/)

**Advantages:**
* Unlimited bandwidth on free tier.
* Worldwide global CDN with sub-50ms latency.
* Automatic free SSL/TLS certificate.
* Built-in DDoS protection.
* Native support for `_headers` and `_redirects`.

**Deployment Steps:**
1. Create a free account at [Cloudflare](https://dash.cloudflare.com/sign-up).
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** (GitHub/GitLab) or **Upload assets**.
3. If connecting via Git:
   * **Project Name:** `aawoodfloors`
   * **Production branch:** `main`
   * **Framework preset:** `None`
   * **Build command:** *(leave empty)*
   * **Build output directory:** `/` or `.`
4. Click **Save and Deploy**. Your site will be live immediately at `https://aawoodfloors.pages.dev`.
5. Under **Custom domains**, click **Set up a custom domain** and enter `aawoodfloorsinc.com`. Follow the DNS instructions to point your domain.

### Alternative Platform: Netlify
**Website:** [https://www.netlify.com/](https://www.netlify.com/)
* The project includes a configured `netlify.toml` file in the root directory.
* Connect the repository or drag-and-drop the `/aa-wood-floors` folder into the Netlify dashboard.
* Assign your custom domain `aawoodfloorsinc.com` under **Domain management**.

---

## 2. Google Search Console Setup & Sitemap Submission

**Official Portal:** [https://search.google.com/search-console/](https://search.google.com/search-console/)

### Step 1: Add Property
1. Log in with your business Google account (`aawoodflooring22@gmail.com`).
2. Choose **Domain** property and enter `aawoodfloorsinc.com`.
3. Copy the `google-site-verification` TXT record provided by Google and paste it into your domain's DNS manager (e.g., Cloudflare DNS, GoDaddy, or Namecheap).
4. Click **Verify**.

### Step 2: Submit the XML Sitemap
1. In the Search Console sidebar, navigate to **Sitemaps**.
2. Under "Add a new sitemap", enter:
   `https://aawoodfloorsinc.com/sitemap.xml`
3. Click **Submit**. Google will process the sitemap and report the status as **Success**.

### Step 3: URL Inspection & Indexing Request
1. In the top search bar of Search Console, enter: `https://aawoodfloorsinc.com/`
2. Click **Test Live URL** to confirm that Googlebot can access the page without errors.
3. Click **Request Indexing**.
4. Repeat this process for the key location pages:
   * `https://aawoodfloorsinc.com/locations/new-york/`
   * `https://aawoodfloorsinc.com/locations/new-jersey/`
   * `https://aawoodfloorsinc.com/locations/connecticut/`
   * `https://aawoodfloorsinc.com/es/`

---

## 3. Google Business Profile (Local SEO & Google Maps)

**Official Portal:** [https://www.google.com/business/](https://www.google.com/business/)

To appear in the Google Maps Local 3-Pack when customers search for *"hardwood flooring contractor near me"*, follow these exact configuration steps:

### Business Information Consistency (NAP)
* **Business Name:** `A&A Wood Flooring, Inc.`
* **Primary Category:** `Flooring contractor`
* **Secondary Categories:** `Wood floor refinishing service`, `Floor sanding and polishing service`.
* **Phone Number:** `(917) 930-4105` (Secondary: `(917) 861-1492`)
* **Website:** `https://aawoodfloorsinc.com`
* **Opening Hours:** Monday – Saturday: 7:00 AM – 6:00 PM

### Service Area Configuration (Crucial)
Because A&A Wood Flooring visits customer properties rather than having customers shop at a retail storefront:
1. Select **"Yes, I deliver goods and services to my customers"**.
2. Select **"Hide my address"** (do not display a home address publicly).
3. Set the verified service areas:
   * **New York:** Manhattan, Brooklyn, Queens, Bronx, Staten Island, Westchester County, Long Island.
   * **New Jersey:** Jersey City, Hoboken, Newark, Bergen County, Essex County, Hudson County.
   * **Connecticut:** Meriden, Greenwich, Stamford, Westport, Darien, New Haven, Hartford.

### Pre-Written Business Description for Profile
> "A&A Wood Flooring, Inc. is a licensed and fully insured flooring contractor with over a decade of artisan craftsmanship serving New York, New Jersey, and Connecticut. We specialize in solid and engineered hardwood flooring installation, custom French herringbone and chevron patterns, 99.97% HEPA dustless sanding and refinishing, water-damage board repairs, and 100% waterproof luxury vinyl plank (LVP). We provide complimentary on-site estimates with physical wood samples, moisture diagnostics, and transparent pricing. Call (917) 930-4105 to schedule your free consultation."

---

## 4. Lead Capture Activation (FormSubmit & WhatsApp)

### FormSubmit One-Time Activation
The contact form uses FormSubmit AJAX (`https://formsubmit.co/ajax/aawoodflooring22@gmail.com`):
1. When the first test form is submitted on the live site, FormSubmit sends an activation email to `aawoodflooring22@gmail.com`.
2. Open that email and click the **Activate Form** button.
3. Once activated, every lead submitted through the website will arrive directly in your inbox with:
   * Customer Name, Phone Number, Email
   * Property Type (Residential, Condo, Commercial, Brownstone)
   * Project Location (City / ZIP)
   * Approximate Square Footage
   * Selected Service & Project Notes
4. The form includes built-in honeypot spam protection (`hp_field`) and a graceful fallback to direct phone, WhatsApp, or email if a network interruption occurs.

### Direct WhatsApp Lead Generation
The website includes integrated WhatsApp messaging pointing to `https://wa.me/19179304105`:
* When a visitor clicks **"Send via WhatsApp"**, it automatically formats all fields they entered into a clean message ready to send with one tap.

---

## 5. Google Analytics 4 (GA4) Tracking Setup

1. Create a GA4 property at [https://analytics.google.com/](https://analytics.google.com/).
2. Obtain your **Measurement ID** (format: `G-XXXXXXXXXX`).
3. Open `index.html` (and subpages if using separate trackers) and replace `G-XXXXXXXXXX` with your actual ID on lines 135 and 140:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_REAL_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-YOUR_REAL_ID');
   </script>
   ```
4. Custom events are already configured in `script.js` to track:
   * `click_phone` (When a user taps any phone number)
   * `click_whatsapp` (When a user taps WhatsApp)
   * `generate_lead` (When a contact form is submitted)
   * `use_estimator` (When a user interacts with the cost calculator)
   * `filter_projects` (When a user explores different project categories)
