import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
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

  @Field()
  @Column()
  arrival_city!: string;

  @Field()
  @Column()
  departure_time!: Date;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column()
  capacity!: number;

  @Field(() => TripStatus)
  @Column({ default: TripStatus.OPEN })
  status!: TripStatus;

  @Field(() => [User], { nullable: true })
  @JoinTable()
  @ManyToMany(() => User, (user) => user.passenger_trips)
  passengers?: User[];

  @Field(() => User, {nullable: true}) // attention remettre a not null dès la création des users
  @ManyToOne(() => User, (user) => user.driver_trips)
  driver?: User;

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.trip)
  reviews?: Review[];

  @Field(() => [Transaction], { nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.trip)
  transactions?: Transaction[];
}
