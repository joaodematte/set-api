import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { env } from 'process';

const prisma = new PrismaClient();

export async function createAuth(req: Request, res: Response) {
  const { email, password, keepConected } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      message: 'Por favor, envie todos os dados'
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!existingUser) {
    return res.status(404).json({
      message: 'Email não cadastrado'
    });
  }

  const isPasswordEquals = await compare(password, existingUser.password);

  if (!isPasswordEquals) {
    return res.status(404).json({
      message: 'Senha inválida'
    });
  }

  const jwt = sign(
    {
      id: existingUser.id,
      name: existingUser.name,
      surname: existingUser.surname,
      email: existingUser.email,
      profile_pic: existingUser.profile_pic
    },
    env.JWT_SECRET as string,
    {
      expiresIn: keepConected ? '365d' : '12h'
    }
  );

  return res.status(200).json({
    message: 'Logado com sucesso',
    user: {
      ...existingUser,
      jwt
    }
  });
}

export async function getUserByJWT(req: Request, res: Response) {
  const { jwt } = req.query;

  verify(jwt as string, env.JWT_SECRET as string, async (error, decoded) => {
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id as number
        },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          profilePic: true
        }
      });

      return res.status(200).json({
        message: 'Sessão validada',
        user
      });
    }

    if (error) {
      return res.status(403).json({
        message: 'Sessão inválida'
      });
    }

    return res.status(403).json({
      message: 'Sessão inválida'
    });
  });
}
