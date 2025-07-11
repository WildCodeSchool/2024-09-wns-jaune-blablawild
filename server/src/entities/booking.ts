import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Trip } from "./trip";

@ObjectType()
@Entity()
export class Booking extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.bookings)
  passenger!: User;

  @Field(() => Trip)
  @ManyToOne(() => Trip, (trip) => trip.bookings)
  trip!: Trip;

  @Field()
  @Column()
  seatsCount!: number;

  @Field()
  @Column()
  bookingDate!: Date;
}