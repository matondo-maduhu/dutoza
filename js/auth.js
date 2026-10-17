/**
 * DUTOZA — Firebase Auth helpers
 * Design haijaguswa. Logic tu.
 */
(function () {
  'use strict';

  // Paths that do NOT require login
  const PUBLIC_PATHS = [
    '/login.html', '/register.html', '/forgot_password.html',
    '/reset_password.html', '/verify_otp.html', '/verify_reset_otp.html',
    '/auth/login.html', '/auth/register.html', '/auth/forgot_password.html',
    '/auth/reset_password.html', '/auth/verify_otp.html', '/auth/verify_reset_otp.html',
    '/pages/about.html', '/pages/privacy_policy.html', '/pages/terms.html',
    '/pages/help_center.html', '/pages/contact_admin.html', '/pages/data_deletion.html',
    '/pages/error.html'
  ];

  function currentPath() {
    return window.location.pathname || '/';
  }

  function isPublicPage() {
    const path = currentPath();
    return PUBLIC_PATHS.some(p => path.endsWith(p) || path === p) ||
           path.endsWith('login.html') || path.endsWith('register.html') ||
           path.endsWith('forgot_password.html') || path.endsWith('reset_password.html') ||
           path.endsWith('verify_otp.html') || path.endsWith('verify_reset_otp.html');
  }

  function goLogin() {
    // try relative auth folder first
    if (currentPath().includes('/auth/')) {
      window.location.href = 'login.html';
    } else if (currentPath().includes('/pages/') || currentPath().includes('/account/') ||
               currentPath().includes('/profile/') || currentPath().includes('/feed/') ||
               currentPath().includes('/chat/') || currentPath().includes('/admin/') ||
               currentPath().includes('/community/') || currentPath().includes('/explore/') ||
               currentPath().includes('/kijiji/') || currentPath().includes('/linkup/') ||
               currentPath().includes('/live/') || currentPath().includes('/posts/') ||
               currentPath().includes('/mediaeditor/')) {
      window.location.href = '../auth/login.html';
    } else {
      window.location.href = 'auth/login.html';
    }
  }

  function goHome() {
    if (currentPath().includes('/auth/')) {
      window.location.href = '../feed/feed.html';
    } else if (currentPath().includes('/')) {
      window.location.href = 'feed/feed.html';
    } else {
      window.location.href = '/feed/feed.html';
    }
  }

  // Auth state guard
  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(function (user) {
      if (!user && !isPublicPage()) {
        goLogin();
      }
      // If already logged in and on login/register → go home
      if (user && (currentPath().endsWith('login.html') || currentPath().endsWith('register.html'))) {
        goHome();
      }
      // Expose current user globally for other scripts
      window.currentUser = user || null;
      window.dispatchEvent(new CustomEvent('dutoza-auth-ready', { detail: { user: user } }));
    });
  }

  // ========== LOGIN (email + password) ==========
  window.dutozaLogin = async function (email, password) {
    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      return { ok: true, user: cred.user };
    } catch (err) {
      return { ok: false, code: err.code, message: err.message };
    }
  };

  // ========== REGISTER ==========
  window.dutozaRegister = async function (email, password, extra) {
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      if (extra && extra.displayName) {
        await cred.user.updateProfile({ displayName: extra.displayName });
      }
      // Optional: save profile to Firestore
      if (db && cred.user) {
        await db.collection('users').doc(cred.user.uid).set({
          email: email,
          username: (extra && extra.username) || '',
          displayName: (extra && extra.displayName) || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          language: 'sw'
        }, { merge: true });
      }
      return { ok: true, user: cred.user };
    } catch (err) {
      return { ok: false, code: err.code, message: err.message };
    }
  };

  // ========== GOOGLE ==========
  window.dutozaGoogleLogin = async function () {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const cred = await auth.signInWithPopup(provider);
      // ensure user doc exists
      if (db && cred.user) {
        const ref = db.collection('users').doc(cred.user.uid);
        const snap = await ref.get();
        if (!snap.exists) {
          await ref.set({
            email: cred.user.email,
            displayName: cred.user.displayName || '',
            photoURL: cred.user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            language: 'sw'
          }, { merge: true });
        }
      }
      return { ok: true, user: cred.user };
    } catch (err) {
      return { ok: false, code: err.code, message: err.message };
    }
  };

  // ========== FACEBOOK ==========
  window.dutozaFacebookLogin = async function () {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const cred = await auth.signInWithPopup(provider);
      if (db && cred.user) {
        const ref = db.collection('users').doc(cred.user.uid);
        const snap = await ref.get();
        if (!snap.exists) {
          await ref.set({
            email: cred.user.email || '',
            displayName: cred.user.displayName || '',
            photoURL: cred.user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            language: 'sw'
          }, { merge: true });
        }
      }
      return { ok: true, user: cred.user };
    } catch (err) {
      return { ok: false, code: err.code, message: err.message };
    }
  };

  // ========== LOGOUT ==========
  window.dutozaLogout = async function () {
    await auth.signOut();
    goLogin();
  };

  // ========== FORGOT PASSWORD ==========
  window.dutozaResetPassword = async function (email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { ok: true };
    } catch (err) {
      return { ok: false, code: err.code, message: err.message };
    }
  };

  // Friendly error messages (Swahili)
  window.dutozaAuthError = function (code) {
    const map = {
      'auth/user-not-found': 'Akaunti haipo. Angalia barua pepe.',
      'auth/wrong-password': 'Nenosiri si sahihi.',
      'auth/invalid-email': 'Barua pepe si sahihi.',
      'auth/email-already-in-use': 'Barua pepe hii inatumika tayari.',
      'auth/weak-password': 'Nenosiri dhaifu. Tumia angalau herufi 6.',
      'auth/too-many-requests': 'Jaribio nyingi. Subiri kidogo.',
      'auth/popup-closed-by-user': 'Dirisha limefungwa.',
      'auth/network-request-failed': 'Tatizo la mtandao. Jaribu tena.'
    };
    return map[code] || 'Kosa limetokea. Jaribu tena.';
  };
})();
