import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;
describe('AuthService tests', () => {
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user: User = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with slated and hashed password', async () => {
    const user = await service.signup('lol@abv.bg', 'lolpassword');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(user.password).not.toEqual('lolpassword');
  });
  it('throws an error when a user tries to sign up with an already existing email', async () => {
    await service.signup('lolter@abv.bg', 'asdf');
    await expect(service.signup('lolter@abv.bg', 'asd')).rejects.toThrow(
      'Email is already in use',
    );
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('nekafmail', 'nekafpassword')).rejects.toThrow(
      'User not found',
    );
  });
  it('returns user if correct password is provided', async () => {
    await service.signup('lol@abv.bg', 'asdfs');
    const user = await service.signin('lol@abv.bg', 'asdfs');
    expect(user).toBeDefined();
  });
  it('thows if an invalid password is provided', async () => {
    await service.signup('lol@abv.bg', 'asdfs');
    await expect(service.signin('lol@abv.bg', 'asds')).rejects.toThrow(
      'Password incorrect',
    );
  });
});
