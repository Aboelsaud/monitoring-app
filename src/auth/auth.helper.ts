import * as bcrypt from 'bcryptjs';

export class AuthHelper {
  static validate(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(
      password + process.env.AUTH_PEPPER,
      hashedPassword,
    );
  }

  static hash(password: string): string {
    const hashedPassword = bcrypt.hashSync(
      password + process.env.AUTH_PEPPER,
      parseInt(process.env.AUTH_ROUNDS),
    );
    return hashedPassword;
  }
}
