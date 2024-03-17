import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
