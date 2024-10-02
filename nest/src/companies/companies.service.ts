import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) {}

  create(createCompanyDto: CreateCompanyDto, id: string) {
    const createBy = new Types.ObjectId(id);
    return this.companyModel.create({
      ...createCompanyDto,
      createBy,
      updateBy: createBy
    });
  }

  findAll() {
    return this.companyModel.find();
  }

  findOne(id: string) {
    return this.companyModel.findById(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, updateBy: string) {
    return this.companyModel.findByIdAndUpdate(id, {
      ...updateCompanyDto,
      updateBy: new Types.ObjectId(updateBy)
    });
  }

  async remove(id: string, deleteBy: string) {
    const result = await this.companyModel.updateOne(
      {
        _id: id
      },
      {
        isDeleted: true,
        deletedBy: new Types.ObjectId(deleteBy),
        deletedAt: new Date()
      }
    );
    return { deleted: result.modifiedCount };
  }
}
