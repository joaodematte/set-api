import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from 'process';

const prisma = new PrismaClient();

export default async function createAuth(req: Request, res: Response) {
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

  const jwtData = sign(
    {
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
    data: jwtData
  });
}
