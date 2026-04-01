
---

# Aracaju Resolve

Plataforma para registrar e acompanhar problemas urbanos em Aracaju.

A ideia é simples: qualquer pessoa pode reportar algo na cidade (buraco, lixo, iluminação, etc) e acompanhar o andamento. Com o tempo, isso vira um mapa real dos problemas da cidade.

---

## Sobre o projeto

O Aracaju Resolve nasceu como um projeto pra centralizar denúncias urbanas de forma visual e acessível.

A proposta é funcionar como um tipo de “mapa da cidade em tempo real”, onde:

* usuários registram problemas
* outros usuários validam
* os dados ajudam a entender o que é mais urgente

---

## O que já tem

* Login e cadastro de usuário
* Sistema de denúncias (com formulário e validação)
* Mapa interativo com as ocorrências
* Cards com denúncias da comunidade
* Associação automática com órgãos responsáveis
* Dashboard admin (interface)
* Dark mode
* UI mais moderna com animações
* Integração com Supabase (auth + banco + storage)
* Dashboard admin com dados reais
* Upload de imagens funcionando de verdade
*  Persistência real das denúncias
*   Melhorias de performance no mapa
*   Sistema de confirmação comunitária mais completo
---


## Tecnologias

* Next.js
* Tailwind CSS
* shadcn/ui
* Leaflet (mapa)
* OpenStreetMap
* Framer Motion

---

## Como rodar o projeto

```bash
# clonar
git clone https://github.com/seu-usuario/aracaju-resolve

# entrar na pasta
cd aracaju-resolve

# instalar dependências
npm install

# rodar
npm run dev
```

---

## Estrutura (resumo)

```bash
src/
  components/
  pages/
  layouts/
  mocks/
  services/
```

---

## Regras importantes

* Só usuários logados podem fazer denúncias
* Cadastro exige confirmação de senha
* Cada denúncia é vinculada automaticamente a um órgão responsável

---

## Órgãos mapeados

* EMURB → buracos, calçadas
* SMTT → trânsito e sinalização
* EMSURB → lixo
* SEMA → árvores e podas
* Energisa → iluminação
* DESO → esgoto
* Guarda Municipal → animais e poluição


---




