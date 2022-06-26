import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

type UserForm = {
  name: string;
  surname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  registerCode: string;
};

prisma.$use(async (params, next) => {
  const userParams: Prisma.MiddlewareParams = params;

  if (params.model === 'User' && (params.action === 'create' || params.action === 'update')) {
    if (params.args.data.password) {
      const hashedPassword = await hash(params.args.data.password, 12);
      userParams.args.data.password = hashedPassword;
    }
  }

  const result = await next(userParams);

  return result;
});

export async function createUser(req: Request, res: Response) {
  const { name, surname, email, password, passwordConfirm, registerCode }: UserForm = req.body;

  if (!name || !surname || !email || !password || !passwordConfirm || !registerCode) {
    return res.status(422).json({
      message: 'Por favor, envie todos os dados'
    });
  }

  if (registerCode !== '80f34bc5e992') {
    return res.status(403).json({
      message: 'Código de registro inválido'
    });
  }

  if (password !== passwordConfirm) {
    return res.status(422).json({
      message: 'As senhas não conferem'
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existingUser) {
    return res.status(409).json({
      message: 'Email já cadastrado'
    });
  }

  await prisma.user.create({
    data: {
      name,
      surname,
      email,
      password,
      profilePic: 'https://i.imgur.com/mjovNqT.png'
    }
  });

  return res.status(204).json({
    message: 'Usuário criado com sucesso'
  });
}

export async function getAllUsers(req: Request, res: Response) {
  const allUsers = await prisma.user.findMany({
    select: {
      name: true,
      surname: true,
      email: true,
      profilePic: true
    }
  });

  return res.status(200).json({
    message: 'Usuários buscados com sucesso',
    data: allUsers
  });
}
