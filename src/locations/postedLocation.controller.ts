import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostedLocationService } from './postedLocation.service';
import { CreatePostLocationDto } from './dto/create.postedLocation.dto';
import { UpdatePostLocationDto } from './dto/update.postedLocation.dto';
import { TransferStaffDto } from './dto/tranfer.postLocation.dto';

@Controller('location')
export class PostedLocationController {
    constructor (private readonly locationService: PostedLocationService) {}

    @Post()
    createLocalGovernment(
        @Body() createPostLocationDto: CreatePostLocationDto
    ) {
        return this.locationService.createLocalGovernment(createPostLocationDto)
    }

    @Get()
    getAllLocations() {
        return this.locationService.getAllLocations();
    }

    @Get(':lgaId')
    getLocationById(
        @Param('lgaId') lgaId: string
    ) {
        return this.locationService.getLocationById(lgaId)
    }

    @Patch(':lgaId')
    async updateLocation(
        @Param('lgaId') lgaId: string,
        @Body() updatePostDto: UpdatePostLocationDto
    ) {
        return await this.locationService.updatePostLocationById(lgaId, updatePostDto)
    }

    @Patch('/staff/transfer')
    async staffTransfer(
        @Body() transferStaffDto: TransferStaffDto
    ) {
        return this.locationService.staffTransfer(transferStaffDto)
    }

    @Delete(':lgaId')
    deleteLocation(
        @Param('lgaId') lgaId: string
    ) {
        return this.locationService.deleteLocation(lgaId)
    }


}
