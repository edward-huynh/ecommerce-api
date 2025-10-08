import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    description: 'Token xác thực email',
    example: 'abc123def456',
  })
  @IsString({ message: 'Token phải là chuỗi' })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}