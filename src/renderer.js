document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            link.classList.add('active');
            const tabId = link.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            if (link.dataset.tab === 'installed') {
                renderInstalledPlugins();
            } else if (link.dataset.tab === 'marketplace') {
                renderMarketplacePlugins();
            } else if (link.dataset.tab === 'updates') {
                renderUpdatesTab();
            }
        });
    });
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        const activeTab = document.querySelector('.nav-link.active').dataset.tab;
        if (activeTab === 'installed') {
            renderInstalledPlugins();
        } else if (activeTab === 'marketplace') {
            renderMarketplacePlugins();
        } else if (activeTab === 'updates') {
            pluginManager.checkForUpdates();
            renderUpdatesTab();
        }
    });
    
    document.getElementById('settings-btn').addEventListener('click', () => {
        openSettingsModal();
    });
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        renderMarketplacePlugins(searchTerm);
    });
    
    function createPluginCard(plugin, isInstalled = false, showUpdate = false) {
        return `
            <div class="plugin-card">
                <div class="plugin-card-header">
                    <div class="plugin-icon">${plugin.icon || '📦'}</div>
                    <div class="plugin-info">
                        <div class="plugin-name">${plugin.name}</div>
                        <div class="plugin-version">v${plugin.version}${showUpdate && plugin.hasUpdate ? ` → v${plugin.latestVersion}` : ''}</div>
                        ${isInstalled ? `<span class="plugin-status status-installed">Installed</span>` : ''}
                        ${showUpdate && plugin.hasUpdate ? `<span class="plugin-status status-update-available">Update Available</span>` : ''}
                    </div>
                </div>
                <div class="plugin-description">${plugin.description}</div>
                <div class="plugin-actions">
                    ${isInstalled ? 
                        (plugin.hasUpdate ? 
                            `<button class="btn btn-primary btn-small" onclick="updatePlugin('${plugin.id}')">Update</button>
                             <button class="btn btn-danger btn-small" onclick="uninstallPlugin('${plugin.id}')">Uninstall</button>` :
                            `<button class="btn btn-danger btn-small" onclick="uninstallPlugin('${plugin.id}')">Uninstall</button>`
                        ) :
                        `<button class="btn btn-primary btn-small" onclick="installPlugin('${plugin.id}')">Install</button>`
                    }
                </div>
            </div>
        `;
    }
    
    function renderInstalledPlugins() {
        const container = document.getElementById('installed-plugins');
        const plugins = pluginManager.getInstalledPlugins();
        
        if (plugins.length === 0) {
            container.innerHTML = '<p class="empty-state">No plugins installed yet.</p>';
        } else {
            container.innerHTML = plugins.map(plugin => createPluginCard(plugin, true, true)).join('');
        }
    }
    
    function renderMarketplacePlugins(searchTerm = '') {
        const container = document.getElementById('marketplace-plugins');
        let plugins;
        
        if (searchTerm.trim()) {
            plugins = pluginManager.searchPlugins(searchTerm);
        } else {
            plugins = pluginManager.getMarketplacePlugins();
        }
        
        if (plugins.length === 0) {
            container.innerHTML = '<p class="empty-state">No plugins found.</p>';
        } else {
            container.innerHTML = plugins.map(plugin => createPluginCard(plugin, false)).join('');
        }
    }
    
    window.installPlugin = (pluginId) => {
        if (pluginManager.installPlugin(pluginId)) {
            renderMarketplacePlugins();
            renderInstalledPlugins();
        }
    };
    
    window.uninstallPlugin = (pluginId) => {
        if (pluginManager.uninstallPlugin(pluginId)) {
            renderInstalledPlugins();
        }
    };

    window.updatePlugin = (pluginId) => {
        if (pluginManager.updatePlugin(pluginId)) {
            renderInstalledPlugins();
            renderUpdatesTab();
        }
    };

    function renderUpdatesTab() {
        const container = document.getElementById('update-plugins');
        const plugins = pluginManager.getPluginsWithUpdates();
        
        if (plugins.length === 0) {
            container.innerHTML = '<p class="empty-state">All plugins are up to date.</p>';
        } else {
            container.innerHTML = plugins.map(plugin => createPluginCard(plugin, true, true)).join('');
        }
    }
    
    function openSettingsModal() {
        const modal = document.getElementById('settings-modal');
        loadSettings();
        modal.classList.add('show');
    }
    
    function closeSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.classList.remove('show');
    }
    
    function loadSettings() {
        const settings = getSettings();
        document.getElementById('plugin-dir').value = settings.pluginDir;
        document.getElementById('auto-update').checked = settings.autoUpdate;
        document.getElementById('notifications').checked = settings.notifications;
    }
    
    function getSettings() {
        const defaultSettings = {
            pluginDir: process.env.HOME + '/StreamDeck/Plugins',
            autoUpdate: true,
            notifications: true
        };
        
        try {
            const saved = localStorage.getItem('streamdeck-settings');
            return saved ? {...defaultSettings, ...JSON.parse(saved)} : defaultSettings;
        } catch {
            return defaultSettings;
        }
    }
    
    function saveSettings() {
        const settings = {
            pluginDir: document.getElementById('plugin-dir').value,
            autoUpdate: document.getElementById('auto-update').checked,
            notifications: document.getElementById('notifications').checked
        };
        
        localStorage.setItem('streamdeck-settings', JSON.stringify(settings));
        closeSettingsModal();
    }
    
    document.getElementById('close-settings').addEventListener('click', closeSettingsModal);
    document.getElementById('cancel-settings').addEventListener('click', closeSettingsModal);
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    document.getElementById('browse-dir').addEventListener('click', () => {
        const { dialog } = require('@electron/remote');
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(result => {
            if (!result.canceled) {
                document.getElementById('plugin-dir').value = result.filePaths[0];
            }
        });
    });
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('settings-modal');
        if (e.target === modal) {
            closeSettingsModal();
        }
    });
    
    renderInstalledPlugins();
    renderMarketplacePlugins();
});