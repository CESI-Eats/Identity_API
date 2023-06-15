import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppDataSource } from "../data-source"
import { RefreshToken } from '../entity/RefreshToken';
import { IdentityType } from '../entity/Identity';

export const createToken = (id: string, type: IdentityType): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: process.env.KID,
  };

  const payload = {
    sub: id,
    type: type,
    exp: Math.floor(Date.now() / 1000) + (5 * 60), 
  };

  return jwt.sign(payload, process.env.SECRET_KEY, { header });
};

export const createRefreshToken = async (id: string): Promise<string> => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: process.env.KID,
  };

  const payload = {
    sub: id,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
  };
  
  const token = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { header })
  
  const refreshTokenEntity = new RefreshToken();
  refreshTokenEntity.userId = id;
  refreshTokenEntity.token = token;
  await AppDataSource.manager.save(refreshTokenEntity);

  return token;
};

export const validateRefreshToken = async (refreshToken: string): Promise<string | null> => {
  try {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    const decoded = jwt.decode(refreshToken);

    if (typeof decoded !== 'string' && 'exp' in decoded) {
      if (decoded.exp < Date.now() / 1000) {
        return null;
      }
    } else {
      return null;
    }

    const tokenEntity = await AppDataSource.manager.findOneBy(RefreshToken, { token: refreshToken });
    if (!tokenEntity || !tokenEntity.isValid) {
      return null;
    }

    return String((decoded as JwtPayload).sub);
  } catch (err) {
    return null;
  }
};

export const invalidateRefreshToken = async (token: string): Promise<void> => {
  const tokenEntity = await AppDataSource.manager.findOneBy(RefreshToken, { token: token });
  if (tokenEntity) {
    tokenEntity.isValid = false;
    await AppDataSource.manager.save(tokenEntity);
  }
};
