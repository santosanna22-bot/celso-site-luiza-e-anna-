// CÓDIGO JAVASCRIPT COMPLETO E FUNCIONAL (COM PERSISTÊNCIA VIA LOCALSTORAGE)

        // Variáveis que vão armazenar os elementos HTML
        let cart = []; // Array principal que armazena os itens do carrinho
        let cartCounterElement, cartListElement, cartTotalElement, cartPanelElement, cartIconElement;

        // Garante que o código só rode depois que o HTML estiver carregado
        window.onload = function() {
            // 1. Referências aos elementos HTML
            cartCounterElement = document.getElementById('cart-counter');
            cartListElement = document.getElementById('cart-list');
            cartTotalElement = document.getElementById('cart-total');
            cartPanelElement = document.getElementById('cart-panel');
            cartIconElement = document.querySelector('.cart-icon');
            
            // NOVIDADE: Carrega o carrinho salvo no localStorage
            loadCart();
            
            // 2. Inicializa a exibição do carrinho
            updateCartDisplay();
        };

        /**
         * SALVA o array 'cart' no navegador usando localStorage.
         */
        function saveCart() {
            localStorage.setItem('megaCellCart', JSON.stringify(cart));
        }

        /**
         * CARREGA o array 'cart' do localStorage.
         */
        function loadCart() {
            const savedCart = localStorage.getItem('megaCellCart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
        }

        /**
         * Adiciona um produto ao carrinho.
         * @param {HTMLElement} buttonElement - O botão "COMPRAR" clicado.
         */
        function addToCart(buttonElement) {
            const productName = buttonElement.getAttribute('data-name');
            const price = parseFloat(buttonElement.getAttribute('data-price')); 

            if (isNaN(price)) {
                console.error("Erro: Preço inválido no data-price para " + productName);
                return;
            }

            let found = cart.find(item => item.name === productName);

            if (found) {
                found.quantity++;
            } else {
                const newItem = { name: productName, price: price, quantity: 1 };
                cart.push(newItem);
            }
            
            saveCart();
            updateCartDisplay();
            
            if (cartIconElement) {
                cartIconElement.classList.add('flash-cart');
                setTimeout(() => {
                    cartIconElement.classList.remove('flash-cart');
                }, 500);
            }
        }

        /**
         * Remove UMA unidade de um produto do carrinho.
         * @param {string} productName - O nome do produto a ser removido/decrementado.
         */
        function removeFromCart(productName) {
             let itemIndex = cart.findIndex(item => item.name === productName);

            if (itemIndex > -1) {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity === 0) {
                    cart.splice(itemIndex, 1);
                }
            }
            
            saveCart();
            updateCartDisplay();
        }

        /**
         * Atualiza o contador de itens e a lista de produtos no painel.
         */
        function updateCartDisplay() {
            let totalItems = 0;
            let totalPrice = 0;
            
            if (!cartListElement) return;

            cartListElement.innerHTML = ''; // Limpa a lista antes de renderizar

            if (cart.length === 0) {
                const li = document.createElement('li');
                li.className = 'empty-message';
                li.textContent = 'Nenhum celular selecionado...';
                cartListElement.appendChild(li);
                
                localStorage.removeItem('megaCellCart');
            } else {
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    
                    totalItems += item.quantity;
                    totalPrice += itemTotal;

                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="item-name">${item.name}</span>
                        <span class="item-details">
                            ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')} 
                        </span>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">x</button>
                    `;
                    cartListElement.appendChild(li);
                });
            }

            if (cartCounterElement) cartCounterElement.textContent = totalItems;
            if (cartTotalElement) cartTotalElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        }

        /**
         * Abre e fecha o painel lateral do carrinho.
         */
        function toggleCart() {
            if (!cartPanelElement) return;
            
            cartPanelElement.classList.toggle('open');
            
            if (cartPanelElement.classList.contains('open')) {
                 updateCartDisplay();
            }
        }
    </script>
</body>
</html>