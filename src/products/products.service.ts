import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("ProductsService");

  onModuleInit() {
    this.$connect();
    this.logger.log('database connected')
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({
      where: {
        available: true
      }
    });
    const lastPage = Math.ceil(totalProducts / limit);


    return {
      data: await this.product.findMany({
        where: {
          available: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      metadata: {
        page: page,
        totalProducts,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      }
    });

    if(!product){
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id: __, ...rest} = updateProductDto;

    await this.findOne(id); 

    return this.product.update({
      where: {
        id
      },
      data: rest,
    });
  }

  async remove(id: number) { //Hard delete this not recommended. 
    await this.findOne(id); 

    // return this.product.delete({
    //   where: {
    //     id
    //   }
    // })

    return this.product.update({
      where: {
        id
      },
      data: {
        available: false, // You do not need to send all the information just the one that you need to update the record on the db
      }
    })
  }
}
