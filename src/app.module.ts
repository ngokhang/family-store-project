import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './providers/database/database.module';
import { UsersModule } from './models/users/users.module';
import { RolesModule } from './models/roles/roles.module';
import { AuthModule } from './models/auth/auth.module';
import { ProductModule } from './models/product/product.module';
import { CategoriesModule } from './models/categories/categories.module';
import { OrdersModule } from './models/orders/orders.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductModule,
    CategoriesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
