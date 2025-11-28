import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', // local dev
      'https://roster-frontend.vercel.app', // Vercel frontend
      process.env.FRONTEND_URL, // optional extra
    ].filter(Boolean),
    credentials: true, // allow cookies/auth headers
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
