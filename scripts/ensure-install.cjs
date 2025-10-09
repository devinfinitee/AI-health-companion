const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Utility helpers
const projectRoot = path.join(__dirname, '..');
const nodeModulesPath = path.join(projectRoot, 'node_modules');
const lockFile = path.join(projectRoot, 'package-lock.json');

function hasModule(mod) {
  try {
    require.resolve(mod, { paths: [projectRoot] });
    return true;
  } catch (_) {
    return false;
  }
}

function runInstall(label = 'npm install') {
  console.log(`Running ${label}...`);
  execSync('npm install', { stdio: 'inherit', cwd: projectRoot });
}

function removeBrokenInstall() {
  if (fs.existsSync(nodeModulesPath)) {
    console.log('Removing potentially broken node_modules...');
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  }
  if (fs.existsSync(lockFile)) {
    console.log('Removing package-lock.json...');
    fs.rmSync(lockFile, { force: true });
  }
}

// Core and common transitive deps that indicate a healthy install
const critical = ['vite', 'tsx', 'esbuild', 'cross-env', 'isexe'];

function healthyInstall() {
  return critical.every(hasModule);
}

try {
  // If node_modules missing or install unhealthy, install/reinstall.
  if (!fs.existsSync(nodeModulesPath) || !healthyInstall()) {
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('node_modules not found.');
    } else {
      console.log('Detected missing dependencies.');
    }

    // First attempt
    runInstall();

    if (!healthyInstall()) {
      console.warn('Dependencies still missing after install. Cleaning and reinstalling...');
      removeBrokenInstall();
      runInstall('clean npm install');
    }
  } else {
    console.log('Dependencies already installed.');
  }
} catch (error) {
  console.error('Failed to ensure dependencies:', error.message);
  process.exit(1);
}
