const path = require("path");

module.exports = {
  images: {
    domains: [
      "xfe9abyycupdwfjo.public.blob.vercel-storage.com",
      "example.com", // Example: add more domains if needed
    ],
  },
  swcMinify: true, // Enable SWC minification
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true, // Enable layers feature
    };

    // Modify the rules to handle WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async", // or "webassembly/sync" based on your preference
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};
