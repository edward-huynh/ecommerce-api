import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Thêm các security headers bổ sung
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    
    // Loại bỏ server information
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    
    next();
  }
}

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Chỉ áp dụng HTTPS redirect trong production
    if (process.env.NODE_ENV === 'production') {
      const proto = req.headers['x-forwarded-proto'] || req.protocol;
      
      if (proto !== 'https') {
        const httpsUrl = `https://${req.get('host')}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
      }
    }
    
    next();
  }
}