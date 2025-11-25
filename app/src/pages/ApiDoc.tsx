import React from "react";

const ApiDocumentation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">API: Envio de Notificação</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Endpoint</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          POST https://main-domain-example.online:7000/push/send
        </pre>
        <p>Content-Type: <strong>application/json</strong></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Estrutura da Requisição</h2>
        <p>O corpo da requisição deve conter os seguintes campos:</p>

        <h3 className="font-semibold mt-4">Campos principais</h3>
        <table className="table-auto border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Campo</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Obrigatório</th>
              <th className="border px-2 py-1">Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">ids</td>
              <td className="border px-2 py-1">array de strings</td>
              <td className="border px-2 py-1">Sim</td>
              <td>Lista de IDs dos destinatários</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">payload</td>
              <td className="border px-2 py-1">object</td>
              <td className="border px-2 py-1">Sim</td>
              <td>Informações da notificação</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">pushType</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Sim</td>
              <td>Tipo de notificação, ex.: "single" ou "broadcast"</td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-semibold mt-4">Estrutura do payload</h3>
        <table className="table-auto border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Campo</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Obrigatório</th>
              <th className="border px-2 py-1">Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">title</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Sim</td>
              <td>Título da notificação</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">body</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Sim</td>
              <td>Mensagem da notificação</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">icon</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>URL ou nome do ícone</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">image</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>URL da imagem complementar</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">tag</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>Identificador da notificação</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">url</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>Link clicável da notificação</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">color</td>
              <td className="border px-2 py-1">string</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>Cor da notificação (hexadecimal ou nome CSS)</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">count</td>
              <td className="border px-2 py-1">number</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>Contador de notificações ou badge</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">metadata</td>
              <td className="border px-2 py-1">object</td>
              <td className="border px-2 py-1">Opcional</td>
              <td>Informações adicionais</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Exemplo de Requisição</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`const id = "user123";

const payload = {
  title: "Nova Atualização",
  body: "Você tem uma nova mensagem!",
  icon: "/icons/message.png",
  image: "/images/alert.png",
  tag: "alert-001",
  url: "https://meusite.com/notificacao",
  color: "#FF0000",
  count: 1,
  metadata: { priority: "high" }
};

const request = {
  ids: [id],
  payload,
  pushType: "single"
};

const response = await fetch('https://main-domain-example.online:7000/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});

const data = await response.json();
console.log(data);`}
        </pre>
      </section>

    </div>
  );
};

export default ApiDocumentation;
