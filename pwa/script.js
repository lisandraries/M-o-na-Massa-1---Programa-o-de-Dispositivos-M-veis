let telaAnterior = 'tela-home'
let telaAtual = 'tela-home'


function navegar(destino){
       let telas = document.getElementsByClassName('tela')
       Array.from(telas).forEach(element => {
           element.classList.remove('show')
           element.classList.add('collapse')
       });
       document.getElementById(destino).classList.remove('collapse')
       document.getElementById(destino).classList.add('show')
       telaAnterior = telaAtual
       telaAtual = destino
    }


function voltar() {
    navegar(telaAnterior)
}

function mostrarDetalhes(produto, imagem, categoria, preco, descricao, nota, avaliacoes){
        navegar('tela-produto')
        let detalhes = document.getElementById('detalhes-produto')
        detalhes.innerHTML =`
            <div class="row g-3">
                <div class="col-md-4 text-center">
                <img src="${imagem}" class="img-fluid" alt="${produto}">
                </div>
                <div class="col-md-8">
                <h2>${produto}</h2>
                <p><strong>Categoria:</strong> ${categoria}</p>
                <p><strong>Preço:</strong> R$ ${preco}</p>
                <p><strong>Descrição:</strong> ${descricao}</p>
                <p><strong>Avaliação:</strong> ${nota} ⭐ (${avaliacoes} avaliações)</p>
                </div>
            </div>
        `
   }

// Função que carrega produtos baseado em uma categoria escolhida
async function carregarPorCategoria(categoria) {


   try {
       let url;
       const telaLista = document.getElementById("tela-home");


       // Define URLs conforme categoria selecionada
       if (categoria === 'todos') {
           // limit=0 retorna todos os produtos 
           url = 'https://dummyjson.com/products?limit=0'
       }
       
       else if (categoria === "men's clothing") { 
            // Categoria correspondente a vestuário masculino 
            url = 'https://dummyjson.com/products/category/mens-shirts' 
        } 

        else if (categoria === 'electronics') { 
            // Smartphones como categoria de eletrônicos 
            url = 'https://dummyjson.com/products/category/smartphones' 
        } else if (categoria === 'jewelery') { 
            // Joias/acessórios 
            url = 'https://dummyjson.com/products/category/womens-jewellery' 
        }

       // Faz requisições 
       const response = await axios.get(url);


       const dados = response.data;
       const produtos = dados.products


       // Renderiza os produtos na tela principal
       telaLista.innerHTML = "";
       produtos.forEach(produto => {
           const card = document.createElement("div");
           card.className = "col";
           card.innerHTML = `
               <div class="card h-100" onclick="abrirDetalhes(${produto.id})">
               <img src="${produto.thumbnail}" class="card-img-top p-3" style="height:250px; object-fit:contain;">
               <div class="card-body">
                   <h5 class="card-title">${produto.title}</h5>
                   <p class="card-text">R$ ${produto.price.toFixed(2)}</p>
               </div>
               </div>
           `;
           telaLista.appendChild(card);
       });


       navegar('tela-home')
   } catch (error) {
       console.error("Erro ao carregar produtos:", error);
   }
}

carregarPorCategoria('todos')

// Função que carrega detalhes específicos de um produto
async function abrirDetalhes(id) {
  try {
      const detalhesProduto = document.getElementById("detalhes-produto");
     
      navegar('tela-produto')
      detalhesProduto.innerHTML = "Carregando..."
      const response = await axios.get(`https://dummyjson.com/products/${id}`)
      const p = response.data;




      detalhesProduto.innerHTML = `
      <div class="row g-3">
          <div class="col-md-4 text-center">
          <img src="${p.images[0]}" class="img-fluid" alt="${p.title}">
          </div>
          <div class="col-md-8">
          <h2>${p.title}</h2>
          <p><strong>Categoria:</strong> ${p.category}</p>
          <p><strong>Preço:</strong> R$ ${p.price.toFixed(2)}</p>
          <p><strong>Descrição:</strong> ${p.description}</p>
          <p><strong>Avaliação:</strong> ${p.rating} ⭐ </p>
          </div>
      </div>`


     
  } catch (error) {
      console.error("Erro ao carregar detalhes:", error)
  }
}

if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register("./service-worker.js");
}

let pedidoInstalacao = null;


// Verifica se o aplicativo já está instalado
window.addEventListener('appinstalled', function () {

    console.log("Aplicativo instalado!");

    document.getElementById("installAppBt").style.display = "none";

    pedidoInstalacao = null;
});


// Guarda o evento de instalação quando o navegador disponibilizar
window.addEventListener('beforeinstallprompt', function (evento) {

    evento.preventDefault();

    pedidoInstalacao = evento;

    console.log("Instalação disponível");

    document.getElementById("installAppBt").style.display = "block";

});


// Função chamada pelo botão
async function installApp() {

    if (!pedidoInstalacao) {

        alert("A instalação do aplicativo não está disponível neste momento.");

        return;
    }

    pedidoInstalacao.prompt();

    const resultado = await pedidoInstalacao.userChoice;

    console.log("Resultado:", resultado.outcome);

    if (resultado.outcome === 'accepted') {
        console.log("Usuário aceitou instalar.");
    }

    pedidoInstalacao = null;
}