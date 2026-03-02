# Embedding the Growth Readiness Agent on BlueConic.com (Webflow)

## Live App URL

```
https://rehansajid80.github.io/blueconiccustomerreadiness/
```

---

## What This Does

This embeds the BlueConic Customer Growth Readiness Assessment as an interactive tool on any Webflow page. Visitors complete a short quiz and receive personalized Growth Play recommendations. Every completed assessment automatically creates an MQL (Lead) in Salesforce with a task assigned to the relevant Account Executive.

---

## Step-by-Step Instructions for the Webflow Team

### Step 1: Create a New Page in Webflow

1. In your Webflow project, create a new page (e.g., `/growth-readiness` or `/assessment`)
2. Set the page title to something like: **"Growth Readiness Assessment | BlueConic"**
3. Set the meta description to: **"Assess your readiness across data, activation, AI, and impact. Get personalized recommendations to accelerate customer growth."**

### Step 2: Add a Section for the Assessment

1. Add a new **Section** element to the page
2. Set the section to **full-width** (no max-width constraint)
3. Remove any default padding on the section (set padding to `0` on all sides)
4. Optionally add a heading above the embed like: **"How Growth-Ready Is Your Organization?"**

### Step 3: Add the Embed Code

1. Inside the section, add an **Embed** element (drag "Embed" from the Components panel, or use Add Elements > Components > Embed)
2. Paste the following code into the embed:

```html
<div id="bc-growth-readiness-wrapper" style="width:100%; max-width:1200px; margin:0 auto; padding:20px 0;">
  <iframe
    id="bc-growth-readiness"
    src="https://rehansajid80.github.io/blueconiccustomerreadiness/"
    width="100%"
    height="900"
    frameborder="0"
    scrolling="auto"
    style="border:none; border-radius:12px; min-height:900px;"
    allow="clipboard-write"
    loading="lazy"
    title="BlueConic Growth Readiness Assessment"
  ></iframe>
</div>

<!-- Auto-resize iframe to fit content -->
<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'bc-readiness-resize') {
      var iframe = document.getElementById('bc-growth-readiness');
      if (iframe && event.data.height) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>
```

### Step 4: Style the Section (Optional)

For a clean look that matches BlueConic branding:

- **Background color:** `#ffffff` (white) or `#f8fafc` (light gray)
- **Top/bottom padding on the section:** `60px` to `80px`
- **Max-width of wrapper:** Already set to `1200px` in the embed code

### Step 5: Publish

1. Save and publish the Webflow page
2. Test the page on desktop and mobile
3. Complete a test assessment to verify it works end-to-end

---

## Responsive Behavior

The iframe is set to `width: 100%` so it will adapt to any screen size. The app inside is fully responsive and works on mobile, tablet, and desktop.

If you need to adjust the height for different pages:
- **Assessment quiz pages:** `900px` is usually sufficient
- **Results page:** May need `1200px` or more — the auto-resize script handles this

---

## Custom Domain Option (Recommended for Production)

Instead of using the GitHub Pages URL directly, you can set up a custom subdomain:

1. Create a CNAME record: `growth.blueconic.com` → `rehansajid80.github.io`
2. In the GitHub repo Settings > Pages, add `growth.blueconic.com` as a custom domain
3. Update the iframe `src` to: `https://growth.blueconic.com/blueconiccustomerreadiness/`

This gives a cleaner, branded URL.

---

## UTM Tracking

The app automatically captures UTM parameters from the parent page URL. To track traffic sources, link to the Webflow page with UTM params:

```
https://www.blueconic.com/growth-readiness?utm_source=linkedin&utm_medium=paid&utm_campaign=q1_growth
```

These are stored with each assessment in the database and passed to Salesforce.

---

## Salesforce Integration (Already Built In)

Every completed assessment automatically:

1. **Looks up** the email in Salesforce (checks Contacts first, then Leads)
2. **Creates a new Lead** if not found:
   - LeadSource: "Growth Readiness Assessment"
   - Company name, email, industry
   - Full assessment summary in Description field
3. **Creates a Task** for the Account Executive:
   - Subject: "Growth Readiness Assessment: [Company] ([Maturity Band])"
   - Priority: High if readiness score >= 40
   - Due date: next business day

### Salesforce Secrets Required

These must be set in the Supabase Dashboard under Edge Function Secrets (https://supabase.com/dashboard/project/uatrwjclxtoxlulvaltl/settings/functions):

| Secret Name               | Description                                         |
|---------------------------|-----------------------------------------------------|
| `SALESFORCE_CLIENT_ID`    | Connected App OAuth client ID                       |
| `SALESFORCE_CLIENT_SECRET`| Connected App OAuth client secret                   |
| `SALESFORCE_USERNAME`     | Salesforce integration user email                   |
| `SALESFORCE_PASSWORD`     | Password + security token (concatenated, no spaces) |
| `SALESFORCE_LOGIN_URL`    | `https://login.salesforce.com` (or `.test` for sandbox) |

### How to Create the Salesforce Connected App

1. In Salesforce: Setup > App Manager > New Connected App
2. Enable OAuth Settings
3. Callback URL: `https://login.salesforce.com/services/oauth2/callback`
4. Selected OAuth Scopes: `api`, `refresh_token`
5. Save, wait 10 minutes for propagation
6. Copy Consumer Key (Client ID) and Consumer Secret (Client Secret)
7. Add them to Supabase Edge Function Secrets (see table above)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Iframe appears blank | Check browser console for mixed-content errors. Ensure the GitHub Pages URL uses HTTPS. |
| Iframe too short / content cut off | Increase the `height` value in the iframe (e.g., `1200`) |
| Assessment data not saving | Check Supabase Dashboard > Database > assessments table |
| Salesforce leads not appearing | Verify all 5 Salesforce secrets are set correctly in Supabase |
| Page looks broken on mobile | Ensure the Webflow section has no fixed width constraints |

---

## Quick Test Checklist

- [ ] Page loads and assessment form is visible
- [ ] Can select industry and persona
- [ ] Can complete all 15 maturity questions
- [ ] Can select challenges and goals
- [ ] Results page displays with Growth Play recommendations
- [ ] Check Supabase `assessments` table for new row
- [ ] Check Salesforce for new Lead (after Salesforce secrets are configured)

---

## Contact

For technical issues with the assessment app, contact the development team.
For Webflow page changes, contact the BlueConic web team.
