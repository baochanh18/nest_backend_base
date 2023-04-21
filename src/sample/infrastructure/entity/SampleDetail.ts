import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SampleEntity } from './Sample';

@Entity({ name: 'sample_details' })
export class SampleDetailEntity {
  @PrimaryGeneratedColumn({type: "integer"})
  id: number;

  @Column()
  sampleId: number;

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne((type) => SampleEntity, (sample) => sample.sampleDetail)
  @JoinColumn({ name: 'sample_id' })
  sample: SampleEntity;
}
