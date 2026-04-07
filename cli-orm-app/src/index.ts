import * as readline from 'node:readline/promises';
import { db } from './db';
import { ufs, cidades, regioes } from './db/schema';
import { eq } from 'drizzle-orm';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  while (true) {
    console.log('\n--- MENU CRUD ---');
    console.log('1. Listar UFs | 2. Adicionar UF | 3. Atualizar UF | 4. Deletar UF');
    console.log('0. Sair');
    
    const opt = await rl.question('Escolha uma opção: ');

    switch (opt) {
      case '1':
        const allUfs = await db.select().from(ufs);
        console.table(allUfs);
        break;

      case '2':
        const nome = await rl.question('Nome da UF: ');
        const sigla = await rl.question('Sigla: ');
        await db.insert(ufs).values({ nome, sigla });
        console.log('UF adicionada!');
        break;

      case '3':
        const idUpd = await rl.question('ID da UF para atualizar: ');
        const novoNome = await rl.question('Novo Nome: ');
        await db.update(ufs).set({ nome: novoNome }).where(eq(ufs.id, idUpd));
        console.log('Atualizado com sucesso!');
        break;

      case '4':
        const idDel = await rl.question('ID da UF para deletar: ');
        await db.delete(ufs).where(eq(ufs.id, idDel));
        console.log('Removido!');
        break;

      case '0':
        process.exit();
    }
  }
}

main();