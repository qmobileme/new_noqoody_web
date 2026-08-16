# Noqoody Super Admin Panel

One admin area at `/admin`, behind staff login, with a persistent sidebar. Everything editable lives in the database so the public site reads live content instead of hard-coded files.

## 1. Roles and login

- Add a `superadmin` capability tier on top of the existing admin/editor roles.
- `/admin/login` stays the single entry point. After sign-in the user lands on the new dashboard shell.
- New sections (Events, POS Library, Order Now catalogue) are restricted to admin/superadmin; blog stays available to editors.

## 2. Admin shell

New layout with a left sidebar and these sections:

```text
Dashboard      overview counts + recent activity
Blog           posts, authors, import, activity  (existing pages moved in)
Events         create / edit / publish events
POS Library    product catalogue + full product pages
Order Now      the device list shown on /order-now
Leads          RSVPs and contact messages (existing)
```

Existing blog admin screens keep working — they get re-parented into the shell, not rewritten.

## 3. Events manager

New `events` table: title, slug, summary, description, location, start/end date, cover image, registration link, published flag, display order.

- Admin list with create/edit/delete, publish toggle, drag-free ordering by date.
- `/events` becomes database-driven: published events render there, each with its own RSVP form.

## 4. POS product library

New `pos_products` table replacing the hard-coded `src/lib/pos-devices.ts`, with fields matching the sample page at noqoody.com/NoqA920Pro.html:

- name, slug, tagline, hero image + gallery images
- intro headline and body, "best for", spec rows (label/value)
- feature blocks (heading + text + image, repeatable)
- checklist bullets (Android 8.1, Cortex A53, ...)
- datasheet PDF link, colour accent, published flag, sort order

Public side:
- `/pos-products` grid reads from the database (same look as today).
- New `/pos-products/$slug` product page modelled on the sample: dark hero band with the product name, image + spec intro, "Challenge the impossible" style checklist section, download-datasheet CTA, coloured feature bands, then the site footer.
- The POS Products dropdown in the header is generated from the same table, so adding a product adds it to the menu automatically.

## 5. Order Now catalogue manager

New `order_products` table replacing `src/lib/order-devices.ts`: name, image, description, spec bullets, min/max quantity, active flag, sort order. Admin CRUD page; `/order-now` reads the live list.

## 6. Data safety

- Public read policies limited to published/active rows; all writes limited to admin roles.
- Existing hard-coded product and device lists are seeded into the new tables in the migration, so nothing disappears on the public site.
- Image uploads reuse the existing private blog-images bucket via signed URLs.

## Technical notes

- Tables created with GRANTs + RLS in one migration, including seed rows from the current TypeScript catalogues.
- Reads go through the existing browser Supabase client for admin, and a server publishable client for SSR public pages so product pages keep their SEO metadata.
- Each product page defines its own `head()` with title, description, OG tags and the hero image URL.
