// ===================================
// MusicMate - Main Application Logic
// With Firebase Auth & Firestore
// ===================================

// ==================
// Firebase Config
// ==================

const firebaseConfig = {
    apiKey: "AIzaSyBxQmHEgPozwBzUSvkUKXguNW852URkRCE",
    authDomain: "music-mate-47f37.firebaseapp.com",
    projectId: "music-mate-47f37",
    storageBucket: "music-mate-47f37.firebasestorage.app",
    messagingSenderId: "853264425910",
    appId: "1:853264425910:web:10c27da882837bd2361717",
    measurementId: "G-ZF8822BVQ4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==================
// Data & State
// ==================

// Music Database (for recommendations)
const MUSIC_DATABASE = {
    genres: [
        'K-Pop', 'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Indie',
        'Jazz', 'Classical', 'EDM', 'Ballad', 'Folk', 'Metal',
        'Reggae', 'Blues', 'Country', 'Funk', 'Soul', 'Disco'
    ],

    // Genre-based artist recommendations
    artistsByGenre: {
        'K-Pop': ['BTS', 'BLACKPINK', 'NewJeans', 'aespa', 'Stray Kids', 'IVE', 'LE SSERAFIM', 'SEVENTEEN', 'NCT', 'Red Velvet', 'EXO', 'TWICE', '(G)I-DLE', 'ITZY', 'TXT'],
        'Pop': ['Taylor Swift', 'Ed Sheeran', 'Dua Lipa', 'The Weeknd', 'Harry Styles', 'Billie Eilish', 'Ariana Grande', 'Bruno Mars', 'SZA', 'Olivia Rodrigo'],
        'Hip-Hop': ['Drake', 'Kendrick Lamar', 'J. Cole', 'Travis Scott', 'Tyler, The Creator', 'Kanye West', '21 Savage', 'Metro Boomin', 'Post Malone', 'Doja Cat'],
        'R&B': ['The Weeknd', 'Frank Ocean', 'SZA', 'Daniel Caesar', 'H.E.R.', 'Jhené Aiko', 'Summer Walker', 'Brent Faiyaz', 'Khalid', 'Giveon'],
        'Rock': ['Arctic Monkeys', 'The 1975', 'Imagine Dragons', 'Twenty One Pilots', 'Green Day', 'Foo Fighters', 'Coldplay', 'Muse', 'Radiohead', 'The Killers'],
        'Indie': ['Tame Impala', 'Mac DeMarco', 'Clairo', 'Steve Lacy', 'Rex Orange County', 'Men I Trust', 'Boy Pablo', 'Bedroom', 'Still Woozy', 'beabadoobee'],
        'Jazz': ['Robert Glasper', 'Kamasi Washington', 'Snarky Puppy', 'Jacob Collier', 'Esperanza Spalding', 'Joey Alexander', 'Norah Jones', 'Diana Krall', 'Chet Baker', 'Miles Davis'],
        'Classical': ['Yiruma', 'Ludovico Einaudi', 'Lang Lang', 'Yo-Yo Ma', 'André Rieu', 'Murray Perahia', 'Hilary Hahn', 'Max Richter', 'Ólafur Arnalds', 'Joep Beving'],
        'EDM': ['Avicii', 'Martin Garrix', 'Calvin Harris', 'David Guetta', 'Kygo', 'Tiësto', 'Marshmello', 'Zedd', 'Illenium', 'ODESZA'],
        'Ballad': ['Adele', 'Sam Smith', 'John Legend', 'Lewis Capaldi', 'Lauv', 'James Arthur', 'Christina Perri', 'James Bay', 'Passenger', 'Dean Lewis'],
        'Folk': ['Mumford & Sons', 'Bon Iver', 'Fleet Foxes', 'Iron & Wine', 'Vance Joy', 'The Lumineers', 'Of Monsters and Men', 'Hozier', 'Phoebe Bridgers', 'Father John Misty'],
        'Metal': ['Metallica', 'Iron Maiden', 'Slipknot', 'Avenged Sevenfold', 'Gojira', 'Ghost', 'Mastodon', 'Lamb of God', 'Trivium', 'Bullet For My Valentine'],
        'Reggae': ['Bob Marley', 'Damian Marley', 'Sean Paul', 'Shaggy', 'Chronixx', 'Protoje', 'Koffee', 'Skip Marley', 'Ziggy Marley', 'Stephen Marley'],
        'Blues': ['Gary Clark Jr.', 'Joe Bonamassa', 'John Mayer', 'Stevie Ray Vaughan', 'B.B. King', 'Buddy Guy', 'Eric Clapton', 'Christone Kingfish Ingram', 'Kenny Wayne Shepherd', 'Robert Cray'],
        'Country': ['Luke Combs', 'Morgan Wallen', 'Chris Stapleton', 'Kacey Musgraves', 'Zach Bryan', 'Luke Bryan', 'Carrie Underwood', 'Kane Brown', 'Thomas Rhett', 'Maren Morris'],
        'Funk': ['Anderson .Paak', 'Vulfpeck', 'Bruno Mars', 'Thundercat', 'Jamiroquai', 'Chromeo', 'Daft Punk', 'Kool & The Gang', 'Earth, Wind & Fire', 'Prince'],
        'Soul': ['Leon Bridges', 'Alicia Keys', 'John Legend', 'Erykah Badu', 'D\'Angelo', 'Lauryn Hill', 'Aretha Franklin', 'Stevie Wonder', 'Marvin Gaye', 'Amy Winehouse'],
        'Disco': ['Dua Lipa', 'Daft Punk', 'Bee Gees', 'Donna Summer', 'Gloria Gaynor', 'Chic', 'KC and The Sunshine Band', 'Jessie Ware', 'Kylie Minogue', 'Róisín Murphy']
    },

    // Genre-based song recommendations
    songsByGenre: {
        'K-Pop': ['Dynamite - BTS', 'Pink Venom - BLACKPINK', 'Super Shy - NewJeans', 'Spicy - aespa', 'LALALALA - Stray Kids', 'I AM - IVE', 'ANTIFRAGILE - LE SSERAFIM', 'Super - SEVENTEEN', 'Queencard - (G)I-DLE', 'WANNABE - ITZY'],
        'Pop': ['Anti-Hero - Taylor Swift', 'Shape of You - Ed Sheeran', 'Levitating - Dua Lipa', 'Blinding Lights - The Weeknd', 'As It Was - Harry Styles', 'bad guy - Billie Eilish', '7 rings - Ariana Grande', 'Uptown Funk - Bruno Mars'],
        'Hip-Hop': ['God\'s Plan - Drake', 'HUMBLE. - Kendrick Lamar', 'No Role Modelz - J. Cole', 'SICKO MODE - Travis Scott', 'See You Again - Tyler, The Creator', 'Stronger - Kanye West', 'rockstar - Post Malone', 'Congratulations - Post Malone'],
        'R&B': ['Blinding Lights - The Weeknd', 'Nights - Frank Ocean', 'Good Days - SZA', 'Best Part - Daniel Caesar', 'Focus - H.E.R.', 'Triggered - Jhené Aiko', 'Playing Games - Summer Walker', 'Dead Man Walking - Brent Faiyaz'],
        'Rock': ['Do I Wanna Know? - Arctic Monkeys', 'Somebody Else - The 1975', 'Believer - Imagine Dragons', 'Stressed Out - Twenty One Pilots', 'Basket Case - Green Day', 'Everlong - Foo Fighters', 'Yellow - Coldplay', 'Supermassive Black Hole - Muse'],
        'Indie': ['The Less I Know The Better - Tame Impala', 'Chamber of Reflection - Mac DeMarco', 'Sofia - Clairo', 'Bad Habit - Steve Lacy', 'Loving is Easy - Rex Orange County', 'Show Me How - Men I Trust', 'Everytime - Boy Pablo', 'Falls - ODESZA'],
        'Jazz': ['Black Radio - Robert Glasper', 'The Epic - Kamasi Washington', 'Lingus - Snarky Puppy', 'Moon River - Jacob Collier', 'Don\'t Know Why - Norah Jones', 'My Funny Valentine - Chet Baker', 'So What - Miles Davis', 'Take Five - Dave Brubeck'],
        'Classical': ['River Flows in You - Yiruma', 'Experience - Ludovico Einaudi', 'Clair de Lune - Debussy', 'Canon in D - Pachelbel', 'Moonlight Sonata - Beethoven', 'Spring - Vivaldi', 'On the Nature of Daylight - Max Richter', 'Gymnopédie No.1 - Erik Satie'],
        'EDM': ['Wake Me Up - Avicii', 'Animals - Martin Garrix', 'Summer - Calvin Harris', 'Titanium - David Guetta', 'Firestone - Kygo', 'Red Lights - Tiësto', 'Alone - Marshmello', 'Clarity - Zedd', 'Illenium - Good Things Fall Apart', 'A Moment Apart - ODESZA'],
        'Ballad': ['Someone Like You - Adele', 'Stay With Me - Sam Smith', 'All of Me - John Legend', 'Someone You Loved - Lewis Capaldi', 'I Like Me Better - Lauv', 'Say You Won\'t Let Go - James Arthur', 'A Thousand Years - Christina Perri', 'Let It Go - James Bay'],
        'Folk': ['I Will Wait - Mumford & Sons', 'Skinny Love - Bon Iver', 'White Winter Hymnal - Fleet Foxes', 'Naked As We Came - Iron & Wine', 'Riptide - Vance Joy', 'Ho Hey - The Lumineers', 'Little Talks - Of Monsters and Men', 'Take Me to Church - Hozier'],
        'Metal': ['Enter Sandman - Metallica', 'Fear of the Dark - Iron Maiden', 'Duality - Slipknot', 'Nightmare - Avenged Sevenfold', 'The Shooting Star - Gojira', 'Square Hammer - Ghost', 'Blood and Thunder - Mastodon', 'Redneck - Lamb of God'],
        'Reggae': ['One Love - Bob Marley', 'Welcome to Jamrock - Damian Marley', 'Temperature - Sean Paul', 'It Wasn\'t Me - Shaggy', 'Smile Jamaica - Chronixx', 'Who Knows - Protoje', 'Rapture - Koffee', 'No More Trouble - Skip Marley'],
        'Blues': ['Bright Lights - Gary Clark Jr.', 'Mountain Time - Joe Bonamassa', 'Gravity - John Mayer', 'Pride and Joy - Stevie Ray Vaughan', 'The Thrill Is Gone - B.B. King', 'Damn Right I\'ve Got the Blues - Buddy Guy', 'Layla - Eric Clapton'],
        'Country': ['Fast Car - Luke Combs', 'Last Night - Morgan Wallen', 'Tennessee Whiskey - Chris Stapleton', 'Space Cowboy - Kacey Musgraves', 'Something in the Orange - Zach Bryan', 'Country Girl - Luke Bryan', 'Before He Cheats - Carrie Underwood'],
        'Funk': ['Come Down - Anderson .Paak', 'Dean Town - Vulfpeck', 'Finesse - Bruno Mars', 'Them Changes - Thundercat', 'Virtual Insanity - Jamiroquai', 'Jealous - Chromeo', 'Get Lucky - Daft Punk', 'Celebration - Kool & The Gang'],
        'Soul': ['Coming Home - Leon Bridges', 'Fallin\' - Alicia Keys', 'Ordinary People - John Legend', 'On & On - Erykah Badu', 'Untitled - D\'Angelo', 'Doo Wop - Lauryn Hill', 'Respect - Aretha Franklin', 'Superstition - Stevie Wonder'],
        'Disco': ['Don\'t Start Now - Dua Lipa', 'Get Lucky - Daft Punk', 'Stayin\' Alive - Bee Gees', 'I Feel Love - Donna Summer', 'I Will Survive - Gloria Gaynor', 'Le Freak - Chic', 'That\'s the Way (I Like It) - KC and The Sunshine Band']
    },

    // Similar artists mapping
    similarArtists: {
        'BTS': ['SEVENTEEN', 'EXO', 'NCT', 'TXT', 'Stray Kids'],
        'BLACKPINK': ['aespa', '(G)I-DLE', 'ITZY', 'IVE', 'LE SSERAFIM'],
        'NewJeans': ['IVE', 'LE SSERAFIM', 'aespa', 'ILLIT', 'BABYMONSTER'],
        'Taylor Swift': ['Olivia Rodrigo', 'Lorde', 'Ed Sheeran', 'Selena Gomez'],
        'The Weeknd': ['Dua Lipa', 'Bruno Mars', 'Post Malone', 'Khalid'],
        'Drake': ['J. Cole', 'Future', '21 Savage', 'Travis Scott'],
        'Billie Eilish': ['Olivia Rodrigo', 'Lorde', 'Clairo', 'girl in red'],
        'Arctic Monkeys': ['The 1975', 'The Strokes', 'Tame Impala', 'Catfish and the Bottlemen']
    }
};

// Application State
let appState = {
    selectedGenres: [],
    artists: [],
    songs: [],
    recommendations: {
        artists: [],
        songs: []
    },
    ratings: []
};

let currentUser = null;
let unsubscribeFirestore = null;

// ==================
// Loading & UI State
// ==================

function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

// ==================
// Firebase Auth
// ==================

function updateUserUI(user) {
    const userArea = document.getElementById('user-area');

    if (user) {
        const emailPrefix = user.email.split('@')[0];
        userArea.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">${emailPrefix.charAt(0).toUpperCase()}</div>
                <span class="user-email">${user.email}</span>
                <button class="logout-btn" id="logout-btn">로그아웃</button>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        userArea.innerHTML = `
            <button class="btn btn-primary btn-small" id="login-btn">
                <span class="btn-icon-sm">👤</span>
                <span>로그인</span>
            </button>
        `;
        document.getElementById('login-btn').addEventListener('click', openAuthModal);
    }
}

async function handleSignup(email, password) {
    try {
        showLoading();
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        closeAuthModal();
        showToast('회원가입이 완료되었습니다!');

        // Initialize user data in Firestore
        await initializeUserData(userCredential.user.uid);

    } catch (error) {
        let message = '회원가입에 실패했습니다.';
        if (error.code === 'auth/email-already-in-use') {
            message = '이미 사용 중인 이메일입니다.';
        } else if (error.code === 'auth/weak-password') {
            message = '비밀번호는 6자 이상이어야 합니다.';
        } else if (error.code === 'auth/invalid-email') {
            message = '유효하지 않은 이메일 형식입니다.';
        }
        document.getElementById('signup-error').textContent = message;
    } finally {
        hideLoading();
    }
}

async function handleLogin(email, password) {
    try {
        showLoading();
        await auth.signInWithEmailAndPassword(email, password);
        closeAuthModal();
        showToast('로그인되었습니다!');
    } catch (error) {
        let message = '로그인에 실패했습니다.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.code === 'auth/invalid-email') {
            message = '유효하지 않은 이메일 형식입니다.';
        } else if (error.code === 'auth/invalid-credential') {
            message = '이메일 또는 비밀번호가 올바르지 않습니다.';
        }
        document.getElementById('login-error').textContent = message;
    } finally {
        hideLoading();
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        showToast('로그아웃되었습니다.');
    } catch (error) {
        showToast('로그아웃에 실패했습니다.');
    }
}

// ==================
// Firestore Data
// ==================

async function initializeUserData(userId) {
    const userDocRef = db.collection('users').doc(userId);
    const docSnap = await userDocRef.get();

    if (!docSnap.exists) {
        // Create initial data structure
        await userDocRef.set({
            selectedGenres: [],
            artists: [],
            songs: [],
            recommendations: { artists: [], songs: [] },
            ratings: [],
            createdAt: new Date().toISOString()
        });
    }
}

async function saveToFirestore() {
    if (!currentUser) return;

    try {
        const userDocRef = db.collection('users').doc(currentUser.uid);
        await userDocRef.set({
            selectedGenres: appState.selectedGenres,
            artists: appState.artists,
            songs: appState.songs,
            recommendations: appState.recommendations,
            ratings: appState.ratings,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving to Firestore:', error);
    }
}

function subscribeToFirestore(userId) {
    const userDocRef = db.collection('users').doc(userId);

    unsubscribeFirestore = userDocRef.onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            appState = {
                selectedGenres: data.selectedGenres || [],
                artists: data.artists || [],
                songs: data.songs || [],
                recommendations: data.recommendations || { artists: [], songs: [] },
                ratings: data.ratings || []
            };
            renderAll();
        }
    }, (error) => {
        console.error('Firestore subscription error:', error);
    });
}

// ==================
// LocalStorage (Fallback for non-logged in users)
// ==================

const STORAGE_KEY = 'musicmate_data';

function saveToStorage() {
    if (currentUser) {
        saveToFirestore();
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }
}

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        appState = JSON.parse(data);
    }
}

// ==================
// Auth Modal
// ==================

function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
    document.getElementById('login-email').focus();
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
    document.getElementById('login-error').textContent = '';
    document.getElementById('signup-error').textContent = '';
}

function setupAuthModal() {
    // Close button
    document.getElementById('auth-modal-close').addEventListener('click', closeAuthModal);

    // Click outside to close
    document.getElementById('auth-modal').addEventListener('click', (e) => {
        if (e.target.id === 'auth-modal') closeAuthModal();
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.authTab;

            document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tabName}-form`).classList.add('active');

            document.getElementById('auth-modal-title').textContent =
                tabName === 'login' ? '로그인' : '회원가입';
        });
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        handleLogin(email, password);
    });

    // Signup form
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-password-confirm').value;

        if (password !== confirmPassword) {
            document.getElementById('signup-error').textContent = '비밀번호가 일치하지 않습니다.';
            return;
        }

        handleSignup(email, password);
    });
}

// ==================
// UI Rendering
// ==================

function renderGenres() {
    const container = document.getElementById('genre-grid');
    container.innerHTML = '';

    MUSIC_DATABASE.genres.forEach(genre => {
        const btn = document.createElement('button');
        btn.className = `genre-btn ${appState.selectedGenres.includes(genre) ? 'selected' : ''}`;
        btn.textContent = genre;
        btn.onclick = () => toggleGenre(genre);
        container.appendChild(btn);
    });
}

function renderSelectedGenres() {
    const container = document.getElementById('selected-genres');
    const emptyMsg = document.getElementById('genres-empty');

    if (appState.selectedGenres.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.innerHTML = appState.selectedGenres.map((genre, index) => `
        <div class="tag">
            <span class="tag-text">${genre}</span>
            <div class="tag-actions">
                <button class="tag-btn delete" onclick="removeGenre(${index})" title="삭제">✕</button>
            </div>
        </div>
    `).join('');
}

function renderArtists() {
    const container = document.getElementById('selected-artists');
    const emptyMsg = document.getElementById('artists-empty');

    if (appState.artists.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.innerHTML = appState.artists.map((artist, index) => `
        <div class="tag">
            <span class="tag-text">${artist}</span>
            <div class="tag-actions">
                <button class="tag-btn" onclick="editItem('artists', ${index})" title="수정">✎</button>
                <button class="tag-btn delete" onclick="removeArtist(${index})" title="삭제">✕</button>
            </div>
        </div>
    `).join('');
}

function renderSongs() {
    const container = document.getElementById('selected-songs');
    const emptyMsg = document.getElementById('songs-empty');

    if (appState.songs.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.innerHTML = appState.songs.map((song, index) => `
        <div class="tag">
            <span class="tag-text">${song}</span>
            <div class="tag-actions">
                <button class="tag-btn" onclick="editItem('songs', ${index})" title="수정">✎</button>
                <button class="tag-btn delete" onclick="removeSong(${index})" title="삭제">✕</button>
            </div>
        </div>
    `).join('');
}

function renderRecommendations() {
    renderRecommendedArtists();
    renderRecommendedSongs();
}

function renderRecommendedArtists() {
    const container = document.getElementById('recommended-artists');
    const emptyMsg = document.getElementById('rec-artists-empty');

    if (appState.recommendations.artists.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.innerHTML = appState.recommendations.artists.map((item, index) => {
        const existingRating = appState.ratings.find(r => r.type === 'artist' && r.name === item.name);
        return createRecommendationCard(item, 'artist', index, existingRating?.rating);
    }).join('');
}

function renderRecommendedSongs() {
    const container = document.getElementById('recommended-songs');
    const emptyMsg = document.getElementById('rec-songs-empty');

    if (appState.recommendations.songs.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.innerHTML = appState.recommendations.songs.map((item, index) => {
        const existingRating = appState.ratings.find(r => r.type === 'song' && r.name === item.name);
        return createRecommendationCard(item, 'song', index, existingRating?.rating);
    }).join('');
}

function createRecommendationCard(item, type, index, existingRating) {
    const icon = type === 'artist' ? '🎤' : '🎵';
    const ratingOptions = [
        { value: 5, label: '매우 좋음', icon: '😍' },
        { value: 4, label: '좋음', icon: '😊' },
        { value: 3, label: '보통', icon: '😐' },
        { value: 2, label: '별로', icon: '😕' },
        { value: 1, label: '완전 별로', icon: '😩' }
    ];

    return `
        <div class="recommendation-item" data-type="${type}" data-index="${index}">
            <div class="rec-header">
                <div class="rec-icon">${icon}</div>
                <div class="rec-info">
                    <h4>${item.name}</h4>
                    <p>${item.reason}</p>
                </div>
            </div>
            <div class="rec-match">
                <span>매칭률</span>
                <div class="match-bar">
                    <div class="match-fill" style="width: ${item.matchScore}%"></div>
                </div>
                <span>${item.matchScore}%</span>
            </div>
            <div class="rating-buttons">
                ${ratingOptions.map(opt => `
                    <button class="rating-btn ${existingRating === opt.value ? 'selected' : ''}" 
                            onclick="rateRecommendation('${type}', '${item.name.replace(/'/g, "\\'")}', ${opt.value})">
                        <span class="rating-icon">${opt.icon}</span>
                        <span>${opt.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRatingHistory() {
    const container = document.getElementById('rating-history');
    const emptyMsg = document.getElementById('history-empty');

    if (appState.ratings.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';

    const ratingLabels = {
        5: { text: '매우 좋음', class: 'excellent' },
        4: { text: '좋음', class: 'good' },
        3: { text: '보통', class: 'normal' },
        2: { text: '별로', class: 'bad' },
        1: { text: '완전 별로', class: 'terrible' }
    };

    container.innerHTML = appState.ratings.slice().reverse().map(item => {
        const icon = item.type === 'artist' ? '🎤' : '🎵';
        const typeLabel = item.type === 'artist' ? '아티스트' : '노래';
        const ratingInfo = ratingLabels[item.rating];

        return `
            <div class="history-item">
                <div class="rec-icon">${icon}</div>
                <div class="history-info">
                    <h5>${item.name}</h5>
                    <p>${typeLabel}</p>
                </div>
                <span class="history-rating ${ratingInfo.class}">${ratingInfo.text}</span>
            </div>
        `;
    }).join('');
}

// ==================
// User Actions
// ==================

function toggleGenre(genre) {
    const index = appState.selectedGenres.indexOf(genre);
    if (index === -1) {
        appState.selectedGenres.push(genre);
        showToast(`${genre} 장르가 추가되었습니다`);
    } else {
        appState.selectedGenres.splice(index, 1);
        showToast(`${genre} 장르가 제거되었습니다`);
    }
    saveToStorage();
    renderGenres();
    renderSelectedGenres();
}

function removeGenre(index) {
    const genre = appState.selectedGenres[index];
    appState.selectedGenres.splice(index, 1);
    saveToStorage();
    renderGenres();
    renderSelectedGenres();
    showToast(`${genre} 장르가 제거되었습니다`);
}

function addArtist() {
    const input = document.getElementById('artist-input');
    const value = input.value.trim();

    if (!value) {
        showToast('아티스트 이름을 입력해주세요');
        return;
    }

    if (appState.artists.includes(value)) {
        showToast('이미 추가된 아티스트입니다');
        return;
    }

    appState.artists.push(value);
    saveToStorage();
    renderArtists();
    input.value = '';
    showToast(`${value} 아티스트가 추가되었습니다`);
}

function removeArtist(index) {
    const artist = appState.artists[index];
    appState.artists.splice(index, 1);
    saveToStorage();
    renderArtists();
    showToast(`${artist} 아티스트가 제거되었습니다`);
}

function addSong() {
    const input = document.getElementById('song-input');
    const value = input.value.trim();

    if (!value) {
        showToast('노래 제목을 입력해주세요');
        return;
    }

    if (appState.songs.includes(value)) {
        showToast('이미 추가된 노래입니다');
        return;
    }

    appState.songs.push(value);
    saveToStorage();
    renderSongs();
    input.value = '';
    showToast(`${value} 노래가 추가되었습니다`);
}

function removeSong(index) {
    const song = appState.songs[index];
    appState.songs.splice(index, 1);
    saveToStorage();
    renderSongs();
    showToast(`${song} 노래가 제거되었습니다`);
}

function clearAll() {
    if (confirm('정말로 모든 데이터를 삭제하시겠습니까?')) {
        appState = {
            selectedGenres: [],
            artists: [],
            songs: [],
            recommendations: { artists: [], songs: [] },
            ratings: []
        };
        saveToStorage();
        renderAll();
        showToast('모든 데이터가 삭제되었습니다');
    }
}

// ==================
// Edit Modal
// ==================

function editItem(type, index) {
    const modal = document.getElementById('edit-modal');
    const input = document.getElementById('edit-input');
    const typeInput = document.getElementById('edit-type');
    const indexInput = document.getElementById('edit-index');

    let value;
    if (type === 'artists') {
        value = appState.artists[index];
    } else if (type === 'songs') {
        value = appState.songs[index];
    }

    input.value = value;
    typeInput.value = type;
    indexInput.value = index;

    modal.classList.add('active');
    input.focus();
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function saveEdit() {
    const input = document.getElementById('edit-input');
    const type = document.getElementById('edit-type').value;
    const index = parseInt(document.getElementById('edit-index').value);
    const value = input.value.trim();

    if (!value) {
        showToast('값을 입력해주세요');
        return;
    }

    if (type === 'artists') {
        appState.artists[index] = value;
        renderArtists();
    } else if (type === 'songs') {
        appState.songs[index] = value;
        renderSongs();
    }

    saveToStorage();
    closeModal();
    showToast('수정되었습니다');
}

// ==================
// Recommendation Algorithm
// ==================

function getRecommendations() {
    if (appState.selectedGenres.length === 0 && appState.artists.length === 0 && appState.songs.length === 0) {
        showToast('먼저 장르, 아티스트 또는 노래를 추가해주세요');
        return;
    }

    const recommendedArtists = generateArtistRecommendations();
    const recommendedSongs = generateSongRecommendations();

    appState.recommendations.artists = recommendedArtists;
    appState.recommendations.songs = recommendedSongs;

    saveToStorage();
    renderRecommendations();

    // Scroll to recommendations
    document.getElementById('recommendations-section').scrollIntoView({ behavior: 'smooth' });
    showToast('추천이 완료되었습니다!');
}

function generateArtistRecommendations() {
    const candidates = new Map(); // name -> { score, reasons }

    // 1. Genre-based recommendations
    appState.selectedGenres.forEach(genre => {
        const artists = MUSIC_DATABASE.artistsByGenre[genre] || [];
        artists.forEach(artist => {
            if (!appState.artists.includes(artist)) {
                const current = candidates.get(artist) || { score: 0, reasons: [] };
                current.score += 3;
                current.reasons.push(`${genre} 장르`);
                candidates.set(artist, current);
            }
        });
    });

    // 2. Similar artist recommendations
    appState.artists.forEach(userArtist => {
        const similar = MUSIC_DATABASE.similarArtists[userArtist] || [];
        similar.forEach(artist => {
            if (!appState.artists.includes(artist)) {
                const current = candidates.get(artist) || { score: 0, reasons: [] };
                current.score += 2;
                current.reasons.push(`${userArtist}와 유사`);
                candidates.set(artist, current);
            }
        });
    });

    // 3. Apply rating adjustments
    appState.ratings.forEach(rating => {
        if (rating.type === 'artist') {
            // Find similar genres for rated artists
            Object.entries(MUSIC_DATABASE.artistsByGenre).forEach(([genre, artists]) => {
                if (artists.includes(rating.name)) {
                    const adjustment = (rating.rating - 3) * 0.5; // -1 to +1
                    const genreArtists = MUSIC_DATABASE.artistsByGenre[genre] || [];
                    genreArtists.forEach(artist => {
                        if (candidates.has(artist)) {
                            const current = candidates.get(artist);
                            current.score += adjustment;
                            candidates.set(artist, current);
                        }
                    });
                }
            });
        }
    });

    // Convert to array and sort
    const results = Array.from(candidates.entries())
        .map(([name, data]) => ({
            name,
            reason: data.reasons.slice(0, 2).join(', '),
            matchScore: Math.min(100, Math.round((data.score / 10) * 100))
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);

    return results;
}

function generateSongRecommendations() {
    const candidates = new Map();

    // 1. Genre-based recommendations
    appState.selectedGenres.forEach(genre => {
        const songs = MUSIC_DATABASE.songsByGenre[genre] || [];
        songs.forEach(song => {
            if (!appState.songs.includes(song)) {
                const current = candidates.get(song) || { score: 0, reasons: [] };
                current.score += 3;
                current.reasons.push(`${genre} 장르`);
                candidates.set(song, current);
            }
        });
    });

    // 2. Artist-based recommendations
    appState.artists.forEach(artist => {
        Object.values(MUSIC_DATABASE.songsByGenre).flat().forEach(song => {
            if (song.includes(artist) && !appState.songs.includes(song)) {
                const current = candidates.get(song) || { score: 0, reasons: [] };
                current.score += 4;
                current.reasons.push(`${artist}의 곡`);
                candidates.set(song, current);
            }
        });
    });

    // 3. Apply rating adjustments
    appState.ratings.forEach(rating => {
        if (rating.type === 'song') {
            // Find genre for rated song
            Object.entries(MUSIC_DATABASE.songsByGenre).forEach(([genre, songs]) => {
                if (songs.includes(rating.name)) {
                    const adjustment = (rating.rating - 3) * 0.5;
                    const genreSongs = MUSIC_DATABASE.songsByGenre[genre] || [];
                    genreSongs.forEach(song => {
                        if (candidates.has(song)) {
                            const current = candidates.get(song);
                            current.score += adjustment;
                            candidates.set(song, current);
                        }
                    });
                }
            });
        }
    });

    const results = Array.from(candidates.entries())
        .map(([name, data]) => ({
            name,
            reason: data.reasons.slice(0, 2).join(', '),
            matchScore: Math.min(100, Math.round((data.score / 10) * 100))
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);

    return results;
}

function rateRecommendation(type, name, rating) {
    // Remove existing rating for this item
    const existingIndex = appState.ratings.findIndex(r => r.type === type && r.name === name);
    if (existingIndex !== -1) {
        appState.ratings.splice(existingIndex, 1);
    }

    // Add new rating
    appState.ratings.push({ type, name, rating, timestamp: Date.now() });

    saveToStorage();
    renderRecommendations();
    renderRatingHistory();

    const ratingLabels = {
        5: '매우 좋음',
        4: '좋음',
        3: '보통',
        2: '별로',
        1: '완전 별로'
    };
    showToast(`${name}을(를) "${ratingLabels[rating]}"으로 평가했습니다`);
}

// ==================
// Toast Notification
// ==================

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================
// Tab Navigation
// ==================

function setupTabs() {
    // Preferences tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Recommendations tabs
    document.querySelectorAll('.rec-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.recTab;

            document.querySelectorAll('.rec-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.rec-tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// ==================
// Event Listeners
// ==================

function setupEventListeners() {
    // Add artist
    document.getElementById('add-artist-btn').addEventListener('click', addArtist);
    document.getElementById('artist-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addArtist();
    });

    // Add song
    document.getElementById('add-song-btn').addEventListener('click', addSong);
    document.getElementById('song-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSong();
    });

    // Clear all
    document.getElementById('clear-all-btn').addEventListener('click', clearAll);

    // Get recommendations
    document.getElementById('get-recommendations-btn').addEventListener('click', getRecommendations);
    document.getElementById('refresh-recommendations-btn').addEventListener('click', getRecommendations);

    // Edit Modal
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveEdit);
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') closeModal();
    });
    document.getElementById('edit-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit();
    });

    // Login button (initial)
    document.getElementById('login-btn')?.addEventListener('click', openAuthModal);
}

// ==================
// Render All
// ==================

function renderAll() {
    renderGenres();
    renderSelectedGenres();
    renderArtists();
    renderSongs();
    renderRecommendations();
    renderRatingHistory();
}

// ==================
// Initialize App
// ==================

function init() {
    showLoading();

    // Setup UI
    setupTabs();
    setupEventListeners();
    setupAuthModal();

    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        currentUser = user;
        updateUserUI(user);

        if (user) {
            // User logged in - subscribe to Firestore
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
            }

            // Check if user has data, if not initialize
            const userDocRef = db.collection('users').doc(user.uid);
            const docSnap = await userDocRef.get();

            if (!docSnap.exists) {
                // Migrate local storage data to Firestore if any
                loadFromStorage();
                await initializeUserData(user.uid);
                await saveToFirestore();
            }

            subscribeToFirestore(user.uid);
        } else {
            // User logged out - use local storage
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
                unsubscribeFirestore = null;
            }
            loadFromStorage();
            renderAll();
        }

        hideLoading();
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
