import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './posts/post.module.js';
import { TagModule } from './tags/tag.module.js';
import { PageModule } from './pages/page.module.js';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // 生产环境关闭自动建表：表结构以 assaka_blog.sql 为准，避免实体一改就改库
        synchronize: false,
      }),
    }),
    PostModule,
    TagModule,
    PageModule,
  ],

})
export class AppModule {}
