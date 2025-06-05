import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './schemas/track.schema';
import { ObjectId } from 'mongodb';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import aqp from 'api-query-params';
import { AudioConverterService } from '../../helpers/audio-converter.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<Track>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    private audioConverterService: AudioConverterService,
  ) {}

  async create(createTrackDto: CreateTrackDto, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const track = new this.trackModel({
      ...createTrackDto,
      userId,
    });
    return track.save();
  }

  async findAll(query: string, current: number = 1, pageSize: number = 10) {
    try {
      const { filter, sort } = aqp(query);
      if (filter.current) delete filter.current;
      if (filter.pageSize) delete filter.pageSize;

      const totalItems = (await this.trackModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const skip = (current - 1) * pageSize;

      const tracks = await this.trackModel
        .find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(pageSize)
        .populate('userId', 'username profilePic')
        .select('-audioFile')
        .exec();

      return {
        message: 'Tracks retrieved successfully',
        tracks,
        totalItems,
        totalPages,
        current,
        pageSize,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to retrieve tracks');
    }
  }

  async findOne(id: string) {
    const track = await this.trackModel
      .findById(id)
      .populate('userId', 'username profilePic')
      .exec();
    if (!track) {
      throw new NotFoundException(`Track #${id} not found`);
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto, userId: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new NotFoundException(`Track #${id} not found`);
    }

    if (track.userId.toString() !== userId) {
      throw new Error('You are not authorized to update this track');
    }

    return this.trackModel
      .findByIdAndUpdate(id, updateTrackDto, { new: true })
      .populate('userId', 'username profilePic')
      .exec();
  }

  async remove(id: string, userId: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new NotFoundException(`Track #${id} not found`);
    }

    if (track.userId.toString() !== userId) {
      throw new Error('You are not authorized to delete this track');
    }

    return this.trackModel.findByIdAndDelete(id).exec();
  }

  async uploadAudio(file: Express.Multer.File) {
    if (!file.originalname.toLowerCase().endsWith('.flac')) {
      throw new Error('Only FLAC files are supported');
    }

    try {
      // Convert FLAC to MP3
      const { mp3Path, mp3Filename } = await this.audioConverterService.processFile(file);

      // Read the MP3 file
      const audioBuffer = await promisify(fs.readFile)(mp3Path);

      // Create a new track with the audio data
      const track = new this.trackModel({
        title: path.parse(file.originalname).name,
        audioFile: audioBuffer,
        duration: 0, // You might want to get this from the audio file
        userId: new ObjectId(), // You'll need to provide the actual user ID
      });

      await track.save();

      // Clean up MP3 file
      await this.audioConverterService.cleanupFile(mp3Path);

      return {
        message: 'File uploaded and converted successfully',
        trackId: track._id.toString(),
        filename: mp3Filename,
      };
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  async uploadFolder(folderPath: string) {
    // Normalize the path for Windows
    const normalizedPath = path.normalize(folderPath);
    console.log('Checking folder path:', normalizedPath);
    
    if (!fs.existsSync(normalizedPath)) {
      throw new Error(`Folder not found: ${normalizedPath}`);
    }

    const processFile = async (filename: string) => {
      if (!filename.toLowerCase().endsWith('.flac')) {
        return null;
      }

      const flacPath = path.join(normalizedPath, filename);
      const mp3Filename = filename.replace('.flac', '.mp3');
      const mp3Path = path.join(process.cwd(), 'temp', mp3Filename);

      try {
        // Convert FLAC to MP3
        await this.audioConverterService.convertFlacToMp3(flacPath, mp3Path);

        // Read the MP3 file
        const audioBuffer = await promisify(fs.readFile)(mp3Path);

        // Create a new track with the audio data
        const track = new this.trackModel({
          title: path.parse(filename).name,
          audioFile: audioBuffer,
          duration: 0, // You might want to get this from the audio file
          userId: new ObjectId(), // You'll need to provide the actual user ID
        });

        await track.save();

        // Clean up MP3 file
        await this.audioConverterService.cleanupFile(mp3Path);

        return {
          filename: mp3Filename,
          trackId: track._id.toString(),
        };
      } catch (error) {
        return {
          error: `Failed to process ${filename}: ${error.message}`,
        };
      }
    };

    const filenames = fs.readdirSync(normalizedPath);
    const results = await Promise.all(filenames.map(processFile));

    const uploadedFiles = results.filter((r) => r && 'trackId' in r);
    const errors = results.filter((r) => r && 'error' in r);

    if (uploadedFiles.length === 0) {
      throw new Error('No FLAC files were processed successfully');
    }

    return {
      message: 'Files processed successfully',
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async streamAudio(id: string, range?: string) {
    const track = await this.trackModel.findById(id);
    if (!track || !track.audioFile) {
      throw new NotFoundException(`Audio file #${id} not found`);
    }

    const audioBuffer = track.audioFile;
    const fileSize = audioBuffer.length;
    let start = 0;
    let end = fileSize - 1;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    }

    const chunksize = end - start + 1;
    const chunk = audioBuffer.slice(start, end + 1);
    
    // Create a readable stream from the buffer
    const stream = require('stream');
    const readableStream = new stream.Readable();
    readableStream.push(chunk);
    readableStream.push(null);

    return {
      stream: readableStream,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'audio/mpeg',
      },
    };
  }
}
