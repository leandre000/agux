const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Merge aliases if already defined, or create a new one
  config.resolver.alias = {
    ...(config.resolver.alias || {}),
    "@": path.resolve(__dirname),
  };

  // Optional: Add file extensions if needed, to avoid resolution problems
  config.resolver.sourceExts = [
    ...(config.resolver.sourceExts || []),
    "jsx",
    "js",
    "ts",
    "tsx",
    "json",
  ];

  return config;
})();
