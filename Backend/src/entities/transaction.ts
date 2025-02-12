import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Trip } from "./trip";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  status!: string;

  @Field()
  @Column()
  created_at!: Date;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column()
  method!: string;
  
  @Field(() => Trip)
  @ManyToOne(() => Trip , (trip) => trip.transaction)
  trip!: Trip

}