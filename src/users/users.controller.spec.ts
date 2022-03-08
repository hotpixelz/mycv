import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'lol@abv.bg',
          password: 'asddsadsa',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email: 'lol@abv.bg',
            password: 'asddsadsa',
          } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: (email: string, password: string) => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('lol@abv.bg');
    expect(users.length).toBeGreaterThan(0);
  });
  it('returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });
  it('findUser throws if user with given id does not exist', async () => {
    fakeUsersService.findOne = () => null;
    expect(await controller.findUser('1233')).toBeNull();
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      {
        email: 'dawe@abv.bg',
        password: 'lol',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
