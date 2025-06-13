import { IsEmail, IsOptional, Max, Min } from "class-validator";
import { GraphQLJSON } from "graphql-scalars";
import { Field, Float, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class CheckoutSession {
  @Field(() => ID)
  sessionId!: string;

  @Field()
  url!: string;

  @Field()
  expiresAt!: number;

  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => ID, { nullable: true })
  transactionId?: string;
}

@InputType()
export class CreateCheckoutSessionInput {
  @Field(() => Float)
  @Min(0.01, { message: "Le prix doit être supérieur à 0" })
  @Max(999999.99, { message: "Le prix ne peut pas dépasser 999,999.99€" })
  price!: number;

  @Field({ defaultValue: "eur" })
  currency!: string;

  @Field({ defaultValue: "stripe" })
  method!: string;

  @Field(() => ID)
  tripId!: string;

  @Field(() => ID)
  receiverId!: string;

  @Field(() => ID)
  senderId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: "Format d'email invalide" })
  customerEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  successUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  cancelUrl?: string;
  
  @Field({ defaultValue: false })
  allowPromotionCodes!: boolean;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;
}

@ObjectType()
export class CheckoutSessionInfo {
  @Field(() => ID)
  sessionId!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  paymentStatus?: string;

  @Field({ nullable: true })
  customerEmail?: string;

  @Field(() => Float)
  amountTotal!: number;

  @Field()
  currency!: string;

  @Field(() => ID, { nullable: true })
  transactionId?: string;
}