import { Module } from '@nestjs/common';
import { PostedLocationService } from './postedLocation.service';
import { PostedLocationController } from './postedLocation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostedLocation, PostedLocationSchema } from './postedLocation.schema';
import { PostedLocationRepository } from './postedLocation.repository';
import { DataValidator } from 'src/general.util/Validator';
import { User, UserSchema } from 'src/users/users.schema';
import { EmailHandler } from 'src/general.util/email.Handler';

@Module({
  imports: [MongooseModule.forFeature([
    { name: PostedLocation.name, schema: PostedLocationSchema },
    { 
      name: User.name,
      schema: UserSchema
    }
  ])],
  providers: [PostedLocationService, PostedLocationRepository, DataValidator, EmailHandler],
  controllers: [PostedLocationController]
})
export class LocationsModule {}
