var staticPath = "../../img/";

// Fetched from server
var products = [
  {
    id: 1,
    image: "prod1.png",
    name: "ULTIMATE SCANNER",
    availability: true,
    discount: "-50%",
    trial: "7-DAY TRIAL",
    price: 9.99
  },
  {
    id: 2,
    image: "prod2.png",
    name: "FX DECODER 2.0 COURSE",
    availability: false,
    discount: null,
    trial: null,
    price: 4.99
  },
  {
    id: 3,
    image: "prod3.png",
    name: "Scanner Ultimate 2.0",
    availability: true,
    discount: null,
    trial: null,
    price: 9.99
  },
  {
    id: 4,
    image: "prod4.png",
    name: "Ultimate Charting",
    availability: true,
    discount: "-50%",
    trial: null,
    price: 4.99
  },
  {
    id: 5,
    image: "prod5.png",
    name: "Scanner Pro 4",
    availability: true,
    discount: null,
    trial: null,
    price: 5.99
  }
];

// Fetched from server
var cart = [
  {
    prodId: 3
  },
  {
    prodId: 5
  }
];

!(function() {
  function App(products, cart) {
    this.products = [...products.map(el => ({ ...el }))];
    this.cart = [...cart.map(el => ({ ...el }))];
  }

  App.prototype.checkIfProdInCart = function(prodId) {
    let elemInCart = false;
    this.cart.forEach(cartEl => {
      if (cartEl.prodId == prodId) elemInCart = true;
    });
    return elemInCart;
  };

  App.prototype.renderCart = function() {
    let products = this.cart.map(el => {
      let { prodId } = el;

      let product = this.getProduct(prodId);

      return product;
    });

    let prodsCount = products.length;

    let prodsPrice = products.reduce(
      (curr, el) => new Decimal(el.price).plus(curr),
      0
    );

    let topLineTemplate = `<div class="cart_top_line flx jcsb">
			${
        prodsCount > 0
          ? `<span>${prodsCount} item${prodsCount > 1 ? "s" : ""} in cart</span>
						<span>$ ${prodsPrice}</span>`
          : "<span>Cart is empty!</span>"
      }
		</div>
		${
      prodsCount > 0
        ? `<button class="remove_all remove_all_js">CLEAR CART</button>`
        : ""
    }`;

    let cartTemplate = products.map(el => {
      return `<div class="flx jcsb aic cart_product">
				<div class="flx aic">
					<div class="cart_image">
						<img src="${staticPath + el.image}"/>
					</div>
					<div>
						<h3>${el.name}</h3>
						<a class="remove_js" data-id="${el.id}">Remove</a>
					</div>
				</div>
				<span>$ ${el.price}</span>
			</div>`;
    });

    $(".cart_count_js").text(prodsCount || "");
    $(".cart_top_line_js").html(topLineTemplate);
    $(".cart_content_js").html(cartTemplate);
  };

  App.prototype.getProduct = function(id) {
    let product = null;
    try {
      this.products.forEach(el => {
        if (el.id === id) {
          product = el;
          throw new Error("Product was finded");
        }
      });
    } catch (e) {
      if (e.message !== "Product was finded") throw e;
    }

    return product;
  };

  App.prototype.renderProducts = function() {
    let prodsTemplate = this.products.map(el => {
      let elemInCart = this.checkIfProdInCart(el.id);

      return `<div class="product flx fdc">
				<div class="prod_img">
					<img src="${staticPath + el.image}"/>
				</div>
				<div class="prod_body flx jcsb fdc">
					<h3 ${!el.availability ? 'class="not_available"' : ""}>${el.name}</h3>
					${el.trial ? `<p class="trial">${el.trial}</p>` : ""}
					<div class="prod_buttons flx jcfe">
						${el.discount ? `<span class="discount">${el.discount}</span>` : ""}
						${
              el.availability
                ? !elemInCart
                  ? `<button class="to_cart to_cart_js" data-id="${el.id}">$ ${
                      el.price
                    }</button>`
                  : `<span class="in_cart static_button">IN CART<span>`
                : `<span class="in_cart static_button">OWNED<span>`
            }
					</div>
				</div>
			</div>`;
    });

    $(".main_products_js").html(prodsTemplate);
  };

  App.prototype.init = function() {
    let self = this;

    self.renderProducts();
    self.renderCart();

    $("body").on("click", ".to_cart_js", function() {
      let id = +$(this).attr("data-id");
      let elemInCart = self.checkIfProdInCart(id);
      if (elemInCart) return;
      self.cart.push({ prodId: id });
      self.renderProducts();
      self.renderCart();
    });

    $("body").on("click", ".remove_js", function(e) {
      e.stopPropagation();
      let id = +$(this).attr("data-id");
      let indexToRemove;

      try {
        self.cart.forEach((el, index) => {
          if (el.prodId === id) {
            indexToRemove = index;
            throw new Error("Index was finded");
          }
        });
      } catch (e) {
        if (e.message !== "Index was finded") throw e;
      }

      self.cart.splice(indexToRemove, 1);
      self.renderProducts();
      self.renderCart();
    });

    $(".cart_button_js").click(function(e) {
      e.stopPropagation();
      $(this).addClass("active");
      $(".main_cart").addClass("active");
    });

    $(window).click(function() {
      $(".main_cart, .cart_button_js").removeClass("active");
    });

    $(".main_cart_js").click(function(e) {
      if (
        e.target.className.includes("remove_js") ||
        e.target.className.includes("remove_all_js")
      )
        return;
      e.stopPropagation();
    });

    $("body").on("click", ".remove_all_js", e => {
      e.stopPropagation();
      self.cart = [];
      self.renderProducts();
      self.renderCart();
    });
  };

  $(function() {
    let app = new App(products, cart);
    app.init();
  });
})();
