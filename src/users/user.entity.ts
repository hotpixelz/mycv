import { Report } from '../reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('Updated user with id', this.id);
  }

  @AfterRemove()
  afterRemove() {
    console.log('Removed user with id: ', this.id);
  }
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
