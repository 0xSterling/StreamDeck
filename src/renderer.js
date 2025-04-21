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
            }
        });
    });
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        const activeTab = document.querySelector('.nav-link.active').dataset.tab;
        if (activeTab === 'installed') {
            renderInstalledPlugins();
        } else if (activeTab === 'marketplace') {
            renderMarketplacePlugins();
        }
    });
    
    document.getElementById('settings-btn').addEventListener('click', () => {
        console.log('Opening settings...');
    });
    
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        renderMarketplacePlugins(searchTerm);
    });
    
    function createPluginCard(plugin, isInstalled = false) {
        return `
            <div class="plugin-card">
                <div class="plugin-card-header">
                    <div class="plugin-icon">${plugin.icon || '📦'}</div>
                    <div class="plugin-info">
                        <div class="plugin-name">${plugin.name}</div>
                        <div class="plugin-version">v${plugin.version}</div>
                        ${isInstalled ? `<span class="plugin-status status-installed">Installed</span>` : ''}
                    </div>
                </div>
                <div class="plugin-description">${plugin.description}</div>
                <div class="plugin-actions">
                    ${isInstalled ? 
                        `<button class="btn btn-danger btn-small" onclick="uninstallPlugin('${plugin.id}')">Uninstall</button>` :
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
            container.innerHTML = plugins.map(plugin => createPluginCard(plugin, true)).join('');
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
    
    renderInstalledPlugins();
    renderMarketplacePlugins();
});