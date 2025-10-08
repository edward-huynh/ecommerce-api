#!/usr/bin/env node

const http = require('http');

const REQUIRED_HEADERS = {
  'content-security-policy': 'Content Security Policy',
  'strict-transport-security': 'HTTP Strict Transport Security',
  'x-frame-options': 'X-Frame-Options',
  'x-content-type-options': 'X-Content-Type-Options',
  'referrer-policy': 'Referrer Policy',
  'cross-origin-opener-policy': 'Cross-Origin-Opener-Policy',
  'cross-origin-resource-policy': 'Cross-Origin-Resource-Policy',
  'x-dns-prefetch-control': 'X-DNS-Prefetch-Control',
  'x-download-options': 'X-Download-Options',
  'x-permitted-cross-domain-policies': 'X-Permitted-Cross-Domain-Policies'
};

const FORBIDDEN_HEADERS = [
  'x-powered-by',
  'server'
];

function checkSecurityHeaders(host = 'localhost', port = 8080, path = '/api') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'HEAD'
    };

    const req = http.request(options, (res) => {
      const headers = res.headers;
      const results = {
        passed: [],
        failed: [],
        forbidden: [],
        score: 0
      };

      // Kiểm tra các headers bắt buộc
      Object.keys(REQUIRED_HEADERS).forEach(header => {
        if (headers[header]) {
          results.passed.push({
            header: header,
            name: REQUIRED_HEADERS[header],
            value: headers[header]
          });
        } else {
          results.failed.push({
            header: header,
            name: REQUIRED_HEADERS[header],
            reason: 'Header not found'
          });
        }
      });

      // Kiểm tra các headers bị cấm
      FORBIDDEN_HEADERS.forEach(header => {
        if (headers[header]) {
          results.forbidden.push({
            header: header,
            value: headers[header],
            reason: 'Header should be hidden for security'
          });
        }
      });

      // Tính điểm
      const totalRequired = Object.keys(REQUIRED_HEADERS).length;
      const passedCount = results.passed.length;
      const forbiddenCount = results.forbidden.length;
      
      results.score = Math.max(0, ((passedCount - forbiddenCount) / totalRequired) * 100);

      resolve(results);
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function printResults(results) {
  console.log('\n🔒 Security Headers Check Report');
  console.log('================================\n');

  console.log('✅ PASSED HEADERS:');
  results.passed.forEach(item => {
    console.log(`  ✓ ${item.name} (${item.header})`);
    console.log(`    Value: ${item.value.substring(0, 80)}${item.value.length > 80 ? '...' : ''}\n`);
  });

  if (results.failed.length > 0) {
    console.log('❌ FAILED HEADERS:');
    results.failed.forEach(item => {
      console.log(`  ✗ ${item.name} (${item.header})`);
      console.log(`    Reason: ${item.reason}\n`);
    });
  }

  if (results.forbidden.length > 0) {
    console.log('⚠️  FORBIDDEN HEADERS FOUND:');
    results.forbidden.forEach(item => {
      console.log(`  ⚠️  ${item.header}: ${item.value}`);
      console.log(`    Reason: ${item.reason}\n`);
    });
  }

  console.log(`📊 SECURITY SCORE: ${results.score.toFixed(1)}%`);
  
  if (results.score >= 90) {
    console.log('🎉 Excellent security configuration!');
  } else if (results.score >= 70) {
    console.log('👍 Good security configuration, but can be improved.');
  } else {
    console.log('⚠️  Security configuration needs improvement.');
  }

  return results.score >= 70;
}

// Main execution
async function main() {
  try {
    console.log('🔍 Checking security headers...');
    const results = await checkSecurityHeaders();
    const passed = printResults(results);
    
    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.error('❌ Error checking security headers:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:8080');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkSecurityHeaders, printResults };