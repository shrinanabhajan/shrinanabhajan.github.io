(function () {
  "use strict";

  const STORAGE_KEY = 'bhajan_app_version';
  const VERSION_PATH = './version.json';
  const DATA_SCRIPTS = [
    './scripts/indexdata.js',
    './scripts/ntn.js',
    './scripts/b1.js',
    './scripts/b2.js',
    './scripts/dt.js',
    './scripts/mv.js',
    './scripts/index.js'
  ];

  function normalizeVersion(value) {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const numeric = Number(String(value).replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function buildAssetUrl(path, version) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}v=${encodeURIComponent(version)}`;
  }

  async function loadAllDataScripts(version) {
    const fetchedScripts = await Promise.all(DATA_SCRIPTS.map(async function (assetPath) {
      const url = buildAssetUrl(assetPath, version);
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch app data: ' + url);
      }

      return response.text();
    }));

    for (const scriptText of fetchedScripts) {
      window.eval(scriptText);
    }
  }

  async function bootstrapVersion() {
    const storedVersion = localStorage.getItem(STORAGE_KEY) || '0';
    const now = new Date().getTime();
    const versionUrl = `${VERSION_PATH}?t=${now}`;

    try {
      const response = await fetch(versionUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });

      if (!response.ok) {
        throw new Error('Unable to fetch version metadata');
      }

      const data = await response.json();
      const serverVersion = String(data.version || '0');

      if (normalizeVersion(serverVersion) > normalizeVersion(storedVersion)) {
        await loadAllDataScripts(serverVersion);
        localStorage.setItem(STORAGE_KEY, serverVersion);
        window.BHAJAN_APP_VERSION = serverVersion;
        return;
      }

      window.BHAJAN_APP_VERSION = storedVersion;
      return;
    } catch (error) {
      console.warn('Version sync failed; keeping the current app state.', error);
      window.BHAJAN_APP_VERSION = storedVersion;
    }
  }

  window.BHAJAN_APP_VERSION = localStorage.getItem(STORAGE_KEY) || '0';
  bootstrapVersion();
}());
