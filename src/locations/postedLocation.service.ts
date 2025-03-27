import { HttpException, Injectable } from '@nestjs/common';
import { PostedLocationRepository } from './postedLocation.repository';
import { CreatePostLocationDto } from './dto/create.postedLocation.dto';
import { UpdatePostLocationDto } from './dto/update.postedLocation.dto';
import { DataValidator } from 'src/general.util/Validator';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { EmailHandler } from 'src/general.util/email.Handler';
import { TransferStaffDto } from './dto/tranfer.postLocation.dto';

@Injectable()
export class PostedLocationService {
    constructor(
        private readonly postedLocationRepository: PostedLocationRepository, 
        private readonly dataValidator: DataValidator,
        @InjectModel(User.name) private userModel: Model<User>,
        readonly emailHandler: EmailHandler
    ) {}

    createLocalGovernment(createPostedLocationDto: CreatePostLocationDto) {
        return this.postedLocationRepository.create(createPostedLocationDto);
    }

    getAllLocations () {
        return this.postedLocationRepository.find()
    }

    async getLocationById (lgaId: string) {
        await this.dataValidator.validateId(lgaId);
       return await this.postedLocationRepository.findOne({_id: lgaId})
    }

    async updatePostLocationById(lgaId: string, { staffId, ...updatePostLocationDto }: UpdatePostLocationDto) {
        await this.dataValidator.validateId(lgaId);

        if(staffId) {
            await this.dataValidator.validateId(staffId);
            const findUser = await this.userModel.findById(staffId)

            if(!findUser) throw new HttpException('user not found', 404);

            const findLocation = await this.postedLocationRepository.findOne({_id: lgaId});

            if(!findLocation) throw new HttpException('location not found', 404);

            const postedLocation = await this.postedLocationRepository.findAndUpdatePost(lgaId, staffId)

            await findUser.updateOne({ posted: true });

            const { email, firstName, lastName } =  findUser
            await this.emailHandler.staffPostNotification(email, firstName, lastName, findLocation.lga);

            return postedLocation;
        }

        return await this.postedLocationRepository.findOneAndUpdate({_id: lgaId}, updatePostLocationDto)

    }

    async staffTransfer({ currentLGAId, newLGAId, staffId }: TransferStaffDto) {
        await this.dataValidator.validateId(staffId);

        const findUser = await this.userModel.findById({ _id: staffId })
        // console.log(findUser)
        if(!findUser) throw new HttpException('user not found', 404);

        const transferData = await this.postedLocationRepository.findAndUpdatePostTransfer(currentLGAId, newLGAId, staffId);

        await this.emailHandler.transferNotification(findUser.email, findUser.firstName, findUser.lastName, transferData.from, transferData.newLocation.lga);

        return transferData.newLocation;
    }

    deleteLocation(lgaId: string) {
        return this.postedLocationRepository.findOneAndDelete({ _id: lgaId})
    }
}
