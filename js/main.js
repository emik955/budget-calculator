// DATA
const budget = [];

// DOM
const form = document.querySelector("#form");
const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");
const incomesList = document.querySelector("#incomes-list");
const expensesList = document.querySelector("#expenses-list");

const budgetEl = document.querySelector("#budget");
const totalIncEl = document.querySelector("#total-income");
const totalExpenseEl = document.querySelector("#total-expense");
const percentsWrapper = document.querySelector("#expense-percents-wrapper");

const monthEl = document.querySelector("#month");
const yearEl = document.querySelector("#year");

// Functions
const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function insertTestData() {
  const testData = [
    { type: "inc", title: "Фриланс", value: 500 },
    { type: "inc", title: "Зарплата", value: 1500 },
    { type: "inc", title: "Бизнес", value: 1500 },
    { type: "exp", title: "Еда", value: 100 },
    { type: "exp", title: "Топливо", value: 100 },
    { type: "exp", title: "Иные", value: 120 },
  ];

  // Получить рандомный индекс от 0 до 5
  function getRandomInc(max) {
    return ~~(Math.random() * max);
  }

  const randonIndex = getRandomInc(testData.length - 1);

  const randomData = testData[randonIndex];

  type.value = randomData.type;
  title.value = randomData.title;
  value.value = randomData.value;
}

function clearForm() {
  form.reset();
}

function calcBudget() {
  // Считаем общий доход
  const totalInc = budget.reduce((total, el) => {
    if (el.type === "inc") {
      return total + el.value;
    } else {
      return total;
    }
  }, 0);

  // Считаем общий расход
  const totalExpense = budget.reduce((total, el) => {
    if (el.type === "exp") {
      return total + el.value;
    } else {
      return total;
    }
  }, 0);

  const totalBudget = totalInc - totalExpense;
  console.log(totalBudget);

  let expensePercent = 0;
  if (totalInc) {
    expensePercent = Math.round((totalExpense * 100) / totalInc);
  }

  budgetEl.innerHTML = priceFormatter.format(totalBudget);
  totalIncEl.innerHTML = "+ " + priceFormatter.format(totalInc);
  totalExpenseEl.innerHTML = "- " + priceFormatter.format(totalExpense);

  if (expensePercent) {
    const html = `<div class="badge">${expensePercent}%</div>`;
    percentsWrapper.innerHTML = html;
  } else {
    percentsWrapper.innerHTML = "";
  }
}

function displayMonth() {
  const now = new Date();
  const year = now.getFullYear();

  const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
  });

  const month = timeFormatter.format(now);

  monthEl.innerHTML = month;
  yearEl.innerHTML = year;
}

// Actions
displayMonth();
insertTestData();
calcBudget();

// Добавление записи
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Проверка формы на заполненность
  if (title.value.trim() === "") {
    title.classList.add("form__input--error");
    return;
  } else {
    title.classList.remove("form__input--error");
  }

  if (value.value.trim() === "" || +value.value <= 0) {
    value.classList.add("form__input--error");
    return;
  } else {
    value.classList.remove("form__input--error");
  }

  // Рассчет айди
  let id = 1;
  if (budget.length > 0) {
    //id = budget[budget.length - 1].id + 1
    const lastElement = budget[budget.length - 1];
    const lastElId = lastElement.id;
    id = lastElId + 1;
  }
  // Формурием запись
  const record = {
    id: id,
    type: type.value,
    title: title.value.trim(),
    value: +value.value,
  };
  // Добавялем запись в данные
  budget.push(record);
  // Отображаем доход на странице
  if (record.type === "inc") {
    const html = `<li data-id='${
      record.id
    }' class="budget-list__item item item--income">
                        <div class="item__title">${record.title}</div>
                        <div class="item__right">
                        <div class="item__amount">+ ${priceFormatter.format(
                          record.value
                        )}</div>
                      <button class="item__remove">
                      <img src="./img/circle-green.svg" alt="delete" />
                      </button>
                      </div>
                      </li>`;
    incomesList.insertAdjacentHTML("afterbegin", html);
  }

  // Отображаем расход на странице
  if (record.type === "exp") {
    const html = `<li data-id="${
      record.id
    }" class="budget-list__item item item--expense">
                    <div class="item__title">${record.title}</div>
                    <div class="item__right">
                      <div class="item__amount">
                        - ${priceFormatter.format(record.value)}
                      </div>
                      <button class="item__remove">
                        <img src="./img/circle-red.svg" alt="delete" />
                      </button>
                    </div>
                  </li>`;
    expensesList.insertAdjacentHTML("afterbegin", html);
  }

  calcBudget();

  clearForm();
  insertTestData();
});
// Удаление записи
document.body.addEventListener("click", (e) => {
  // Кнопка удалить
  if (e.target.closest("button.item__remove")) {
    const recordElement = e.target.closest("li.budget-list__item");
    const id = +recordElement.dataset.id;
    const index = budget.findIndex(function (el) {
      if (id === el.id) return true;
    });
    // Удаляем из массива
    budget.splice(index, 1);
    // Удаляем задачу из разметки
    recordElement.remove();
    calcBudget();
  }
});
