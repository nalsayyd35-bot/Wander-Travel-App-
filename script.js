// بيانات الوجهات السياحية من المجلد المحلي images/
const destinations = [
  { id: 1, name: "جزيرة بالي، إندونيسيا", category: "beach", price: 650, image: "images/bail.jpg", desc: "استمتع بالشواطئ الفيروزية والشلالات الساحرة والطبيعة الخلابة." },
  { id: 2, name: "جبال الألب، سويسرا", category: "mountain", price: 920, image: "images/swiss-alps.jpg", desc: "رحلة استرخاء ومغامرات بين القمم الثلجية والمروج الخضراء." },
  { id: 3, name: "روما التاريخية، إيطاليا", category: "cultural", price: 780, image: "images/rome.jpg", desc: "جولة بين المعالم الرومانية القديمة والأزقة العتيقة والمطاعم الشهيرة." },
  { id: 4, name: "جزر المالديف", category: "beach", price: 1100, image: "images/maldives.jpg", desc: "منتجعات فوق الماء مع أقصى درجات الخصوصية والراحة." },
  { id: 5, name: "كابادوكيا، تركيا", category: "cultural", price: 540, image: "images/cappadocia.jpg", desc: "تجربة المنطاد الهوائي الساحر فوق الفنادق الصخرية والوديان." }
];

let selectedDest = null;

const destGrid = document.getElementById("destGrid");
const bookModal = document.getElementById("bookModal");
const toast = document.getElementById("toast");

// رسم البطاقات
function renderDestinations(items = destinations) {
  destGrid.innerHTML = "";
  if (items.length === 0) {
    destGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; font-size: 18px; padding: 20px;">لا توجد وجهات تطابق البحث.</p>`;
    return;
  }
  items.forEach(dest => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}">
      <div class="card-body">
        <h3>${dest.name}</h3>
        <p>${dest.desc}</p>
        <div class="card-footer">
          <span class="price-tag">${dest.price} $</span>
          <button class="btn btn-accent" onclick="openBooking(${dest.id})">احجز الآن ✈️</button>
        </div>
      </div>
    `;
    destGrid.appendChild(card);
  });
}

// التبويبات الفورية
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    const filter = e.target.dataset.filter;
    const filtered = filter === "all" ? destinations : destinations.filter(d => d.category === filter);
    renderDestinations(filtered);
  });
});

// فتح نافذة الحجز التفاعلية
function openBooking(id) {
  selectedDest = destinations.find(d => d.id === id);
  if (!selectedDest) return;

  document.getElementById("modalDestName").innerText = selectedDest.name;
  document.getElementById("modalBasePrice").innerText = `${selectedDest.price} $ / للشخص الأساسي`;
  
  calculateTotal();
  bookModal.classList.add("open");
}

function closeModal() {
  bookModal.classList.remove("open");
}

document.getElementById("closeModal").addEventListener("click", closeModal);
bookModal.addEventListener("click", (e) => {
  if (e.target === bookModal) closeModal();
});

// حاسبة التكلفة التفاعلية
function calculateTotal() {
  if (!selectedDest) return;
  const people = parseInt(document.getElementById("numPeople").value) || 1;
  const days = parseInt(document.getElementById("numDays").value) || 1;

  let base = selectedDest.price * people;
  
  if (document.getElementById("addFlight").checked) base += 250 * people;
  if (document.getElementById("addGuide").checked) base += 80 * days;

  document.getElementById("calcTotal").innerText = `${base} $`;
}

document.getElementById("numPeople").addEventListener("input", calculateTotal);
document.getElementById("numDays").addEventListener("input", calculateTotal);
document.getElementById("addFlight").addEventListener("change", calculateTotal);
document.getElementById("addGuide").addEventListener("change", calculateTotal);

// البحث التفاعلي الفوري + تمرير شاشة للنتائج
function handleSearch() {
  const query = document.getElementById("searchDest").value.trim().toLowerCase();
  const cat = document.getElementById("searchCategory").value;

  const filtered = destinations.filter(d => {
    const matchesQuery = d.name.toLowerCase().includes(query) || d.desc.toLowerCase().includes(query);
    const matchesCat = cat === "all" || d.category === cat;
    return matchesQuery && matchesCat;
  });

  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === cat);
  });

  renderDestinations(filtered);
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("searchCategory").addEventListener("change", handleSearch);

// تأكيد الحجز
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
  showToast("تم إرسال طلب الحجز بنجاح! يتواصل معك خبير السفر قريباً ✨");
});

function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

renderDestinations();