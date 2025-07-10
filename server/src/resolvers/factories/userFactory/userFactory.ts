import { BaseFactory, FactoryOptions } from "../baseFactory";
import { User } from "../../../entities/user";
import * as argon from "argon2";
import { Profile } from "../../../entities/profile";

export class UserFactory extends BaseFactory<User> {
  private _shouldHashPassword: boolean = true;
  private _profile: Profile | null = null

  protected defineEntity(): User {
    const firstName = this.faker.person.firstName();
    const lastName = this.faker.person.lastName();

    const user = {
      id: this.faker.string.uuid(),
      firstname: firstName,
      lastname: lastName,
      email: this.faker.internet.email({ firstName, lastName }),
      password: "password123",
    } as User;

    if (this._profile) {
      user.profile = this._profile;
    }

    return user;
  }

  withClearPassword(): this {
    this._shouldHashPassword = false;
    return this;
  }

  withProfile(profileData?: Partial<Profile>): this {
      this._profile =  {
        id: this.faker.string.uuid(),
        phoneNumber: this.faker.phone.number(),
        image: '/placeholder-portrait.png',
        description: "description",
        cancelledTrips: 0,
        ...profileData
      } as Profile;
      return this;
    }

  async build(options: FactoryOptions<User> = {}): Promise<User> {
    const user = await super.build(options);

    if (this._shouldHashPassword === true) {
      user.password = await argon.hash(user.password);
    }

    Object.assign(user, {
      save: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      softRemove: jest.fn().mockResolvedValue(undefined),
      hasId: jest.fn().mockReturnValue(true),
    });

    this._shouldHashPassword = true;
    this._profile = null

    return user;
  }

  protected async persist(entity: User): Promise<any | User> {
    const mockedUser = {
      ...entity,
      save: jest.fn().mockResolvedValue(undefined),
    };

    (User as unknown as jest.Mock).mockImplementationOnce(function () {
      return mockedUser;
    });

    return mockedUser;
  }

  async create(options: FactoryOptions<User> = {}): Promise<User> {
    const entity = await this.build(options);
    return this.persist(entity);
  }
}

export const userFactory = new UserFactory();
