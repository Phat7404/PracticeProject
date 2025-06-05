import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req, UseGuards, UnauthorizedException, Query } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto, @Req() req: Request) {
    if (!req.user || !req.user['_id']) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.tracksService.create(createTrackDto, req.user['_id']);
  }

  @Get()
  findAll(
    @Query('query') query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.tracksService.findAll(query, current, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @Req() req: Request,
  ) {
    if (!req.user || !req.user['_id']) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.tracksService.update(id, updateTrackDto, req.user['_id']);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user['_id']) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.tracksService.remove(id, req.user['_id']);
  }

  @Post('upload/file/:filename')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('filename') filename: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tracksService.uploadAudio(file);
  }

  @Post('upload/folder/*path')
  async uploadFolder(@Param('path') folderPath: string[]) {
    console.log('Received request to upload folder');
    console.log('Raw path:', folderPath);
    // Reconstruct the Windows path
    const path = Array.isArray(folderPath) ? folderPath.join('\\') : folderPath;
    const decodedPath = decodeURIComponent(path);
    console.log('Decoded path:', decodedPath);
    return this.tracksService.uploadFolder(decodedPath);
  }

  @Get('stream/:id')
  async streamAudio(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { stream, headers } = await this.tracksService.streamAudio(
      id,
      req.headers.range,
    );

    res.set(headers);
    stream.pipe(res);
  }
}
