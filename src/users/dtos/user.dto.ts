import { Expose } from 'class-transformer';
import { Report } from 'src/reports/report.entity';
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
