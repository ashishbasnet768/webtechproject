const catalog = {
  noir: {
    name: 'VELMORA NOIR',
    notes: 'Amber · Woods · Spice',
    price: 1499,
  },
  aura: {
    name: 'VELMORA AURA',
    notes: 'Citrus · Fresh · Musk',
    price: 1299,
  },
  oud: {
    name: 'VELMORA OUD',
    notes: 'Oud · Woods · Amber',
    price: 1599,
  },
};

const bag = {};
const $ = (s) => document.querySelector(s);
const money = (n) => 'NPR ' + n.toLocaleString('en-IN');

$('#year').textContent = new Date().getFullYear();

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function add(id) {
  bag[id] = (bag[id] || 0) + 1;
  render();
  toast(catalog[id].name + ' added to your bag');
}

function render() {
  const entries = Object.entries(bag).filter(([, q]) => q > 0);
  const qty = entries.reduce((s, [, q]) => s + q, 0);
  const total = entries.reduce((s, [id, q]) => s + catalog[id].price * q, 0);

  $('#count').textContent = qty;
  $('#bagCount').textContent = '(' + qty + ')';
  $('#subtotal').textContent = money(total);

  $('#cartItems').innerHTML = entries.length
    ? entries
        .map(([id, q]) => {
          const p = catalog[id];
          return `
            <div class="cart-item">
              <div class="thumb">V</div>
              <div>
                <h3>${p.name}</h3>
                <p>${p.notes}</p>
                <div class="qty">
                  <button data-change="${id}" data-n="-1">−</button>
                  ${q}
                  <button data-change="${id}" data-n="1">+</button>
                </div>
              </div>
              <div>
                <span class="price">${money(p.price * q)}</span>
                <button class="remove" data-remove="${id}">Remove</button>
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="empty">
        <div>
          <b>V</b>
          <p>Your bag is waiting for its first scent.</p>
          <a href="#collection" id="explore">Explore the collection ↗</a>
        </div>
      </div>
    `;

  const explore = $('#explore');
  if (explore) {
    explore.addEventListener('click', closeCart);
  }
}

function openCart() {
  $('#cart').classList.add('show');
  $('#shade').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('#cart').classList.remove('show');
  $('#shade').classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const addButton = e.target.closest('[data-add]');
  if (addButton) {
    add(addButton.dataset.add);
  }

  const changeButton = e.target.closest('[data-change]');
  if (changeButton) {
    const id = changeButton.dataset.change;
    bag[id] = (bag[id] || 0) + Number(changeButton.dataset.n);

    if (bag[id] <= 0) {
      delete bag[id];
    }

    render();
  }

  const removeButton = e.target.closest('[data-remove]');
  if (removeButton) {
    delete bag[removeButton.dataset.remove];
    render();
  }
});

$('#openCart').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#shade').addEventListener('click', closeCart);

$('#menuToggle').addEventListener('click', () => {
  $('#nav').classList.toggle('open');
});

document.querySelectorAll('nav a').forEach((a) => {
  a.addEventListener('click', () => $('#nav').classList.remove('open'));
});

document.querySelectorAll('[data-note]').forEach((button) => {
  button.addEventListener('click', () => {
    const el = document.querySelector('.product-art.' + button.dataset.note);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 1200);
    }
  });
});

$('#newsletter').addEventListener('submit', (e) => {
  e.preventDefault();
  $('#newsMessage').textContent =
    'Thanks for your interest. This demo does not store or send your email.';
  $('#email').value = '';
});

$('#checkout').addEventListener('click', () => {
  if (!Object.values(bag).some((q) => q > 0)) {
    toast('Add a fragrance to your bag first');
    return;
  }

  closeCart();
  $('#orderResult').textContent = '';
  $('#orderDialog').showModal();
});

$('#closeDialog').addEventListener('click', () => $('#orderDialog').close());

$('#orderForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const items = Object.entries(bag).filter(([, q]) => q > 0);
  const list = items
    .map(([id, q]) => catalog[id].name + ' × ' + q)
    .join(', ');
  const total = items.reduce((s, [id, q]) => s + catalog[id].price * q, 0);

  $('#orderResult').textContent = `Sample order for ${$('#customerName').value}. Items: ${list}. Subtotal: ${money(total)}. Delivery: ${$('#address').value}. Phone: ${$('#phone').value}. This order has NOT been sent and no payment was taken.`;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
  }
});

render();
