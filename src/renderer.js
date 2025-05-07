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
        const category = document.getElementById('category-filter').value;
        renderMarketplacePlugins(searchTerm, category);
    });
    
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const searchTerm = document.getElementById('search-input').value;
        const category = e.target.value;
        renderMarketplacePlugins(searchTerm, category);
    });
    
    function createPluginCard(plugin, isInstalled = false, showUpdate = false) {
        return `
            <div class="plugin-card">
                <div class="plugin-card-header">
                    <div class="plugin-icon">${plugin.icon || '📦'}</div>
                    <div class="plugin-info">
                        <div class="plugin-name" onclick="showPluginDetails('${plugin.id}')">${plugin.name}</div>
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
    
    function renderMarketplacePlugins(searchTerm = '', category = 'all') {
        const container = document.getElementById('marketplace-plugins');
        const plugins = pluginManager.searchPlugins(searchTerm, category);
        
        if (plugins.length === 0) {
            container.innerHTML = '<p class="empty-state">No plugins found.</p>';
        } else {
            container.innerHTML = plugins.map(plugin => createPluginCard(plugin, false)).join('');
        }
    }
    
    function populateCategories() {
        const categorySelect = document.getElementById('category-filter');
        const categories = pluginManager.getCategories();
        
        categorySelect.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
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
    
    function showPluginDetails(pluginId) {
        const plugin = pluginManager.getInstalledPlugins().find(p => p.id === pluginId) ||
                      pluginManager.getMarketplacePlugins().find(p => p.id === pluginId);
        
        if (!plugin) return;
        
        document.getElementById('plugin-detail-name').textContent = plugin.name;
        document.getElementById('plugin-detail-icon').textContent = plugin.icon || '📦';
        document.getElementById('plugin-detail-title').textContent = plugin.name;
        document.getElementById('plugin-detail-author').textContent = plugin.author;
        document.getElementById('plugin-detail-version').textContent = `v${plugin.version}`;
        document.getElementById('plugin-detail-downloads').textContent = plugin.downloads ? `• ${plugin.downloads.toLocaleString()} downloads` : '';
        document.getElementById('plugin-detail-rating').textContent = plugin.rating ? `• ⭐ ${plugin.rating}` : '';
        document.getElementById('plugin-detail-desc').textContent = plugin.description;
        
        const actionBtn = document.getElementById('plugin-detail-action');
        const isInstalled = pluginManager.getInstalledPlugins().some(p => p.id === pluginId);
        
        if (isInstalled) {
            actionBtn.textContent = 'Uninstall';
            actionBtn.className = 'btn btn-danger';
            actionBtn.onclick = () => {
                uninstallPlugin(pluginId);
                closePluginDetailsModal();
            };
        } else {
            actionBtn.textContent = 'Install';
            actionBtn.className = 'btn btn-primary';
            actionBtn.onclick = () => {
                installPlugin(pluginId);
                closePluginDetailsModal();
            };
        }
        
        document.getElementById('plugin-details-modal').classList.add('show');
    }
    
    function closePluginDetailsModal() {
        document.getElementById('plugin-details-modal').classList.remove('show');
    }
    
    document.getElementById('close-plugin-details').addEventListener('click', closePluginDetailsModal);
    
    window.showPluginDetails = showPluginDetails;
    
    window.addEventListener('click', (e) => {
        const settingsModal = document.getElementById('settings-modal');
        const detailsModal = document.getElementById('plugin-details-modal');
        if (e.target === settingsModal) {
            closeSettingsModal();
        } else if (e.target === detailsModal) {
            closePluginDetailsModal();
        }
    });
    
    populateCategories();
    renderInstalledPlugins();
    renderMarketplacePlugins();
});