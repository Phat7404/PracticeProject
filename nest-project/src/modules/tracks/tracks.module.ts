import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { Track, TrackSchema } from './schemas/track.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { AudioConverterService } from '../../helpers/audio-converter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [TracksController],
  providers: [TracksService, AudioConverterService],
})
export class TracksModule {}
