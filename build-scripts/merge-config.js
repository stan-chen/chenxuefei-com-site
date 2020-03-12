'use strict';

const YAML = require('js-yaml');

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
