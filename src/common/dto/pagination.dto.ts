import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // Query params that comes as string from the url
    page?: number = 1;
    
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // Query params that comes as string from the url
    limit?: number = 10;
}