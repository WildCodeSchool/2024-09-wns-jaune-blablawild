import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trip } from "./trip";
import { User } from "./user";

@ObjectType()
@Entity()
@Index(["stripe_session_id"], { unique: true })
export class Transaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  status!: string;

@Field()
@CreateDateColumn({ nullable: true })
createdAt!: Date;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column()
  method!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  stripe_session_id?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  stripe_payment_intent_id?: string;

  @Field(() => Trip)
  @ManyToOne(() => Trip, (trip) => trip.transactions)
  trip!: Trip;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transaction_received)
  receiver!: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transaction_sent)
  sender!: User;

  // Méthodes utilitaires
  @Field()
  get isCompleted(): boolean {
    return this.status === "completed";
  }

  @Field()
  get isPending(): boolean {
    return this.status === "pending";
  }

  @Field()
  get isFailed(): boolean {
    return this.status === "failed";
  }
}
