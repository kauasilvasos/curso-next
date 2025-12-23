import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import db from '@/lib/db'; // Importa nossa conexão

export async function POST(request) {
  try {
    const { nome, bairro, whatsapp, curso } = await request.json();

    // 1. Inserir no Banco de Dados (Promisify para usar await)
    const idRegistro = await new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO inscricoes (nome, bairro, whatsapp, curso) VALUES (?, ?, ?, ?)');
      stmt.run([nome, bairro, whatsapp, curso], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });

    // 2. Configurar o Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Enviar E-mail
    await transporter.sendMail({
      from: `"Brasil Preparado" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_CLIENT,
      subject: `Nova Inscrição: ${nome} - ${curso}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #003399;">Nova Inscrição Recebida!</h2>
            <p><strong>ID:</strong> ${idRegistro}</p>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Bairro:</strong> ${bairro}</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/55${whatsapp.replace(/\D/g,'')}">${whatsapp}</a></p>
            <p><strong>Curso:</strong> ${curso.toUpperCase()}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Inscrição realizada com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ message: 'Erro ao processar inscrição.' }, { status: 500 });
  }
}