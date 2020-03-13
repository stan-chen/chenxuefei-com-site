/**
 * 该函数在配置的时候提交路径到百度，需要sitemap
 */

var fs = require('fs');
var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;

var http = require('http');

var args = process.argv.splice(2);

if (args.length < 2) {
  console.log('参数错误, ${site-map.xml} ${push-token}');
  process.exit();
}

var sitemap_path = args[0];

var xml = fs.readFileSync(sitemap_path, 'utf-8');

var doc = new dom().parseFromString(xml);

var select = xpath.useNamespaces({
  urlsetxml: 'http://www.sitemaps.org/schemas/sitemap/0.9',
});

var nodes = select('//urlsetxml:loc/text()', doc);

var push_string = '';
for (let x in nodes) {
  push_string += nodes[x].data + '\n';
}

var options = {
  host: 'data.zz.baidu.com',
  path: `/urls?site=https://www.chenxuefei.com&token=${args[1]}`,
  method: 'POST',
  headers: {
    Host: 'data.zz.baidu.com',
    'Content-Type': 'text/plain',
    'Content-Length': push_string.length,
  },
};
console.log('现在开始提交' + nodes.length + '个站点');
console.log(options);

var req = http.request(options, function(res) {
  if (res.statusCode === 200) {
    console.log('提交站点到百度成功!');
    console.log('本次提交站点' + nodes.length + '个!');
  } else {
    console.log('提交站点到百度失败! STATUS: ' + res.statusCode);
  }
  res.setEncoding('utf8');
  res.on('data', function(data) {
    console.log('返回代码:\n', data); //一段html代码
  });
});

req.write(push_string);
req.end();
