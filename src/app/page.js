// src/app/page.js
'use client'; // Necessário para usar useState e manipuladores de evento

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import './globals.css'; // Vamos colocar seu CSS aqui depois

export default function Home() {
  const [loading, setLoading] = useState(false);

  const mascaraZap = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    e.target.value = v;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      nome: event.target.nome.value,
      bairro: event.target.bairro.value,
      whatsapp: event.target.whatsapp.value,
      curso: event.target.curso.value,
    };

    try {
      const response = await fetch('/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        event.target.reset();
      } else {
        alert('Erro: ' + result.message);
      }
    } catch (error) {
      alert('Erro ao enviar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      {/* Importando fontes e ícones via tag style ou no layout.js, aqui simplificado */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <div className="container">
        <div className="glass-card">
          <header>
            <div className="logo-wrapper">
              <img src="/assets/logo.png" alt="Logo" className="logo-img" />
            </div>
            <p className="subtitle">Curso Gratuito para Chapecó e Região</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nome">Nome Completo</label>
              <i className="fas fa-user"></i>
              <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required />
            </div>

            <div className="input-group">
              <label htmlFor="bairro">Bairro</label>
              <i className="fas fa-map-marker-alt"></i>
              <input type="text" id="bairro" name="bairro" placeholder="Ex: Centro" required />
            </div>

            <div className="input-group">
              <label htmlFor="whatsapp">WhatsApp</label>
              <i className="fab fa-whatsapp"></i>
              <input type="tel" id="whatsapp" name="whatsapp" placeholder="(49) 99999-9999" onInput={mascaraZap} maxLength="15" required />
            </div>

            <div className="input-group">
              <label htmlFor="curso">Curso Desejado</label>
              <i className="fas fa-graduation-cap"></i>
              <select id="curso" name="curso" required defaultValue="">
                <option value="" disabled>Selecione um curso...</option>
                <option value="informatica-essencial">Informática Essencial</option>
                <option value="auxiliar-administrativo">Auxiliar Administrativo</option>
                {/* Adicione as outras opções aqui */}
              </select>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Realizar Inscrição'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}