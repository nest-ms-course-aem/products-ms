import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { log } from 'console';

async function bootstrap() {

  const logger = new Logger("Main");

  console.log(envs.natsServers);
  

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    {
      transport: Transport.NATS,
      options: {
        servers: envs?.natsServers,
      }
    }
);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
    );

  await app.listen();
  console.log("hola mundo de productos");
  
  logger.verbose(`Product microservice running on port ${envs.port}`);
  
}
bootstrap();
