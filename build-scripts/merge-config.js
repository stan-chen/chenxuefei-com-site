'use strict';
/*
Some Merge Config From System Env
 */

const YAML = require('js-yaml');
const url = require('url');
const fs = require('fs');

const envConfig = {
  enable: true,
  oss_url: process.env.OSS_URL,
  oss_root: process.env.OSS_ROOT,
  oss_acid: process.env.OSS_ACID,
  oss_ackey: process.env.OSS_ACKEY,
  oss_region: process.env.OSS_REGION,
  oss_bucket: process.env.OSS_BUCKET,
  oss_internal: process.env.OSS_INTERNAL === 'true',
};

for (let k in envConfig) {
  if (envConfig[k] === undefined) {
    envConfig[k] = '';
    envConfig.enable = false;
  }
}

let aliConfigStr = YAML.safeDump(
  {
    asset_oss: envConfig,
  },
  {
    sortKeys: true,
  }
);

console.log(aliConfigStr);
console.log('\n');

let themeConfig = {
  footer: {
    beian: {
      icp: process.env.BEIAN_ICP || '',
      enable: !!process.env.BEIAN_ICP,
    },
  },
};

if (envConfig.enable) {
  const origThemeConfig = YAML.safeLoad(
    fs.readFileSync('themes/next/_config.yml')
  );
  let prefix = url.resolve(envConfig.oss_url, envConfig.oss_root);
  const js = url.resolve(prefix, origThemeConfig.js);
  const css = url.resolve(prefix, origThemeConfig.css);
  const images = url.resolve(prefix, origThemeConfig.images);
  const vendors = {
    _internal: url.resolve(prefix, origThemeConfig.vendors._internal),
  };
  themeConfig = {
    ...themeConfig,
    ...{ js, css, images, vendors },
  };
}

console.log(
  YAML.safeDump(
    {
      theme_config: themeConfig,
    },
    {
      sortKeys: true,
    }
  )
);
