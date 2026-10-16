import React, { useEffect } from 'react';
import { initIsometricStudio } from './studioEngine.js';
import './styles.css';

const STUDIO_MARKUP = `
  <!-- Top utility bar -->
  <header class="top-bar">
    <div class="top-bar-left">
      <div class="top-bar-logo">NT</div>
      <div class="top-bar-title-wrap">
        <span class="top-bar-title">Neo-Terra <span class="pulse-dot"></span> <span style="font-size: 0.72rem; color: #00f3ff; opacity: 0.85;">// SEC 07-N</span></span>
        <span class="top-bar-subtitle">CYBER-ARCOLOGY SYNTHESIZER &bull; 16&times;16 ORBITAL GRID</span>
      </div>
    </div>

    <div class="top-bar-center">
      <div class="telemetry-bar" id="telemetry-bar">
        <div class="telemetry-chip" id="stat-power"><span style="color: #ffb800;">⚡</span> <span class="val">1,840 MW</span></div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-chip bio" id="stat-bio"><span>🧬</span> <span class="val">98.4%</span></div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-chip pop" id="stat-pop"><span>👥</span> <span class="val">84.2K</span></div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-chip" id="stat-shield"><span style="color: #00ffa3;">🛡️</span> <span class="val" style="color: #00ffa3;">100%</span></div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-chip weather-chip" id="stat-weather" title="Atmospheric Weather System (Click to cycle)">
          <span id="weather-icon">☀️</span> <span class="val" id="weather-name">NOMINAL</span> <span class="weather-countdown" id="weather-countdown">45s</span>
        </div>
      </div>
      <div class="top-bar-status" id="builder-coord-status">SEC 07-N // ATMOSPHERE STABLE</div>
    </div>

    <div class="top-bar-right">
      <select class="env-select weather-select" id="builder-weather-select" title="Simulate Atmospheric Weather Event">
        <option value="auto">🔄 Auto Cycle (45s)</option>
        <option value="clear">☀️ Nominal Orbit</option>
        <option value="acid_rain">🧪 Acidic Rain</option>
        <option value="ion_storm">⚡ Ion Storm</option>
        <option value="solar_flare">🔥 Solar Flare</option>
        <option value="nano_dust">🌪️ Nano-Dust</option>
      </select>
      <select class="env-select" id="builder-env-mode" title="Sector Atmosphere & Lighting Filter">
        <option value="cyber_neon">🌌 Neon 2188</option>
        <option value="orbital_dawn">☀️ Orbital Dawn</option>
        <option value="mars_colony">🪐 Mars Dust</option>
        <option value="matrix_grid">🟢 Matrix Terminal</option>
      </select>
      <button type="button" class="builder-text-btn active" id="builder-sfx-btn" title="Toggle Synthesizer Audio Effects">🔊 SFX</button>
      <button type="button" class="builder-action-btn synth" id="builder-synth-btn" title="Procedurally synthesize a new arcology layout">⚡ Synthesize</button>
      <button type="button" class="builder-text-btn active" id="builder-animate-toggle" title="Toggle simulation animation">▶ Flux</button>
      <button type="button" class="builder-text-btn" id="builder-undo-btn" title="Revert last modification">⟲ Revert</button>
      <div class="zoom-group">
        <button type="button" class="zoom-btn" id="builder-zoom-out" title="Zoom out">&minus;</button>
        <span id="builder-zoom-readout" class="zoom-readout" title="Reset zoom to 100%">100%</span>
        <button type="button" class="zoom-btn" id="builder-zoom-in" title="Zoom in">&plus;</button>
      </div>
      <button type="button" class="builder-text-btn" id="builder-reset-view-btn" title="Center camera on sector">⌖ Align</button>
      <button type="button" class="builder-action-btn primary" id="builder-export-btn">📸 Scan PNG</button>
    </div>
  </header>

  <!-- Left Fixed Control Panel / Sidebar -->
  <aside class="builder-sidebar" id="builder-sidebar">
    <!-- Presets Section -->
    <div class="sidebar-section-presets">
      <div class="sidebar-header">
        <span>Arcology Blueprints</span>
        <span class="tag">SECTOR PRESETS</span>
      </div>
      <div class="preset-pill-grid">
        <button type="button" class="preset-pill active" data-preset="village">Neo-Kyoto 2188</button>
        <button type="button" class="preset-pill" data-preset="riverside">Hydro-Venice 2099</button>
        <button type="button" class="preset-pill" data-preset="market">Syndicate Megaplex</button>
        <button type="button" class="preset-pill" data-preset="spacious">Multi-Biome Arcology</button>
        <button type="button" class="preset-pill span-2" data-preset="meadow">Terraform Clean Slate</button>
      </div>
    </div>

    <!-- Active Brush Card -->
    <div class="sidebar-brush-card" id="sidebar-brush-card">
      <div class="brush-thumb-wrap">
        <img id="sidebar-brush-img" class="brush-thumb pixelated" src="" alt="Active module" />
      </div>
      <div class="brush-info">
        <div class="brush-title" id="sidebar-brush-name">Modular Hab-Unit Alpha</div>
        <div class="brush-meta" id="sidebar-brush-meta">B01 &bull; ARCOLOGY & HABS</div>
        <div class="brush-doc" id="sidebar-brush-doc">Pre-fabricated carbon-composite residential pod with solar shingle collector.</div>
      </div>
    </div>

    <!-- Palette Categories & Search -->
    <div class="sidebar-section-categories">
      <div class="sidebar-header">
        <span>Sector Catalog</span>
        <span class="tag">256 MODULES</span>
      </div>
      <div class="palette-search-wrap">
        <input type="text" id="palette-search-input" class="palette-search-input" placeholder="🔍 Search catalog (e.g. spire, plasma, reactor)..." autocomplete="off" />
      </div>
      <div class="category-pills-wrap">
        <button type="button" class="category-pill active" data-tray-cat="all">All Systems (256)</button>
        <button type="button" class="category-pill" data-tray-cat="building">Arcology & Habs (56)</button>
        <button type="button" class="category-pill" data-tray-cat="road">Maglev & Conduits (36)</button>
        <button type="button" class="category-pill" data-tray-cat="decoration">Tech Relays (12)</button>
        <button type="button" class="category-pill" data-tray-cat="terrain">Terraform Tiers (44)</button>
        <button type="button" class="category-pill" data-tray-cat="biome">Biospheres (58)</button>
        <button type="button" class="category-pill" data-tray-cat="landmark">Megastructures (50)</button>
      </div>
    </div>

    <!-- Tile Palette Grid -->
    <div class="sidebar-tray-grid" id="builder-tray">
      <!-- Populated via JavaScript -->
    </div>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <span><span class="cyber-tag">CLICK:</span> Synthesize &bull; <span class="cyber-tag">SPACE:</span> Pan &bull; <span class="cyber-tag">SCROLL:</span> Zoom &bull; <span class="cyber-tag">ALT:</span> Sample</span>
    </div>
  </aside>

  <!-- Canvas Container -->
  <div id="canvas-container">
    <canvas id="builder-canvas"></canvas>

    <!-- Weather Alert Banner -->
    <div class="weather-alert-banner" id="weather-alert-banner" role="alert">
      <div class="alert-icon-box" id="weather-alert-icon">⚡</div>
      <div class="alert-body">
        <div class="alert-header">
          <span class="alert-badge">ATMOSPHERIC EVENT</span>
          <span class="alert-title" id="weather-alert-title">ION STORM INCOMING</span>
        </div>
        <div class="alert-desc" id="weather-alert-desc">High-energy electromagnetic discharge in sector. Shield matrix compensating.</div>
      </div>
      <div class="alert-impact" id="weather-alert-impact">⚡ POWER FLUX &bull; 🛡️ SHIELDS -25%</div>
      <button type="button" class="alert-close-btn" id="weather-alert-dismiss" title="Dismiss Alert">&times;</button>
    </div>

    <div class="canvas-hud-overlay">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>
      <div class="hud-watermark" id="hud-watermark">SEC 07-N // ORBITAL SENSOR FEED // STARDATE 2188.4</div>
    </div>
  </div>

  <!-- Snapshot Modal Dialog -->
  <div class="snapshot-modal-backdrop" id="snapshot-modal" role="dialog" aria-modal="true" aria-labelledby="snapshot-modal-title">
    <div class="snapshot-modal-card">
      <div class="snapshot-modal-header">
        <div>
          <h2 class="snapshot-modal-title" id="snapshot-modal-title">Sector Scan Archived</h2>
          <p class="snapshot-modal-subtitle">2,176 &times; 1,216 PIXELS &bull; LOSSLESS QUANTUM BITMAP &bull; 1:1 ORBITAL ACCURACY</p>
        </div>
        <button type="button" class="snapshot-modal-close" id="snapshot-modal-close" title="Close snapshot dialog">&times;</button>
      </div>

      <div class="snapshot-modal-body">
        <img id="snapshot-modal-img" class="snapshot-preview-img pixelated" alt="Sector 07-N Arcology scan" />
      </div>

      <div class="snapshot-modal-footer">
        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <a id="snapshot-modal-download-link" class="snapshot-action-btn primary" download="sector-07n-arcology-2188.png">Download PNG</a>
          <button type="button" id="snapshot-modal-copy-btn" class="snapshot-action-btn">Copy to Clipboard</button>
          <a id="snapshot-modal-open-link" class="snapshot-action-link" target="_blank" rel="noopener">Open Lossless File &rarr;</a>
        </div>
        <button type="button" class="snapshot-action-link" id="snapshot-modal-dismiss-btn">Dismiss</button>
      </div>
    </div>
  </div>
`;

export default function App() {
  useEffect(() => {
    initIsometricStudio();
  }, []);

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      dangerouslySetInnerHTML={{ __html: STUDIO_MARKUP }}
    />
  );
}
