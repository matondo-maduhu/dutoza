# DUTOZA Templates + Firebase Auth

## Design
**Haijabadilishwa hata kidogo.** CSS, layout, rangi, classes — zote ziko kama zilivyokuwa.

## Nini kimeongezwa

### 1. Folder `js/`
- `firebase-config.js` — weka API keys zako za Firebase hapa
- `auth.js` — login, register, Google, Facebook, logout, reset password, auth guard

### 2. Kila HTML file (104)
Imeongezwa mwishoni (kabla ya `</body>`):
- Firebase SDK (app, auth, firestore, storage)
- `firebase-config.js` + `auth.js`
- Auth guard: kama user hajalogin → anapelekwa login (isipokuwa public pages)

### 3. Auth pages zimeunganishwa
- **login.html** → Email/Password + Google + Facebook (Firebase)
- **register.html** → createUserWithEmailAndPassword + save profile to Firestore
- **forgot_password.html** → sendPasswordResetEmail

## Jinsi ya kuanza

1. Fungua Firebase Console → unda project
2. Washa **Authentication** → Email/Password + Google + Facebook
3. Washa **Firestore** + **Storage**
4. Fungua `js/firebase-config.js` na badilisha:
   ```
   apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
   ```
5. Weka folder hii ndani ya `public/` ya Firebase Hosting
6. Deploy: `firebase deploy`

## Auth functions (global)

```js
dutozaLogin(email, password)
dutozaRegister(email, password, { displayName, username })
dutozaGoogleLogin()
dutozaFacebookLogin()
dutozaLogout()
dutozaResetPassword(email)
dutozaAuthError(code)  // Swahili messages
```

## Muhimu
- Badilisha `YOUR_API_KEY` n.k. ndani ya `js/firebase-config.js`
- Google & Facebook zinahitaji kuwezeshwa kwenye Firebase Console + domain yako iongezwe
- Pages zisizo public zinalindwa na auth guard (redirect → login)

Design = 100% ile ile.
