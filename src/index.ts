import * as readline from 'readline-sync';
import { db } from './db/index.js';
import { ufs, cidades, regioes } from './db/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  while (true) {
    console.log("\n======= GESTÃO GEOGRÁFICA (REG -> UF -> CID) =======");
    console.log("1. Regiões | 2. Estados (UF) | 3. Cidades | 0. Sair");
    const op = readline.question("Escolha: ");

    if (op === '0') break;

    // --- MÓDULO REGIÕES ---
    if (op === '1') {
      console.log("\n[REGIÕES] 1. Cadastrar | 2. Listar | 3. Ver Estados desta Região | 4. EXCLUIR");
      const sub = readline.question("> ");
      
      if (sub === '1') {
        const nome = readline.question("Nome da Região: ");
        await db.insert(regioes).values({ nome });
        console.log("✅ Região criada!");
      } 
      else if (sub === '2') {
        console.table(await db.select().from(regioes));
      } 
      else if (sub === '3') {
        const listaReg = await db.select().from(regioes);
        console.table(listaReg);
        const idReg = readline.question("ID da Região para filtrar: ").trim();
        
        // Ajuste aqui: Selecionamos apenas colunas do Estado para não poluir
        const estadosVinculados = await db.select({
          id: ufs.id,
          nome_estado: ufs.nome,
          sigla: ufs.sigla
        })
        .from(ufs)
        .where(eq(ufs.regiaoId, idReg));

        console.log("\n--- Estados vinculados a esta região ---");
        console.table(estadosVinculados);
      } 
      else if (sub === '4') {
        console.table(await db.select().from(regioes));
        const idDel = readline.question("ID da Região para excluir: ");
        await db.delete(regioes).where(eq(regioes.id, idDel));
        console.log("🗑️ Região removida!");
      }
    }

    // --- MÓDULO ESTADOS ---
    else if (op === '2') {
      console.log("\n[ESTADOS] 1. Cadastrar | 2. Listar | 3. Vincular/Adicionar a Região | 4. EXCLUIR");
      const sub = readline.question("> ");
      
      if (sub === '1') {
        const nome = readline.question("Nome: ");
        const sigla = readline.question("Sigla: ");
        await db.insert(ufs).values({ nome, sigla });
        console.log("✅ Estado criado!");
      } 
      else if (sub === '2') {
        const res = await db.select({ 
            id: ufs.id, 
            estado: ufs.nome, 
            sigla: ufs.sigla,
            regiao: regioes.nome 
        }).from(ufs).leftJoin(regioes, eq(ufs.regiaoId, regioes.id));
        console.table(res);
      } 
      else if (sub === '3') {
        console.table(await db.select().from(ufs));
        const idUf = readline.question("ID do Estado: ");
        console.table(await db.select().from(regioes));
        const idReg = readline.question("ID da Região de destino: ");
        await db.update(ufs).set({ regiaoId: idReg }).where(eq(ufs.id, idUf));
        console.log("✅ Vínculo atualizado!");
      } 
      else if (sub === '4') {
        console.table(await db.select().from(ufs));
        const idDel = readline.question("ID do Estado para excluir: ");
        await db.delete(ufs).where(eq(ufs.id, idDel));
        console.log("🗑️ Estado removido!");
      }
    }

    // --- MÓDULO CIDADES ---
    else if (op === '3') {
      console.log("\n[CIDADES] 1. Cadastrar | 2. Listar | 3. Vincular/Adicionar a Estado | 4. EXCLUIR");
      const sub = readline.question("> ");
      
      if (sub === '1') {
        const nome = readline.question("Nome da Cidade: ");
        await db.insert(cidades).values({ nome });
        console.log("✅ Cidade criada!");
      } 
      else if (sub === '2') {
        const res = await db.select({ 
            id: cidades.id,
            cidade: cidades.nome, 
            estado: ufs.nome, 
            regiao: regioes.nome 
        })
        .from(cidades)
        .leftJoin(ufs, eq(cidades.ufId, ufs.id))
        .leftJoin(regioes, eq(ufs.regiaoId, regioes.id));
        console.table(res);
      } 
      else if (sub === '3') {
        console.table(await db.select().from(cidades));
        const idCid = readline.question("ID da Cidade: ");
        console.table(await db.select().from(ufs));
        const idUf = readline.question("ID do Estado de destino: ");
        await db.update(cidades).set({ ufId: idUf }).where(eq(cidades.id, idCid));
        console.log("✅ Vínculo atualizado!");
      } 
      else if (sub === '4') {
        console.table(await db.select().from(cidades));
        const idDel = readline.question("ID da Cidade para excluir: ");
        await db.delete(cidades).where(eq(cidades.id, idDel));
        console.log("🗑️ Cidade removida!");
      }
    }
  }
}

main().catch(console.error);