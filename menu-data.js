/**
 * Data Menu Salapan Coffee & Eatery
 * Diekstrak dari: daftar menu salapan fix.xlsx
 * Total: 74 Menu Aktif dalam 13 Kategori
 */

const CATEGORIES = [
  { id: "all", name: "Semua Menu", icon: "grid", color: "bg-stone-800 text-amber-400" },
  { id: "Signature & Special", name: "Signature & Special", icon: "sparkles", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "Classic Coffee", name: "Classic Coffee", icon: "coffee", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: "Flavored Latte", name: "Flavored Latte", icon: "cup-soda", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: "Manual Brew", name: "Manual Brew", icon: "filter", color: "bg-amber-600/20 text-amber-300 border-amber-600/30" },
  { id: "Non-Coffee", name: "Non-Coffee", icon: "milk", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "Mojito Series", name: "Mojito Series", icon: "glass-water", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { id: "Tea & Blended", name: "Tea & Blended", icon: "leaf", color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  { id: "Mocktails", name: "Mocktails", icon: "wine", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { id: "Snacks & Finger Food", name: "Snacks & Finger Food", icon: "cookie", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { id: "Steak & Ricebowl", name: "Steak & Ricebowl", icon: "beef", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: "Nasi & Ayam", name: "Nasi & Ayam", icon: "utensils", color: "bg-lime-500/20 text-lime-400 border-lime-500/30" },
  { id: "Mie & Kwetiau", name: "Mie & Kwetiau", icon: "soup", color: "bg-amber-700/20 text-amber-200 border-amber-700/30" },
  { id: "Pasta", name: "Pasta", icon: "wheat", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" }
];

const MENU_ITEMS = [
  // 1. Signature & Special
  { id: 1, name: "es kopi salapan", displayName: "Es Kopi Salapan", category: "Signature & Special", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Kopi susu khas racikan Salapan dengan gula aren premium" },
  { id: 2, name: "summer breeze", displayName: "Summer Breeze", category: "Signature & Special", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Perpaduan kopi segar dengan sensasi buah tropis musim panas" },
  { id: 3, name: "magic poison", displayName: "Magic Poison", category: "Signature & Special", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Minuman signature misterius dengan perpaduan rasa unik" },
  { id: 4, name: "butterscoth latte", displayName: "Butterscotch Latte", category: "Signature & Special", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Latte manis gurih creamy aroma butterscotch" },
  { id: 5, name: "nutella bomb", displayName: "Nutella Bomb", category: "Signature & Special", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Kombinasi melimpah cokelat hazelnut Nutella & susu segar" },
  { id: 6, name: "black lemon", displayName: "Black Lemon", category: "Signature & Special", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Espresso pekat dingin dipadukan dengan kesegaran sari lemon" },

  // 2. Classic Coffee
  { id: 7, name: "espresso", displayName: "Espresso", category: "Classic Coffee", price_offline: 13000, price_tax: 14300, price_online: 14500, desc: "Ekstraksi kopi murni kaya crema" },
  { id: 8, name: "americano", displayName: "Americano", category: "Classic Coffee", price_offline: 15000, price_tax: 16500, price_online: 16500, desc: "Espresso shot dengan air panas/dingin segar" },
  { id: 9, name: "cappucino", displayName: "Cappuccino", category: "Classic Coffee", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Espresso berbalut foam susu tebal dan lembut" },
  { id: 10, name: "affogato", displayName: "Affogato", category: "Classic Coffee", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "1 scoop es krim vanilla disiram double espresso panas" },
  { id: 11, name: "ice cube", displayName: "Ice Cube Coffee", category: "Classic Coffee", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Es batu kopi beku disajikan dengan susu segar dingin" },

  // 3. Flavored Latte
  { id: 12, name: "latte", displayName: "Cafe Latte", category: "Flavored Latte", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Espresso halus dengan steamed milk creamy" },
  { id: 13, name: "banana", displayName: "Banana Latte", category: "Flavored Latte", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Latte kopi dengan sirup aroma pisang legit" },
  { id: 14, name: "rum", displayName: "Rum Latte (Non-Alc)", category: "Flavored Latte", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Latte kopi harum butter-rum halal tanpa alkohol" },
  { id: 15, name: "cookie crumble", displayName: "Cookie Crumble Latte", category: "Flavored Latte", price_offline: 21000, price_tax: 23100, price_online: 23500, desc: "Latte lembut bertabur remahan biskuit renyah" },
  { id: 16, name: "caramel", displayName: "Caramel Latte", category: "Flavored Latte", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Latte klasik dengan sirup karamel bakar manis gurih" },
  { id: 17, name: "crème brulee", displayName: "Crème Brûlée Latte", category: "Flavored Latte", price_offline: 21000, price_tax: 23100, price_online: 23500, desc: "Latte dengan lapisan karamel renyah ala dessert Perancis" },

  // 4. Manual Brew
  { id: 18, name: "v60", displayName: "Manual Brew V60", category: "Manual Brew", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Seduhan pour over biji kopi single origin pilihan" },
  { id: 19, name: "vietnam drip", displayName: "Vietnam Drip", category: "Manual Brew", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Drip kopi tradisional dengan susu kental manis legit" },
  { id: 20, name: "japanese", displayName: "Japanese Iced Drip", category: "Manual Brew", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "V60 pour over langsung di atas es batu, rasa bersih dan segar" },

  // 5. Non-Coffee
  { id: 21, name: "coklat", displayName: "Signature Chocolate", category: "Non-Coffee", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Cokelat pekat lezat diseduh susu murni" },
  { id: 22, name: "matcha", displayName: "Matcha Latte", category: "Non-Coffee", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Teh hijau matcha Jepang otentik dengan susu lembut" },
  { id: 23, name: "red velvet", displayName: "Red Velvet Latte", category: "Non-Coffee", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Minuman red velvet manis lembut dengan sentuhan vanila" },

  // 6. Mojito Series
  { id: 24, name: "lime mojito", displayName: "Lime Mojito", category: "Mojito Series", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Soda dingin dengan jeruk nipis peras dan daun mint segar" },
  { id: 25, name: "orange mojito", displayName: "Orange Mojito", category: "Mojito Series", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Soda segar berpadu sari jeruk manis dan mint aromatik" },
  { id: 26, name: "Lychee mojito", displayName: "Lychee Mojito", category: "Mojito Series", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Mojito segar dengan buah leci utuh manis menyegarkan" },

  // 7. Tea & Blended
  { id: 27, name: "rum regal", displayName: "Rum Regal Shake", category: "Tea & Blended", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Susu manis beraroma rum halal dengan biskuit Marie Regal" },
  { id: 28, name: "milkshake oreo", displayName: "Milkshake Oreo", category: "Tea & Blended", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Blended ice cream vanilla dan remahan biskuit Oreo tebal" },
  { id: 29, name: "lemon tea", displayName: "Lemon Tea", category: "Tea & Blended", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Teh seduh wangi berpadu perasan lemon alami" },
  { id: 30, name: "lychee tea", displayName: "Lychee Tea", category: "Tea & Blended", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Es teh manis harum dengan topping buah leci" },
  { id: 31, name: "peach tea", displayName: "Peach Tea", category: "Tea & Blended", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Teh buah peach manis segar menyejukkan" },
  { id: 32, name: "earl grey", displayName: "Earl Grey Tea", category: "Tea & Blended", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Teh hitam klasik khas Inggris dengan aroma bergamot aromatik" },
  { id: 33, name: "traditional rempah", displayName: "Traditional Rempah", category: "Tea & Blended", price_offline: 16000, price_tax: 17600, price_online: 18000, desc: "Wedang rempah hangat tradisional penghangat tubuh" },

  // 8. Mocktails
  { id: 34, name: "butter beer", displayName: "Butter Beer (Non-Alc)", category: "Mocktails", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Minuman soda mentega manis gurih berbusa tebal" },
  { id: 35, name: "cotton candy", displayName: "Cotton Candy Mocktail", category: "Mocktails", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Mocktail manis manis playful warna pastel ceria" },
  { id: 36, name: "lime fantasy", displayName: "Lime Fantasy", category: "Mocktails", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Kreasi mocktail jeruk nipis dingin berkarbonasi" },
  { id: 37, name: "rainbow milk", displayName: "Rainbow Milk", category: "Mocktails", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Gradasi warna cerah susu beraroma buah warna-warni" },
  { id: 38, name: "rainbow tea", displayName: "Rainbow Tea", category: "Mocktails", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Teh infusi berlapis warna tropis menyegarkan" },

  // 9. Snacks & Finger Food
  { id: 39, name: "frech fries", displayName: "French Fries", category: "Snacks & Finger Food", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Kentang goreng renyah bumbu gurih dengan saus cocolan" },
  { id: 40, name: "mix platter", displayName: "Mix Platter Salapan", category: "Snacks & Finger Food", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Kombinasi sosis, nugget, dan kentang goreng porsi sharing" },
  { id: 41, name: "dimsum", displayName: "Dimsum Kukus (Isi 4)", category: "Snacks & Finger Food", price_offline: 15000, price_tax: 16500, price_online: 16500, desc: "Dimsum ayam lembut hangat disajikan chili oil" },
  { id: 42, name: "dimsum mentai", displayName: "Dimsum Mentai Panggang", category: "Snacks & Finger Food", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Dimsum ayam lezat disiram saus mentai gurih dibakar torched" },
  { id: 43, name: "cireng", displayName: "Cireng Crispy Bumbu Rujak", category: "Snacks & Finger Food", price_offline: 10000, price_tax: 11000, price_online: 11000, desc: "Cireng kenyal renyah khas Sunda dengan sambal rujak asam manis" },
  { id: 44, name: "Tahu baso", displayName: "Tahu Bakso Goreng", category: "Snacks & Finger Food", price_offline: 15000, price_tax: 16500, price_online: 16500, desc: "Tahu isi daging bakso kenyal gurih siap santap" },
  { id: 45, name: "corn ribs", displayName: "Crispy Corn Ribs", category: "Snacks & Finger Food", price_offline: 15000, price_tax: 16500, price_online: 16500, desc: "Irisan jagung manis goreng berbalut rempah gurih pedas" },
  { id: 46, name: "korean hotwings", displayName: "Korean Spicy Hotwings", category: "Snacks & Finger Food", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Sayap ayam crispy bersaus gochujang pedas manis Korea" },
  { id: 47, name: "salt pepper wings", displayName: "Salt & Pepper Wings", category: "Snacks & Finger Food", price_offline: 20000, price_tax: 22000, price_online: 22000, desc: "Sayap ayam goreng kering bumbu garam lada wangi" },
  { id: 48, name: "hotdogs", displayName: "Classic Hot Dog", category: "Snacks & Finger Food", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Roti lembut dengan sosis sapi panggang, mustard dan saus" },
  { id: 49, name: "burger", displayName: "Beef Burger Salapan", category: "Snacks & Finger Food", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Burger daging sapi lezat dengan sayuran segar dan keju gurih" },
  { id: 50, name: "baso aci", displayName: "Baso Aci Kuah Pedas", category: "Snacks & Finger Food", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Semangkuk baso aci kenyal dengan cuanki, sukro, kuah rempah pedas" },
  { id: 51, name: "pisang goreng", displayName: "Pisang Goreng Wijen", category: "Snacks & Finger Food", price_offline: 12000, price_tax: 13200, price_online: 13500, desc: "Pisang kepok manis renyah keemasan" },
  { id: 52, name: "singkong", displayName: "Singkong Goreng Merekah", category: "Snacks & Finger Food", price_offline: 10000, price_tax: 11000, price_online: 11000, desc: "Singkong pulen goreng bumbu bawang gurih" },
  { id: 53, name: "pempek", displayName: "Pempek Palembang", category: "Snacks & Finger Food", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Pempek ikan tenggiri kenyal dengan cuko hitam kental mantap" },
  { id: 54, name: "roti bakar crunchy choco", displayName: "Roti Bakar Crunchy Choco", category: "Snacks & Finger Food", price_offline: 12000, price_tax: 13200, price_online: 13500, desc: "Roti panggang mentega dengan selai cokelat crunchy legit" },
  { id: 55, name: "roti bakar cheese", displayName: "Roti Bakar Keju Susu", category: "Snacks & Finger Food", price_offline: 12000, price_tax: 13200, price_online: 13500, desc: "Roti panggang taburan keju cheddar parut melimpah & susu" },
  { id: 56, name: "roti bakar mix", displayName: "Roti Bakar Mix Cokelat Keju", category: "Snacks & Finger Food", price_offline: 13000, price_tax: 14300, price_online: 14500, desc: "Roti panggang perpaduan selai cokelat dan gurihnya keju" },

  // 10. Steak & Ricebowl
  { id: 57, name: "beef steak", displayName: "Prime Beef Steak", category: "Steak & Ricebowl", price_offline: 42000, price_tax: 46200, price_online: 47000, desc: "Daging sapi panggang empuk dengan saus lada hitam & kentang" },
  { id: 58, name: "chicken steak", displayName: "Crispy Chicken Steak", category: "Steak & Ricebowl", price_offline: 33000, price_tax: 36300, price_online: 37000, desc: "Fillet ayam renyah saus mushroom / blackpepper gurih nikmat" },
  { id: 59, name: "chicken ricebowl", displayName: "Chicken Rice Bowl", category: "Steak & Ricebowl", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Nasi hangat dengan potongan ayam renyah saus gurih" },
  { id: 60, name: "beef ricebowl", displayName: "Beef Rice Bowl", category: "Steak & Ricebowl", price_offline: 21000, price_tax: 23100, price_online: 23500, desc: "Nasi hangat dengan tumisan daging sapi saus teriyaki" },
  { id: 61, name: "beef bulgogi", displayName: "Beef Bulgogi Bowl", category: "Steak & Ricebowl", price_offline: 23000, price_tax: 25300, price_online: 25500, desc: "Irisan daging sapi berbumbu bulgogi manis gurih khas Korea" },
  { id: 62, name: "beef spicy", displayName: "Spicy Beef Rice Bowl", category: "Steak & Ricebowl", price_offline: 24000, price_tax: 26400, price_online: 26500, desc: "Tumisan daging sapi bumbu sambal pedas nampol di atas nasi" },

  // 11. Nasi & Ayam
  { id: 63, name: "nasi goreng rempah", displayName: "Nasi Goreng Rempah", category: "Nasi & Ayam", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Nasi goreng kaya aroma rempah tradisional dengan telur & kerupuk" },
  { id: 64, name: "nasi goreng salapan", displayName: "Nasi Goreng Salapan Special", category: "Nasi & Ayam", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Nasi goreng racikan khas chef Salapan gurih mantap" },
  { id: 65, name: "nasi ayam geprek", displayName: "Nasi Ayam Geprek Sambal Bawang", category: "Nasi & Ayam", price_offline: 19000, price_tax: 20900, price_online: 21000, desc: "Ayam crispy digeprek dengan ulekan sambal bawang pedas segar" },
  { id: 66, name: "nasi ayam fried chicken", displayName: "Nasi Ayam Fried Chicken", category: "Nasi & Ayam", price_offline: 17000, price_tax: 18700, price_online: 19000, desc: "Nasi putih hangat dengan ayam goreng krispi renyah keemasan" },

  // 12. Mie & Kwetiau
  { id: 67, name: "Kwetiau Goreng", displayName: "Kwetiau Goreng Spesial", category: "Mie & Kwetiau", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Kwetiau kenyal digoreng harum dengan telur dan sayuran segar" },
  { id: 68, name: "mie goreng salapan", displayName: "Mie Goreng Salapan", category: "Mie & Kwetiau", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Mie kuning goreng resep rahasia Salapan dengan citarasa gurih manis" },
  { id: 69, name: "mie pedas", displayName: "Mie Jebew Pedas Salapan", category: "Mie & Kwetiau", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Mie kenyal diaduk dengan minyak cabai pedas berlevel" },
  { id: 70, name: "indomie rebus", displayName: "Indomie Rebus Special Telur", category: "Mie & Kwetiau", price_offline: 12000, price_tax: 13200, price_online: 13500, desc: "Indomie kuah hangat disajikan dengan telur dan sayuran" },
  { id: 71, name: "indomie goreng", displayName: "Indomie Goreng Special Telur", category: "Mie & Kwetiau", price_offline: 12000, price_tax: 13200, price_online: 13500, desc: "Indomie goreng legendaris dengan tambahan telur ceplok" },
  { id: 72, name: "ramen", displayName: "Japanese Ramen Salapan", category: "Mie & Kwetiau", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Mie ramen kuah gurih kaldu khas dengan topping komplit" },

  // 13. Pasta
  { id: 73, name: "carbonara", displayName: "Spaghetti Carbonara", category: "Pasta", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Pasta spaghetti berbalut saus keju creamy gurih beraroma smoked beef" },
  { id: 74, name: "bolognese", displayName: "Spaghetti Bolognese", category: "Pasta", price_offline: 18000, price_tax: 19800, price_online: 20000, desc: "Pasta spaghetti dengan saus daging tomat cincang khas Italia" }
];

// Helper Functions
function formatRupiah(amount) {
  if (isNaN(amount) || amount === null) return "Rp 0";
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}

function getPriceByTier(item, tier) {
  switch (tier) {
    case "tax":
      return item.price_tax;
    case "online":
      return item.price_online;
    case "offline":
    default:
      return item.price_offline;
  }
}
