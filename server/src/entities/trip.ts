import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Booking } from "./booking";
import { Review } from "./review";
import { Transaction } from "./transaction";
import { TripStatus } from "../type/tripType";

@ObjectType()
@Entity()
export class Trip extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  departure_city!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  departure_address!: string;

  @Field()
  @Column()
  arrival_city!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  arrival_address!: string;

  @Field()
  @Column()
  departure_time!: Date;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column()
  capacity!: number;

  @Column({ default: 0 })
  reservedSeats!: number;

  @Field(() => TripStatus)
  @Column({ default: TripStatus.OPEN })
  status!: TripStatus;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.driver_trips)
  driver!: User;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.trip)
  bookings?: Booking[];

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.trip)
  reviews?: Review[];

  @Field(() => [Transaction], { nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.trip)
  transactions?: Transaction[];
}