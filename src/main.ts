import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';

const config = {
  token: process.env.TOKEN,
  url: process.env.URL,
  port: process.env.PORT,
};

async function bootstrap(config) {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);

  axios
    .get(
      `https://api.telegram.org/bot${config.token}/setWebhook?url=${config.url}`,
    )
    .catch((err) => {
      // console.error(err)
    });
}
bootstrap(config);
