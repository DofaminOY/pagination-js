const root = document.querySelector("#root");
const topPagination = document.querySelector("#top-pagination");
const pagination = document.querySelector("#pagination");

const LIMIT = 20;
const TOTAL_POSTS = 100;
const TOTAL_PAGES = Math.ceil(TOTAL_POSTS / LIMIT);

let currentPage = 3;

let isLoading = false;

async function loadPosts() {
  if (isLoading) return;

  isLoading = true;
  root.textContent = "Загрузка...";

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${LIMIT}`,
    );
    if (!response.ok) {
      throw new Error("Ошибка при запросе");
    }
    const data = await response.json();
    isLoading = false;
    renderPosts(data);

    // ИЗМЕНЕНО: рендерим пагинацию сверху и снизу
    renderPagination(topPagination);
    renderPagination(pagination);
  } catch (e) {
    isLoading = false;
    root.textContent = e.message;
    root.style.color = "red";
  }
}
loadPosts();

function renderPosts(posts) {
  root.innerHTML = "";
  posts.forEach((post) => {
    const container = document.createElement("div");
    container.classList.add("post");
    container.innerHTML = `
  <h3>${post.title}</h3>
  <p>${post.body}</p>
  `;
    root.append(container);
  });
}
function renderPagination(container) {
  container.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Назад";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage--;
    loadPosts();
  });
  container.append(prevButton);

  const nextButton = document.createElement("button");
  nextButton.textContent = "Вперед";
  nextButton.disabled = currentPage === TOTAL_PAGES;

  nextButton.addEventListener("click", () => {
    currentPage++;
    loadPosts();
  });

  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      loadPosts();
    });
    container.append(pageBtn);
  }
  container.append(nextButton);
}
