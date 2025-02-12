import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "./trip";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  fisrtname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  passaword!: string;

  @Field()
  @Column()
  image!: string;

  @Field()
  @Column()
  role!: string;

  @Field({nullable: true})
  @ManyToMany(() => Trip, (trip) => trip.passengers)
  passenger_trips?: Trip[]

  @Field({nullable: true})
  @OneToMany(() => Trip, (trip) => trip.driver) 
  driver_trips?: Trip

  @Field()
  @ManyToOne(() => Trip, (trip) => trip) 
  review?: Trip

}