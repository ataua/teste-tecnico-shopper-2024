"use strict";
// O arquivo foi deixado aqui porque o Prisma gerencia a pasta prisma/ e eu não quis misturar as coisas
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient();
exports.default = prisma;
