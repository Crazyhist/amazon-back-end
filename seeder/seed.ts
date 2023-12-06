// Файл для моковых данных в бд, чтобы руками не добавлять все самому

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()