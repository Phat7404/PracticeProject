import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class AudioConverterService {
  private readonly tempDir = path.join(process.cwd(), 'temp');

  constructor() {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async convertFlacToMp3(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .audioBitrate('192k')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  async processFile(file: Express.Multer.File): Promise<{ mp3Path: string; mp3Filename: string }> {
    const flacPath = path.join(this.tempDir, file.originalname);
    const mp3Filename = file.originalname.replace('.flac', '.mp3');
    const mp3Path = path.join(this.tempDir, mp3Filename);

    // Save uploaded file
    await promisify(fs.writeFile)(flacPath, file.buffer);

    // Convert to MP3
    await this.convertFlacToMp3(flacPath, mp3Path);

    // Clean up FLAC file
    await promisify(fs.unlink)(flacPath);

    return { mp3Path, mp3Filename };
  }

  async cleanupFile(filePath: string): Promise<void> {
    try {
      await promisify(fs.unlink)(filePath);
    } catch (error) {
      console.error(`Error cleaning up file ${filePath}:`, error);
    }
  }
} 