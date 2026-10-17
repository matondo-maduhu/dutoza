# DUTOZA Templates — Firebase Ready (Design Preserved)

## Nini kimefanywa

Templates zote **104** zimebadilishwa kutoka Jinja2 (Flask) kuwa **HTML static** ili ziwe tayari kwa pure Firebase + HTML/JS.

### Mabadiliko yaliyofanywa:
- `{{ url_for('static', filename='...') }}` → `/static/...`
- `{{ url_for(...) }}` nyingine → `#` (utabadilisha baadaye na JS routing)
- `{{ t('key', 'default') }}` → text ya default
- `{{ t('key') }}` → key name (unaweza kubadilisha baadaye na JS i18n)
- `{% ... %}` (if, for, include, set...) → zimeondolewa
- `{{ session... }}` na variables nyingine → zimeondolewa
- **Design (CSS, classes, layout, rangi) imehifadhiwa 100%** — hakuna mabadiliko ya visual

### Muhimu
Hizi ni **static HTML**. Data dynamic (user info, posts, chat...) itajazwa na **JavaScript + Firebase SDK**.

Unahitaji kuongeza:
1. `js/firebase-config.js`
2. Auth logic (login/register)
3. Data loading (Firestore)
4. Event handlers

### Muundo
```
templates_firebase/
├── base.html
├── auth/
│   ├── login.html
│   ├── register.html
│   └── ...
├── feed/
├── profile/
├── chat/
├── account/
├── admin/
├── community/
├── explore/
├── kijiji/
├── linkup/
├── live/
├── mediaeditor/
├── pages/
├── posts/
└── ...
```

### Next steps
1. Weka folder hii ndani ya `public/` ya Firebase Hosting
2. Ongeza Firebase JS SDK
3. Anza na auth pages (login + register)

Design haikubadilishwa hata kidogo.
