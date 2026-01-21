// Data dan State Aplikasi
let appState = {
    currentQueue: 'A101',
    selectedCounter: 1,
    callHistory: [],
    counters: [
        { id: 1, name: 'Loket 1', status: 'available', currentQueue: null },
        { id: 2, name: 'Loket 2', status: 'available', currentQueue: null },
        { id: 3, name: 'Loket 3', status: 'available', currentQueue: null },
        { id: 4, name: 'Loket 4', status: 'available', currentQueue: null },
        { id: 5, name: 'Loket 5', status: 'available', currentQueue: null },
        { id: 6, name: 'Loket 6', status: 'available', currentQueue: null },
        { id: 7, name: 'Loket 7', status: 'available', currentQueue: null },
        { id: 8, name: 'Loket 8', status: 'available', currentQueue: null }
    ],
    totalCallsToday: 0,
    volume: 0.7
};

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Fungsi inisialisasi
function initApp() {
    // Load state dari localStorage jika ada
    loadStateFromStorage();
    
    // Setup elemen UI
    setupQueueControls();
    setupCounterButtons();
    setupCallButton();
    setupVolumeControl();
    
    // Render tampilan awal
    renderCountersGrid();
    renderCountersStatus();
    updateHistoryDisplay();
    updateTotalCalls();
    updateCurrentQueueDisplay();
    
    // Update tampilan loket yang dipilih
    updateSelectedCounterDisplay();
}

// Load state dari localStorage
function loadStateFromStorage() {
    const savedState = localStorage.getItem('queueSystemState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        appState.currentQueue = parsedState.currentQueue || 'A101';
        appState.selectedCounter = parsedState.selectedCounter || 1;
        appState.callHistory = parsedState.callHistory || [];
        appState.totalCallsToday = parsedState.totalCallsToday || 0;
        appState.volume = parsedState.volume || 0.7;
        
        // Update volume control
        document.getElementById('volume-control').value = appState.volume;
        document.getElementById('volume-value').textContent = `${Math.round(appState.volume * 100)}%`;
    }
}

// Simpan state ke localStorage
function saveStateToStorage() {
    localStorage.setItem('queueSystemState', JSON.stringify(appState));
}

// Update tanggal dan waktu
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    document.getElementById('current-date').textContent = dateString;
    document.getElementById('current-time').textContent = timeString;
}

// Setup kontrol antrian
function setupQueueControls() {
    const queueInput = document.getElementById('queue-number');
    const prevBtn = document.getElementById('prev-queue');
    const nextBtn = document.getElementById('next-queue');
    const decrementBtn = document.getElementById('decrement-queue');
    const incrementBtn = document.getElementById('increment-queue');
    const queueDisplay = document.getElementById('queue-display');
    
    // Update dari input
    queueInput.addEventListener('change', function() {
        appState.currentQueue = this.value.toUpperCase();
        updateCurrentQueueDisplay();
    });
    
    // Tombol sebelumnya
    prevBtn.addEventListener('click', function() {
        decreaseQueue();
    });
    
    // Tombol selanjutnya
    nextBtn.addEventListener('click', function() {
        increaseQueue();
    });
    
    // Tombol minus
    decrementBtn.addEventListener('click', function() {
        decreaseQueue();
    });
    
    // Tombol plus
    incrementBtn.addEventListener('click', function() {
        increaseQueue();
    });
}

// Fungsi untuk menambah nomor antrian
function increaseQueue() {
    const queuePrefix = appState.currentQueue.charAt(0);
    let queueNumber = parseInt(appState.currentQueue.substring(1));
    
    if (isNaN(queueNumber)) {
        queueNumber = 101;
    } else {
        queueNumber++;
    }
    
    appState.currentQueue = queuePrefix + queueNumber;
    updateCurrentQueueDisplay();
}

// Fungsi untuk mengurangi nomor antrian
function decreaseQueue() {
    const queuePrefix = appState.currentQueue.charAt(0);
    let queueNumber = parseInt(appState.currentQueue.substring(1));
    
    if (isNaN(queueNumber) || queueNumber <= 101) {
        queueNumber = 101;
    } else {
        queueNumber--;
    }
    
    appState.currentQueue = queuePrefix + queueNumber;
    updateCurrentQueueDisplay();
}

// Update tampilan nomor antrian
function updateCurrentQueueDisplay() {
    document.getElementById('queue-number').value = appState.currentQueue;
    document.getElementById('queue-display').textContent = appState.currentQueue;
    saveStateToStorage();
}

// Setup tombol loket
function setupCounterButtons() {
    // Render grid loket
    renderCountersGrid();
}

// Render grid loket di panel admin
function renderCountersGrid() {
    const countersGrid = document.querySelector('.counters-grid');
    countersGrid.innerHTML = '';
    
    appState.counters.forEach(counter => {
        const counterBtn = document.createElement('button');
        counterBtn.className = `counter-btn ${appState.selectedCounter === counter.id ? 'active' : ''}`;
        counterBtn.textContent = counter.name;
        counterBtn.dataset.id = counter.id;
        
        counterBtn.addEventListener('click', function() {
            appState.selectedCounter = counter.id;
            updateSelectedCounterDisplay();
            renderCountersGrid();
            saveStateToStorage();
        });
        
        countersGrid.appendChild(counterBtn);
    });
}

// Update tampilan loket yang dipilih
function updateSelectedCounterDisplay() {
    // Update kelas aktif pada tombol loket
    const counterBtns = document.querySelectorAll('.counter-btn');
    counterBtns.forEach(btn => {
        if (parseInt(btn.dataset.id) === appState.selectedCounter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Setup tombol panggil
function setupCallButton() {
    const callBtn = document.getElementById('call-queue');
    
    callBtn.addEventListener('click', function() {
        callQueue();
    });
}

// Setup kontrol volume
function setupVolumeControl() {
    const volumeControl = document.getElementById('volume-control');
    const volumeValue = document.getElementById('volume-value');
    
    volumeControl.addEventListener('input', function() {
        appState.volume = parseFloat(this.value);
        volumeValue.textContent = `${Math.round(appState.volume * 100)}%`;
        saveStateToStorage();
    });
}

// Fungsi utama untuk memanggil antrian
function callQueue() {
    const queueNumber = appState.currentQueue;
    const counterId = appState.selectedCounter;
    const counter = appState.counters.find(c => c.id === counterId);
    
    if (!counter) return;
    
    // Update status loket
    counter.status = 'busy';
    counter.currentQueue = queueNumber;
    
    // Tambahkan ke riwayat
    const callTime = new Date();
    const timeString = callTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const callRecord = {
        queue: queueNumber,
        counter: counter.name,
        time: timeString,
        timestamp: callTime.getTime()
    };
    
    appState.callHistory.unshift(callRecord);
    
    // Batasi riwayat hanya 10 item terakhir
    if (appState.callHistory.length > 10) {
        appState.callHistory = appState.callHistory.slice(0, 10);
    }
    
    // Update total panggilan hari ini
    appState.totalCallsToday++;
    
    // Update UI
    updateCalledDisplay(queueNumber, counter.name, timeString);
    updateHistoryDisplay();
    renderCountersStatus();
    updateTotalCalls();
    
    // Putar suara panggilan
    playCallSound(queueNumber, counter.name);
    
    // Simpan state
    saveStateToStorage();
    
    // Set timeout untuk mengubah status loket kembali setelah 2 menit
    setTimeout(() => {
        counter.status = 'available';
        counter.currentQueue = null;
        renderCountersStatus();
        saveStateToStorage();
    }, 120000); // 2 menit
}

// Update tampilan panggilan terakhir
function updateCalledDisplay(queueNumber, counterName, timeString) {
    document.getElementById('called-queue').textContent = queueNumber;
    document.getElementById('called-counter').textContent = counterName;
    document.getElementById('last-call-time').textContent = timeString;
}

// Update tampilan riwayat
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    if (appState.callHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-history">Belum ada riwayat pemanggilan</div>';
        return;
    }
    
    historyList.innerHTML = '';
    
    appState.callHistory.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-queue">${record.queue}</div>
                <div class="history-counter">${record.counter}</div>
            </div>
            <div class="history-time">${record.time}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Update total panggilan
function updateTotalCalls() {
    document.getElementById('queue-total').textContent = appState.totalCallsToday;
}

// Render status loket
function renderCountersStatus() {
    const countersStatus = document.querySelector('.counters-status');
    countersStatus.innerHTML = '';
    
    appState.counters.forEach(counter => {
        const counterStatus = document.createElement('div');
        counterStatus.className = `counter-status ${counter.status === 'busy' ? 'busy' : ''} ${appState.selectedCounter === counter.id ? 'active' : ''}`;
        
        counterStatus.innerHTML = `
            <div class="counter-number">${counter.id}</div>
            <div class="counter-name">${counter.name}</div>
            <div class="counter-current">${counter.currentQueue ? counter.currentQueue : 'Tersedia'}</div>
        `;
        
        countersStatus.appendChild(counterStatus);
    });
}

// Fungsi untuk memutar suara panggilan
function playCallSound(queueNumber, counterName) {
    // Gunakan Web Speech API untuk sintesis suara
    if ('speechSynthesis' in window) {
        // Berhenti bicara yang sedang berlangsung
        speechSynthesis.cancel();
        
        // Buat teks yang akan dibacakan
        const text = `Nomor antrian ${queueNumber.split('').join(' ')}, silahkan menuju ke ${counterName}`;
        
        // Buat utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9; // Kecepatan bicara
        utterance.pitch = 1.0; // Nada suara
        utterance.volume = appState.volume;
        
        // Pilih suara wanita jika tersedia
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.lang.startsWith('id') && 
            voice.name.toLowerCase().includes('female')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        // Mulai berbicara
        speechSynthesis.speak(utterance);
        
        // Jika suara tidak tersedia, gunakan fallback alert
        utterance.onerror = function(event) {
            console.error('Speech synthesis error:', event);
            alert(`Nomor antrian ${queueNumber}, silahkan menuju ke ${counterName}`);
        };
    } else {
        // Fallback jika Web Speech API tidak didukung
        alert(`Nomor antrian ${queueNumber}, silahkan menuju ke ${counterName}`);
    }
}

// Dapatkan suara yang tersedia (perlu dijalankan setelah voices loaded)
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function() {
        console.log('Voices loaded:', speechSynthesis.getVoices().length);
    };
}