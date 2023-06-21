import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import TestUtil from './shared/test/TestUtil';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { mock } from 'node:test';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When search all users', () => {
    it('should list all users', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.find.mockReturnValue([user, user]);

      const users = await service.findAllUsers();

      expect(users).toHaveLength(2);
      expect(users).toBe(users);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When find search user by id', () => {
    it('should find an existing user', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.findOne.mockReturnValue(user);

      const foundUser = await service.findUserById('1');

      expect(foundUser).toBe(user);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should return an exception when a user isn't found", () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findUserById('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create a user', () => {
    it('should create a user', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);

      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return an exception when a problem occurs during user creation', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(null);

      await service.createUser(user).catch((err) => {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('Problema ao criar usuário');
      });

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update a user', () => {
    it('should update a user', async () => {
      const user = TestUtil.getValidUser();
      const updatedUser = { name: 'Nome atualizado' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const result = await service.updateUser('1', {
        ...user,
        name: 'Nome atualizado',
      });

      expect(result).toMatchObject(updatedUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('When delete a user', () => {
    it('should delete an existing user', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.delete.mockReturnValue(user);
      mockRepository.findOne.mockReturnValue(user);

      const deleteUser = await service.deleteUser('1');

      expect(deleteUser).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete an inexisting user', async () => {
      const user = TestUtil.getValidUser();
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(user);

      const deleteUser = await service.deleteUser('10');

      expect(deleteUser).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
