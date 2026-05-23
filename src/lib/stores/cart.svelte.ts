export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

function createCart() {
  let items = $state<CartItem[]>([]);

  return {
    get items() {
      return items;
    },
    get total() {
      return items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    get count() {
      return items.reduce((sum, i) => sum + i.qty, 0);
    },
    add(product: { id: string; name: string; price: number }) {
      const existing = items.find((i) => i.id === product.id);
      if (existing) existing.qty += 1;
      else items.push({ ...product, qty: 1 });
    },
    remove(id: string) {
      const idx = items.findIndex((i) => i.id === id);
      if (idx !== -1) items.splice(idx, 1);
    },
    clear() {
      items.length = 0;
    }
  };
}

export const cart = createCart();
