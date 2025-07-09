import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Profile } from "../entities/profile";
import { User } from "../entities/user";
import path from "path";
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { GraphQLUpload } from "graphql-upload-ts";

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

const uploadDir = path.join(process.cwd(), "uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;
}

const DEFAULT_PROFILE_IMAGE = "/placeholder-portrait.png";

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
      newProfile.image = DEFAULT_PROFILE_IMAGE;
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

  @Mutation(() => Profile)
  async uploadProfileImage(
    @Arg("userId") userId: string,
    @Arg("file", () => GraphQLUpload)
    file: FileUpload
  ): Promise<Profile> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ["profile"],
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (!user.profile) {
      throw new Error("Profil utilisateur non trouvé");
    }

    const { createReadStream, filename } = file;
    const uniqueFilename = `${userId}_${Date.now()}_${filename}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const stream = createReadStream();
    const writeStream = createWriteStream(filePath);
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(writeStream)
        .on("finish", () => resolve())
        .on("error", (error) => reject(error));
    });
    user.profile.image = `/uploads/${uniqueFilename}`;
    await user.profile.save();
    return user.profile;
  }

  @Mutation(() => CancelationRate)
  async getCancelationRate(
    @Arg("userId") userId: string,
  ): Promise<CancelationRate> {
    const user = await User.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (!user.profile) {
      throw new Error("Profil utilisateur non trouvé");
    }


    await user.profile.save();
    return user.profile;
  }
}
