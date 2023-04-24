import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SampleDetailEntity } from './SampleDetail';

@Entity({ name: 'samples' })
export class SampleEntity {
  @PrimaryGeneratedColumn({type: "integer"})
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(
    (type) => SampleDetailEntity,
    (sampleDetail) => sampleDetail.sample,
    {
      cascade: true,
    },
  )
  sampleDetail: SampleDetailEntity | null;
}
