(function () {
	// создаем и возвращаем заголовок приложения
	function createAppTitle(title) {
		let appTitle = document.createElement('h2');
		appTitle.innerHTML = title; // добавляет текст в элемент
		return appTitle;
	}

	// создаем и возвращаем форму для создания дела
	function createTodoItemForm() {
		let form = document.createElement('form');
		let input = document.createElement('input');
		let buttonWrapper = document.createElement('div');
		let button = document.createElement('button');

		form.classList.add('input-group', 'mb-3');
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дела';
		buttonWrapper.classList.add('input-group-append');
		button.classList.add('btn', 'btn-primary', 'disabled');
		button.textContent = 'Добавить новое дело';

		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		return {
			form,
			input,
			button,
		};
	}

	// создаем и возвращаем список элементов
	function createTodoList() {
		let list = document.createElement('ul');
		list.classList.add('list-group');
		return list;
	}

	function createTodoItem(name, done) {
		let item = document.createElement('li');
		// кнопки помещаем в элемент, который красиво покажет их в одной группе
		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		let deleteButton = document.createElement('button');

		// устанавливаем стили для элемента списка, а также для размещения кнопок
		// в его правой части с помощью flex
		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		item.textContent = name;

		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		doneButton.classList.add('btn', 'btn-success');
		doneButton.textContent = 'Готово';
		deleteButton.classList.add('btn', 'btn-danger');
		deleteButton.textContent = 'Удалить';

		// вкладываем кнопки в отдельный элемент, чтобы они обьединились в один блок
		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		// приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
		return {
			item,
			doneButton,
			deleteButton,
		};
	}

	function createTodoApp(container, title = 'Список дел', listName) {

		let todoAppTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();

		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);

    // обработчик кнопки в форме (disabled)
    todoItemForm.input.addEventListener('input', function() {
      if (!todoItemForm.input.value) {
        todoItemForm.button.classList.add('disabled');
				return;
			} else {
        todoItemForm.button.classList.remove('disabled');
      }
    })

    // получаем текущее состояние корзины
    let todoData = getCardData(listName);

    if (todoData === null) {
      todoData = [];
    } else {
      for (obj of todoData) {
        let todoItem = createTodoItem(obj.name, obj.done);
        // если в списке были выполненные дела, то отмечаем их сразу зеленым цветом
        if (obj.done === true) {
          todoItem.item.classList.toggle('list-group-item-success');
        }

        // добавляем обработчики на кнопки
        todoItem.doneButton.addEventListener('click', function () {
          todoItem.item.classList.toggle('list-group-item-success');

          let todoData = getCardData(listName);

          if (todoData === null) {
            todoData = [];
          }

          // обработчик done
          // перебираем дочерние элементы
          let listElements = document.querySelectorAll('ul > li');
          // сравниваем, не используя id, чтобы при удалении элементов не сбивался порядок
          for (let i = 0; i <= listElements.length; i++) {
            if (listElements[i] === todoItem.item) {
              if (todoData[i].done === false) {
                todoData[i].done = true;
              } else {
                todoData[i].done = false;
              }
            }
          }

          console.log(todoData);
          // запись в localStorage
          setCardData(listName, todoData);
        });

        todoItem.deleteButton.addEventListener('click', function () {
          let todoData = getCardData(listName);

          if (todoData === null) {
            todoData = [];
          }

          let listElements = document.querySelectorAll('ul > li');
          // сравниваем, сначала удаляем из массива, потом из DOM дерева, чтобы цикл работал корректно
          for (let i = 0; i <= listElements.length; i++) {
            if (listElements[i] === todoItem.item) {
              todoData.splice(i, 1);
            }
          }

          if (confirm('Вы уверены?')) {
            todoItem.item.remove();
          }

          console.log(todoData);
          // запись в localStorage
          setCardData(listName, todoData);
        })

        // создаем и добавляем в список новое дело с названием из поля для ввода
        todoList.append(todoItem.item);
      }
    }


		// браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
		todoItemForm.form.addEventListener('submit', function (e) {
			// эта строчка необходима чтобы предотвратить стандартное действие браузера
			// в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
			e.preventDefault();

			// игнорируем создание элемента, если пользователь ничего не ввел в поле
			if (!todoItemForm.input.value) {
				return;
			}

      let todoData = getCardData(listName);
      if (todoData === null) {
        todoData = [];
      }

      // добавляем данные в массив и вызываем функцию создания дела
      value = todoItemForm.input.value;
			let todoItem = createTodoItem(value, done = false);
      // определяем наибольшее id
      max = 0;
      for (let i = 0; i < todoData.length; i++) {
        max += 1;
      }
      let todoObj = {
        id: max,
        name: value,
        done: false,
      }
      todoData.push(todoObj);
      console.log(todoData);

      // запись в localStorage
      setCardData(listName, todoData);

			// добавляем обработчики на кнопки
			todoItem.doneButton.addEventListener('click', function () {
				todoItem.item.classList.toggle('list-group-item-success');

        let todoData = getCardData(listName);

        if (todoData === null) {
          todoData = [];
        }
        // обработчик done
        // перебираем дочерние элементы
        let listElements = document.querySelectorAll('ul > li');
        // сравниваем, не используя id, чтобы при удалении элементов не сбивался порядок
        for (let i = 0; i <= listElements.length; i++) {
          if (listElements[i] === todoItem.item) {
            if (todoData[i].done === false) {
              todoData[i].done = true;
            } else {
              todoData[i].done = false;
            }
          }
        }

        console.log(todoData);
        // запись в localStorage
        setCardData(listName, todoData);
			});

			todoItem.deleteButton.addEventListener('click', function () {
        let todoData = getCardData(listName);

        if (todoData === null) {
          todoData = [];
        }

        let listElements = document.querySelectorAll('ul > li');
        // сравниваем, сначала удаляем из массива, потом из DOM дерева, чтобы цикл работал корректно
        for (let i = 0; i <= listElements.length; i++) {
          if (listElements[i] === todoItem.item) {
            todoData.splice(i, 1);
          }
        }

        if (confirm('Вы уверены?')) {
					todoItem.item.remove();
				}

        console.log(todoData);
        // запись в localStorage
        setCardData(listName, todoData);
			})

			// создаем и добавляем в список новое дело с названием из поля для ввода
			todoList.append(todoItem.item);
			// обнуляем значение в поле, чтобы не пришлось стирать его вручную
			todoItemForm.input.value = '';
      todoItemForm.button.classList.add('disabled');
		});
	}

  // данный метод вернет данные из LocalStorage key = 'cardData'
  function getCardData(key) {
    let cardData = localStorage.getItem(key);
    return JSON.parse(cardData);
  };

  // данный метод запишет наши данные в localStorage
  function setCardData(key, data) {
    let strData = JSON.stringify(data);
    localStorage.setItem(key, strData);
  };

	window.createTodoApp = createTodoApp;
})();