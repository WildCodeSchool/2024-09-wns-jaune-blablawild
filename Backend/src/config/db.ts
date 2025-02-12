import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Trip } from "../entities/trip";
import { Review } from "../entities/review";
import { User } from "../entities/user";
import { Transaction } from "../entities/transaction";

config();

const { DB_PASSWORD, DB_SCHEMA, DB_USER } = process.env;

export const dataSource = new DataSource({
  type: "postgres",
  host: "database",
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
  port: 5432,
  entities: [Trip, Review, User, Transaction],
  synchronize: true,
});
