class ProgressTracker {
    constructor() {
        this.activeDownloads = new Map();
        this.createProgressContainer();
    }

    createProgressContainer() {
        const container = document.createElement('div');
        container.id = 'progress-container';
        container.className = 'progress-container';
        document.body.appendChild(container);
    }

    startDownload(pluginId, pluginName) {
        const progressItem = {
            id: pluginId,
            name: pluginName,
            progress: 0,
            status: 'downloading'
        };
        
        this.activeDownloads.set(pluginId, progressItem);
        this.renderProgressItem(progressItem);
        
        // Simulate download progress
        this.simulateProgress(pluginId);
    }

    simulateProgress(pluginId) {
        const progressItem = this.activeDownloads.get(pluginId);
        if (!progressItem) return;

        const interval = setInterval(() => {
            progressItem.progress += Math.random() * 15 + 5;
            
            if (progressItem.progress >= 100) {
                progressItem.progress = 100;
                progressItem.status = 'completed';
                clearInterval(interval);
                
                setTimeout(() => {
                    this.removeDownload(pluginId);
                }, 2000);
            }
            
            this.updateProgressItem(progressItem);
        }, 200 + Math.random() * 300);
    }

    updateProgressItem(progressItem) {
        const element = document.getElementById(`progress-${progressItem.id}`);
        if (element) {
            const progressBar = element.querySelector('.progress-bar');
            const statusText = element.querySelector('.progress-status');
            
            progressBar.style.width = `${progressItem.progress}%`;
            
            if (progressItem.status === 'completed') {
                statusText.textContent = 'Completed';
                element.classList.add('completed');
            } else {
                statusText.textContent = `${Math.round(progressItem.progress)}%`;
            }
        }
    }

    renderProgressItem(progressItem) {
        const container = document.getElementById('progress-container');
        const element = document.createElement('div');
        element.id = `progress-${progressItem.id}`;
        element.className = 'progress-item';
        
        element.innerHTML = `
            <div class="progress-info">
                <span class="progress-name">${progressItem.name}</span>
                <span class="progress-status">${Math.round(progressItem.progress)}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar" style="width: ${progressItem.progress}%"></div>
            </div>
        `;
        
        container.appendChild(element);
    }

    removeDownload(pluginId) {
        const element = document.getElementById(`progress-${pluginId}`);
        if (element) {
            element.remove();
        }
        this.activeDownloads.delete(pluginId);
        
        // Hide container if no active downloads
        if (this.activeDownloads.size === 0) {
            document.getElementById('progress-container').style.display = 'none';
        }
    }

    showContainer() {
        document.getElementById('progress-container').style.display = 'block';
    }
}

const progressTracker = new ProgressTracker();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressTracker, progressTracker };
} else {
    window.progressTracker = progressTracker;
}