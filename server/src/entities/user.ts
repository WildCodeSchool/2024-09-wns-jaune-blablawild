import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trip } from "./trip";
import { Review } from "./review";
import { Transaction } from "./transaction";
import { Profile } from "./profile";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  password!: string;

  // Role for user to define later if needed
  // @Field()
  // @Column()
  // role!: string;

  @Field()
  @Column({ default: 0 })
  pot!: number;

  @Field(() => [Trip], { nullable: true })
  @ManyToMany(() => Trip, (trip) => trip.passengers)
  passenger_trips?: Trip[];

  @Field(() => [Trip], { nullable: true })
  @OneToMany(() => Trip, (trip) => trip.driver)
  driver_trips?: Trip[];

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.receiver)
  received_review?: Review[];

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.sender)
  sent_review?: Review[];

  @Field(() => [Transaction], { nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  transaction_received?: Transaction[];

  @Field(() => [Transaction], { nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  transaction_sent?: Transaction[];

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile?: Profile;
}
