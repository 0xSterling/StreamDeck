class PluginManager {
    constructor() {
        this.installedPlugins = new Map();
        this.marketplacePlugins = [];
        this.init();
    }

    init() {
        this.loadInstalledPlugins();
        this.loadMarketplaceData();
    }

    loadInstalledPlugins() {
        const mockPlugins = [
            {
                id: 'clock-widget',
                name: 'Clock Widget',
                version: '1.2.3',
                description: 'Display current time and date on your StreamDeck',
                author: 'ClockMaster',
                icon: '🕐',
                status: 'installed',
                lastUpdated: '2025-04-15',
                latestVersion: '1.3.0',
                hasUpdate: true
            },
            {
                id: 'spotify-control',
                name: 'Spotify Controller',
                version: '2.1.0',
                description: 'Control Spotify playback directly from StreamDeck',
                author: 'MusicDev',
                icon: '🎵',
                status: 'installed',
                lastUpdated: '2025-04-14',
                latestVersion: '2.1.0',
                hasUpdate: false
            }
        ];

        mockPlugins.forEach(plugin => {
            this.installedPlugins.set(plugin.id, plugin);
        });
    }

    loadMarketplaceData() {
        this.marketplacePlugins = [
            {
                id: 'weather-display',
                name: 'Weather Display',
                version: '1.0.5',
                description: 'Show current weather conditions and forecast',
                author: 'WeatherWiz',
                icon: '🌤️',
                downloads: 15420,
                rating: 4.8,
                price: 'free',
                category: 'Utilities'
            },
            {
                id: 'cpu-monitor',
                name: 'CPU Monitor',
                version: '3.2.1',
                description: 'Real-time CPU usage and temperature monitoring',
                author: 'SysAdmin Pro',
                icon: '💻',
                downloads: 8743,
                rating: 4.6,
                price: 'free',
                category: 'System'
            },
            {
                id: 'discord-status',
                name: 'Discord Status',
                version: '1.4.2',
                description: 'Quick Discord status and server controls',
                author: 'DiscordDev',
                icon: '💬',
                downloads: 23156,
                rating: 4.9,
                price: '$2.99',
                category: 'Social'
            },
            {
                id: 'twitch-control',
                name: 'Twitch Stream Control',
                version: '2.3.0',
                description: 'Control your Twitch stream with one-click actions',
                author: 'StreamMaster',
                icon: '📺',
                downloads: 12847,
                rating: 4.7,
                price: 'free',
                category: 'Streaming'
            },
            {
                id: 'obs-scene-switcher',
                name: 'OBS Scene Switcher',
                version: '1.8.3',
                description: 'Quick scene switching for OBS Studio',
                author: 'ObsDev',
                icon: '🎬',
                downloads: 31245,
                rating: 4.9,
                price: 'free',
                category: 'Streaming'
            },
            {
                id: 'timer-stopwatch',
                name: 'Timer & Stopwatch',
                version: '1.2.1',
                description: 'Customizable timer and stopwatch for productivity',
                author: 'TimeKeeper',
                icon: '⏱️',
                downloads: 9654,
                rating: 4.4,
                price: 'free',
                category: 'Productivity'
            }
        ];
    }

    getInstalledPlugins() {
        return Array.from(this.installedPlugins.values());
    }

    getMarketplacePlugins() {
        return this.marketplacePlugins;
    }

    searchPlugins(query, category = 'all') {
        const searchTerm = query.toLowerCase();
        let filtered = this.marketplacePlugins;
        
        if (category !== 'all') {
            filtered = filtered.filter(plugin => plugin.category === category);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(plugin => 
                plugin.name.toLowerCase().includes(searchTerm) ||
                plugin.description.toLowerCase().includes(searchTerm) ||
                plugin.author.toLowerCase().includes(searchTerm) ||
                plugin.category.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    getCategories() {
        const categories = [...new Set(this.marketplacePlugins.map(plugin => plugin.category))];
        return categories.sort();
    }

    installPlugin(pluginId) {
        const plugin = this.marketplacePlugins.find(p => p.id === pluginId);
        if (plugin) {
            const installedPlugin = {
                ...plugin,
                status: 'installed',
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            this.installedPlugins.set(pluginId, installedPlugin);
            return true;
        }
        return false;
    }

    uninstallPlugin(pluginId) {
        return this.installedPlugins.delete(pluginId);
    }

    getPluginsWithUpdates() {
        return Array.from(this.installedPlugins.values()).filter(plugin => plugin.hasUpdate);
    }

    updatePlugin(pluginId) {
        const plugin = this.installedPlugins.get(pluginId);
        if (plugin && plugin.hasUpdate) {
            plugin.version = plugin.latestVersion;
            plugin.hasUpdate = false;
            plugin.lastUpdated = new Date().toISOString().split('T')[0];
            return true;
        }
        return false;
    }

    checkForUpdates() {
        this.installedPlugins.forEach((plugin, id) => {
            const marketPlugin = this.marketplacePlugins.find(p => p.id === id);
            if (marketPlugin && this.compareVersions(marketPlugin.version, plugin.version) > 0) {
                plugin.latestVersion = marketPlugin.version;
                plugin.hasUpdate = true;
            }
        });
    }

    compareVersions(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            
            if (aPart > bPart) return 1;
            if (aPart < bPart) return -1;
        }
        return 0;
    }
}

const pluginManager = new PluginManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PluginManager, pluginManager };
} else {
    window.pluginManager = pluginManager;
}