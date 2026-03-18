// Farm Manager App with Claude API Integration

class FarmManager {
    constructor() {
        this.apiKey = this.getApiKey();
        this.init();
    }

    // Method to retrieve API key from browser storage
    getApiKey() {
        return localStorage.getItem('claudeApiKey') || null;
    }

    // Method to set API key to browser storage
    setApiKey(key) {
        localStorage.setItem('claudeApiKey', key);
        this.apiKey = key;
    }

    // Method to initialize app
    init() {
        this.setupSettingsPage();
        this.checkApiKey();
    }

    // Method to setup the Settings tab/page
    setupSettingsPage() {
        const settingsTab = document.createElement('div');
        settingsTab.innerHTML = `<h2>Settings</h2>
                                <input type='password' id='apiKeyInput' placeholder='Enter Claude API Key' />
                                <button id='saveApiKeyBtn'>Save API Key</button>
                                <p id='apiKeyStatus'></p>`;
        document.body.appendChild(settingsTab);

        // Event listener for saving API key
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
            const key = document.getElementById('apiKeyInput').value;
            this.setApiKey(key);
            this.checkApiKey();
        });
    }

    // Method to check if API key is set and update status
    checkApiKey() {
        const status = document.getElementById('apiKeyStatus');
        if (this.apiKey) {
            status.innerText = 'API Key is set.';
        } else {
            status.innerText = 'No API Key set.';
        }
    }
}

const farmManager = new FarmManager();