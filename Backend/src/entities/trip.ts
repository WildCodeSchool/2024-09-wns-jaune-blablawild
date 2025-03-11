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

@ObjectType()
@Entity()
export class Trip extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  depature_city!: string;

  @Field()
  @Column()
  arrival_city!: string;

  @Field()
  @Column()
  depature_time!: Date;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column({ default: "OPEN" })
  status!: "OPEN" | "CLOSE" | "FULL";

  @Field(() => [User], { nullable: true })
  @JoinTable()
  @ManyToMany(() => User, (user) => user.passenger_trips)
  passengers?: User[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.driver_trips)
  driver!: User;

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.trip)
  reviews?: Review[];

  @Field(() => [Transaction], { nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.trip)
  transactions?: Transaction[];
}
