import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern({ cmd: 'createProduct' })
  // create(@Body() createProductDto: CreateProductDto) { Using tcp we use @Payload instead of @Body
  create(@Payload() createProductDto: CreateProductDto) {
      return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'findAllProducts' })
  findAll(
    // @Query('page', ParseIntPipe) page: number,
    // @Query('limit', ParseIntPipe) limit: number
    @Payload() paginationDto: PaginationDto //* When you declare directly the dto with the corresponding validations on the incoming param,query,body from the request then it validates and transform
  ) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'findProduct' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'updateProduct' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto?.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'removeProduct' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({cmd: 'validateProducts'})
  validateProducts(@Payload() ids: number[]){
    return this.productsService.validateProducts(ids)
  }
}
