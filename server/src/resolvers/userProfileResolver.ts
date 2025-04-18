import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Profile } from "../entities/profile";
import { User } from "../entities/user";

@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;
}

@Resolver(Profile)
export class ProfileResolver {
  @Query(() => Profile)
  async getProfile(@Arg("userId") userId: string) {
    const user: User | null = await User.findOne({
      where: { id: userId },
      relations: ["profile"],
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (!user.profile) {
      const newProfile = new Profile();
      newProfile.user = user;
      user.profile = newProfile;
      await user.save();
    } else if (!user.profile.user) {
      user.profile.user = user;
      await user.profile.save();
    }

    return user.profile;
  }

  @Mutation(() => Profile)
  async patchProfile(
    @Arg("userId") userId: string,
    @Arg("profileInput") profileInput: ProfileInput
  ) {
    const user = await User.findOne({
      where: { id: userId },
      relations: ["profile"],
    });
    if (!user) {
      throw new Error("Utilisateur non trouvée");
    }
    if (!user.profile) {
      throw new Error("Profil utilisateur non trouvée");
    } else if (!user.profile.user) {
      user.profile.user = user;
    }
    Object.assign(user.profile, profileInput);

    await user.profile.save();
    await user.save();

    return user.profile;
  }
}
