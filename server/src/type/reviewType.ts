import { Field, InputType } from "type-graphql";

@InputType()
export class ReviewInput {
    @Field()
    notation!: number;
    
    @Field()
    comment!: string;
    
    @Field()
    date!: string;
    
    @Field({ nullable: true })
    reviewRequested?: boolean;

    @Field()
    receiver!: string;
    
    @Field()
    sender!: string;
    
    @Field()
    trip!: string; 
} 