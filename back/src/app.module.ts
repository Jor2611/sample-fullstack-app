import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RBACGuard } from './guards/rbac.guard';
import { TokenParse } from './middlewares/token-parse.middleware';
import { HttpExceptionFilter } from './exceptionFilters/response.exception';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: !`.env.${process.env.NODE_ENV}`
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: config.get<number>('MYSQL_PORT'),
        username: config.get<string>('MYSQL_USERNAME'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        synchronize: true,
        autoLoadModels: true
      })
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION') }
      })
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ whitelist: true })
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
  exports: [JwtModule]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenParse).forRoutes('*')
  }
}
