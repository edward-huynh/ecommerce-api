# Security Configuration

Tài liệu này mô tả các cấu hình bảo mật đã được triển khai trong dự án E-commerce API.

## 🔒 Security Headers

### Helmet Middleware
Dự án sử dụng [Helmet](https://helmetjs.github.io/) để tự động thêm các security headers quan trọng:

#### Content Security Policy (CSP)
```javascript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    scriptSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}
```

#### HTTP Strict Transport Security (HSTS)
```javascript
hsts: {
  maxAge: 31536000, // 1 năm
  includeSubDomains: true,
  preload: true,
}
```

#### Các Headers Khác
- **X-Frame-Options**: `DENY` - Ngăn chặn clickjacking
- **X-Content-Type-Options**: `nosniff` - Ngăn chặn MIME type sniffing
- **X-XSS-Protection**: Bảo vệ khỏi XSS attacks
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Cross-Origin-Opener-Policy**: `same-origin`
- **Cross-Origin-Resource-Policy**: `same-origin`
- **X-DNS-Prefetch-Control**: `off`
- **X-Download-Options**: `noopen`
- **X-Permitted-Cross-Domain-Policies**: `none`

## 🌐 HTTPS Enforcement

### Production HTTPS Redirect
Trong môi trường production, tất cả HTTP requests sẽ được tự động redirect sang HTTPS:

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    if (proto !== 'https') {
      return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
    }
    next();
  });
}
```

## 🔧 CORS Configuration

CORS được cấu hình với các giới hạn bảo mật:

```javascript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### Environment Variables
Thêm vào file `.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🧪 Security Testing

### Kiểm Tra Security Headers
Chạy script kiểm tra security headers:

```bash
# Sử dụng npm script
pnpm run security:check

# Hoặc chạy trực tiếp
node scripts/check-security-headers.js
```

Script sẽ kiểm tra:
- ✅ Tất cả security headers cần thiết
- ❌ Headers bị thiếu
- ⚠️ Headers không nên hiển thị (như X-Powered-By)
- 📊 Điểm số bảo mật tổng thể

### Expected Output
```
🔒 Security Headers Check Report
================================

✅ PASSED HEADERS:
  ✓ Content Security Policy (content-security-policy)
  ✓ HTTP Strict Transport Security (strict-transport-security)
  ✓ X-Frame-Options (x-frame-options)
  ... (và các headers khác)

📊 SECURITY SCORE: 100.0%
🎉 Excellent security configuration!
```

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Đảm bảo `NODE_ENV=production`
- [ ] Cấu hình HTTPS certificate
- [ ] Thiết lập `ALLOWED_ORIGINS` với domains thực tế
- [ ] Kiểm tra CSP directives phù hợp với ứng dụng frontend
- [ ] Test security headers trên production domain

### Load Balancer/Proxy Configuration
Nếu sử dụng load balancer hoặc reverse proxy (nginx, CloudFlare, etc.):
- Đảm bảo `X-Forwarded-Proto` header được set đúng
- Có thể cần điều chỉnh HTTPS redirect logic
- Kiểm tra không bị duplicate security headers

## 📚 Additional Security Measures

### Đã Triển Khai
- ✅ JWT Authentication với secure configuration
- ✅ Password hashing với bcrypt
- ✅ Input validation với class-validator
- ✅ Role-based access control
- ✅ Security headers với Helmet
- ✅ HTTPS enforcement
- ✅ Secure CORS configuration

### Khuyến Nghị Thêm
- 🔄 Rate limiting (express-rate-limit)
- 🔄 Request logging và monitoring
- 🔄 API versioning
- 🔄 Input sanitization
- 🔄 Database query optimization và protection
- 🔄 Secrets management (AWS Secrets Manager, HashiCorp Vault)

## 🔗 References

- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/helmet)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)