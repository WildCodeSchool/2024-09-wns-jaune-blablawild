import { Field, InputType } from "type-graphql";

@InputType()
export class ReviewInput {
    @Field()
    notation!: number;
    
    @Field()
    comment!: string;
    
    @Field()
    date!: Date;
    
    @Field()
    receiver!: string;
    
    @Field()
    sender!: string;
    
    @Field()
    trip!: string; 
} 