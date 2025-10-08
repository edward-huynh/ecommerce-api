import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Security Headers (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same security configuration as in main.ts
    const helmet = require('helmet');
    
    app.use(helmet({
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
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      hidePoweredBy: true,
      dnsPrefetchControl: {
        allow: false,
      },
      ieNoOpen: true,
    }));

    app.enableCors({
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Security Headers', () => {
    it('should include Content-Security-Policy header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['content-security-policy']).toBeDefined();
          expect(res.headers['content-security-policy']).toContain("default-src 'self'");
        });
    });

    it('should include Strict-Transport-Security header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['strict-transport-security']).toBeDefined();
          expect(res.headers['strict-transport-security']).toContain('max-age=31536000');
          expect(res.headers['strict-transport-security']).toContain('includeSubDomains');
          expect(res.headers['strict-transport-security']).toContain('preload');
        });
    });

    it('should include X-Frame-Options header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['x-frame-options']).toBe('DENY');
        });
    });

    it('should include X-Content-Type-Options header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['x-content-type-options']).toBe('nosniff');
        });
    });

    it('should include Referrer-Policy header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
        });
    });

    it('should include Cross-Origin-Opener-Policy header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['cross-origin-opener-policy']).toBe('same-origin');
        });
    });

    it('should include Cross-Origin-Resource-Policy header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['cross-origin-resource-policy']).toBe('same-origin');
        });
    });

    it('should include X-DNS-Prefetch-Control header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['x-dns-prefetch-control']).toBe('off');
        });
    });

    it('should include X-Download-Options header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['x-download-options']).toBe('noopen');
        });
    });

    it('should include X-Permitted-Cross-Domain-Policies header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
        });
    });

    it('should NOT include X-Powered-By header', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect((res) => {
          expect(res.headers['x-powered-by']).toBeUndefined();
        });
    });

    it('should include CORS headers for allowed origins', () => {
      return request(app.getHttpServer())
        .get('/')
        .set('Origin', 'http://localhost:3000')
        .expect((res) => {
          expect(res.headers['access-control-allow-credentials']).toBe('true');
        });
    });
  });

  describe('Security Score', () => {
    it('should achieve 100% security score', async () => {
      const response = await request(app.getHttpServer()).get('/');
      
      const requiredHeaders = [
        'content-security-policy',
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'cross-origin-opener-policy',
        'cross-origin-resource-policy',
        'x-dns-prefetch-control',
        'x-download-options',
        'x-permitted-cross-domain-policies'
      ];

      const forbiddenHeaders = [
        'x-powered-by',
        'server'
      ];

      let score = 0;
      const totalRequired = requiredHeaders.length;

      // Check required headers
      requiredHeaders.forEach(header => {
        if (response.headers[header]) {
          score++;
        }
      });

      // Penalize forbidden headers
      forbiddenHeaders.forEach(header => {
        if (response.headers[header]) {
          score--;
        }
      });

      const percentage = (score / totalRequired) * 100;
      expect(percentage).toBe(100);
    });
  });
});