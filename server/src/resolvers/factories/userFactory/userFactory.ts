import { BaseFactory, FactoryOptions } from "../baseFactory";
import { User } from "../../../entities/user";
import * as argon from "argon2";

export class UserFactory extends BaseFactory<User> {
  private _shouldHashPassword: boolean = true;

  protected defineEntity(): User {
    const firstName = this.faker.person.firstName();
    const lastName = this.faker.person.lastName();

    return {
      id: this.faker.string.uuid(),
      firstname: firstName,
      lastname: lastName,
      email: this.faker.internet.email({ firstName, lastName }),
      password: "password123",
    } as User;
  }

  withClearPassword(): this {
    this._shouldHashPassword = false;
    return this;
  }

  async build(options: FactoryOptions<User> = {}): Promise<User> {
    const user = await super.build(options);

    if (this._shouldHashPassword === true) {
      user.password = await argon.hash(user.password);
    }

    this._shouldHashPassword = true;

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
