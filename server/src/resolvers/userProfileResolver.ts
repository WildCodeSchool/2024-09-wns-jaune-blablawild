import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Profile } from "../entities/profile";
import { User } from "../entities/user";
import path from "path";
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { GraphQLUpload } from "graphql-upload-ts";
import { Trip } from "../entities/trip";
import { TripStatus } from "../type/tripType";

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

  @Query(() => String)
  async getCancelationRate(
    @Arg("userId") userId: string,
  ): Promise<String> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (!user.profile) {
      throw new Error("Profil utilisateur non trouvé");
    }

    //récupérer le total des trajets dont l'utilisateur proposés par l'utilisateur & qui sont passés
    const passedTrips = await Trip.createQueryBuilder('trip')
      .where('trip.driver = :userId', {userId})
      .andWhere('trip.status = :status', { status: TripStatus.CLOSE})
      .getCount()

    const passedTripsAsPassenger = await Trip.createQueryBuilder('trip')
      .innerJoin('trip.passengers', 'passenger')
      .where('passenger.id = :userId', { userId })
      .andWhere('trip.status = :status', { status: TripStatus.CLOSE})
      .getCount()

    const totalTrips = passedTrips + passedTripsAsPassenger

    //renvoyer une string en fonction du total ou du calcul du pourcentage
    if (totalTrips === 0) 
      return "Cet utilisateur n'a pas encore effectué de trajet"

    if (!user.profile.cancelledTrips || user.profile.cancelledTrips === 0)
      return "Aucune annulation !"

    const cancellationRate = (user.profile.cancelledTrips / totalTrips) * 100;

    if (cancellationRate <= 25) return "Taux faible";
    if (cancellationRate <= 50) return "Taux moyen";
    return "Taux élevé";
  }
}
