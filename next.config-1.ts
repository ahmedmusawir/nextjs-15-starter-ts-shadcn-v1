import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.scss$/, // Matches SCSS files
      use: [
        "style-loader", // Injects styles into DOM
        "css-loader", // Resolves CSS imports
        {
          loader: "sass-loader", // Compiles SCSS to CSS
          options: {
            implementation: require("sass"), // Use modern Dart Sass
          },
        },
      ],
    });

    return config; // Return the modified config
  },
};

export default nextConfig;
