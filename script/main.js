        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { 
            getAuth, 
            onAuthStateChanged, 
            signInWithPopup,
            GoogleAuthProvider,
            signOut,
            signInAnonymously,
            signInWithCustomToken 
        } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

        // Use your provided config directly
        const firebaseConfig = {
            apiKey: "AIzaSyArJgMon8ezbNd3MYHzTcWY1ic_vh52e_Q",
            authDomain: "raizian-v1-570a7.firebaseapp.com",
            projectId: "raizian-v1-570a7",
            storageBucket: "raizian-v1-570a7.firebasestorage.app",
            messagingSenderId: "543173127208",
            appId: "1:543173127208:web:1ef820591e72d556a2191d",
            measurementId: "G-2JJLHTHPL2"
        };
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        let currentUser = null;
        let authLoading = true;
        let currentPage = 'loader';
        
        // DOM Element References
        const pages = {
            loader: document.getElementById('loading-spinner'),
            login: document.getElementById('login-page'),
            dashboard: document.getElementById('dashboard-page')
        };

        const googleSigninBtn = document.getElementById('google-signin-btn');
        const loginMessage = document.getElementById('login-message');
        
        const dashboardWelcome = document.getElementById('dashboard-welcome');
        const dashboardContent = document.getElementById('dashboard-content');
        const userDisplayName = document.getElementById('user-display-name');
        const signoutBtn = document.getElementById('signout-btn');

        // --- UI Functions ---

        function setPage(pageName) {
            currentPage = pageName;
            Object.values(pages).forEach(page => page.classList.add('hidden'));
            if (pages[pageName]) {
                pages[pageName].classList.remove('hidden');
                if (pageName === 'dashboard') {
                    // Trigger welcome animation
                    setTimeout(() => {
                        dashboardWelcome.classList.remove('opacity-0', '-translate-y-10');
                        dashboardContent.classList.remove('opacity-0');
                    }, 100);
                }
            }
        }

        function showMessage(container, message, type = 'error') {
            const baseClasses = 'flex items-center p-3 text-sm rounded-lg border';
            let typeClasses = 'text-red-400 bg-red-900/30 border-red-800';
            if (type === 'success') {
                typeClasses = 'text-green-400 bg-green-900/30 border-green-800';
            }
            container.innerHTML = `
                <div class="${baseClasses} ${typeClasses}">
                    <svg class="w-5 h-5 mr-2 flex-shrink-0"><use href="#icon-info"></use></svg>
                    <span>${message}</span>
                </div>
            `;
        }

        function clearMessages() {
            loginMessage.innerHTML = '';
        }

        function getFriendlyErrorMessage(code) {
            console.error("Firebase Error Code:", code); // Log the raw error
            switch (code) {
                case 'auth/popup-closed-by-user':
                    return 'Sign-in window closed. Please try again.';
                case 'auth/cancelled-popup-request':
                    return 'A previous sign-in attempt was interrupted.';
                case 'auth/operation-not-allowed':
                    return 'Google Sign-in is not enabled in Firebase project settings.';
                default:
                    return 'An unexpected error occurred during sign-in. Please try again.';
            }
        }

        // Auth state listener - the single source of truth
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authLoading = false;

    if (user && !user.isAnonymous) {
        // --- NEW REDIRECT LOGIC ---
        // Redirect to home.html if a valid, non-anonymous user logs in
        // The token is handled automatically by the Firebase SDK and is accessible on the next page.
        window.location.replace("home.html"); 
        
    } else {
        // No authenticated user, show the login page
        setPage('login');
    }
});

        // --- Event Listeners ---

        googleSigninBtn.addEventListener('click', async () => {
            clearMessages();
            googleSigninBtn.disabled = true;
            try {
                await signInWithPopup(auth, provider);
                // Auth state change handled by onAuthStateChanged listener
            } catch (err) {
                showMessage(loginMessage, getFriendlyErrorMessage(err.code), 'error');
                googleSigninBtn.disabled = false;
            }
        });

        // --- Immediate-running Init Function ---
        (async () => {
             // Handle environment-specific sign-in methods (like custom token or anonymous for a canvas/dev environment)
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                try {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } catch (err) {
                    console.error("Custom token sign-in error:", err);
                }
            } else if (window.self !== window.top) {
                // If inside an iframe (like the canvas) and no token, sign in anonymously
                 try {
                     await signInAnonymously(auth);
                 } catch (err) {
                     console.error("Anonymous sign-in error:", err);
                 }
            }
            // onAuthStateChanged will handle the final page transition.
        })();

