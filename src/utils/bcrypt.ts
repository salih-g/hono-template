import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

export const hash = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

export const compare = async (password: string, hashedPassword: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hashedPassword.split(':');

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);

      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKeyBuffer = Buffer.from(derivedKey);

      resolve(
        keyBuffer.length === derivedKeyBuffer.length &&
          timingSafeEqual(keyBuffer, derivedKeyBuffer),
      );
    });
  });
};
