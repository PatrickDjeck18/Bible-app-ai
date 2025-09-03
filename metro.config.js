// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support.
  isCSSEnabled: true,
});

// Disabling unstable features to resolve module interoperability issues.
// config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = false;

config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'cjs', 'mjs');

// Add path alias resolution for @/*
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@': path.resolve(__dirname),
};

module.exports = config;
