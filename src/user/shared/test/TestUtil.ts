import { User } from '../../user.entity';

export default class TestUtil {
  static getValidUser(): User {
    const user = new User();
    user.email = 'valid@mail.com';
    user.name = 'User Name';
    user.password = '1234567';
    user.id = '1';
    return user;
  }
}
