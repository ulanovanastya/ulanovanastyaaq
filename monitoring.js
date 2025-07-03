
(() => {
    const table = document.getElementById('equipmentTable');
    const tbody = table.querySelector('tbody');
    const headers = table.querySelectorAll('th.sortable');
    let sortState = { key: null, order: 'asc' };

    function parseDate(dateStr) {
        const d = Date.parse(dateStr);
        return isNaN(d) ? 0 : d;
    }

    function compareRows(rowA, rowB, key) {
        const indexMap = { equipment: 0, lastMaintenance: 2, serviceType: 4 };
        const idx = indexMap[key];
        const cellA = rowA.cells[idx].textContent.trim();
        const cellB = rowB.cells[idx].textContent.trim();

        if (key === 'lastMaintenance') {
            return parseDate(cellA) - parseDate(cellB);
        }
        return cellA.localeCompare(cellB, 'ru', { sensitivity: 'base' });
    }

    function clearSortIndicators() {
        headers.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });
    }

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const key = header.getAttribute('data-key');
            let newOrder = 'asc';
            if (sortState.key === key && sortState.order === 'asc') {
                newOrder = 'desc';
            }
            sortState = { key, order: newOrder };

            const rowsArray = Array.from(tbody.rows);
            rowsArray.sort((a, b) => {
                const res = compareRows(a, b, key);
                return newOrder === 'asc' ? res : -res;
            });

            tbody.innerHTML = '';
            rowsArray.forEach(row => tbody.appendChild(row));

            clearSortIndicators();
            header.classList.add(newOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
        });
    });

    const filterEquipment = document.getElementById('filterEquipment');
    const filterDate = document.getElementById('filterDate');
    const filterServiceType = document.getElementById('filterServiceType');
    const filterBtn = document.getElementById('filterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    function filterTable() {
        const equipmentVal = filterEquipment.value.trim();
        const dateVal = filterDate.value;
        const serviceTypeVal = filterServiceType.value.trim();

        for (const row of tbody.rows) {
            const eq = row.cells[0].textContent.trim();
            const lastDate = row.cells[2].textContent.trim();
            const service = row.cells[4].textContent.trim();

            let show = true;

            if (equipmentVal && eq !== equipmentVal)
                show = false;
            if (serviceTypeVal && service !== serviceTypeVal)
                show = false;
            if (dateVal && lastDate !== dateVal)
                show = false;

            row.style.display = show ? '' : 'none';
        }
    }

    filterBtn.addEventListener('click', filterTable);
    clearFilterBtn.addEventListener('click', () => {
        filterEquipment.value = '';
        filterDate.value = '';
        filterServiceType.value = '';
        for (const row of tbody.rows) {
            row.style.display = '';
        }
    });

    const createRequestButton = document.getElementById('createRequestButton');
    const modal = document.getElementById('requestModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const requestForm = document.getElementById('requestForm');
    const messageDiv = document.getElementById('message');

    const equipmentSelect = document.getElementById('equipmentSelect');
    const dateInput = document.getElementById('dateInput');
    const serviceTypeSelect = document.getElementById('serviceTypeSelect');

    const equipmentError = document.getElementById('equipmentError');
    const dateError = document.getElementById('dateError');
    const serviceTypeError = document.getElementById('serviceTypeError');

    function resetErrors() {
        equipmentError.style.display = 'none';
        dateError.style.display = 'none';
        serviceTypeError.style.display = 'none';
    }


function openModal() {
        resetErrors();
        requestForm.reset();
        messageDiv.textContent = '';
        modal.style.display = 'flex';
        equipmentSelect.focus();
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    createRequestButton.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    requestForm.addEventListener('submit', e => {
        e.preventDefault();
        resetErrors();

        let valid = true;

        if (!equipmentSelect.value) {
            equipmentError.style.display = 'block';
            valid = false;
        }
        if (!dateInput.value) {
            dateError.style.display = 'block';
            valid = false;
        }
        if (!serviceTypeSelect.value) {
            serviceTypeError.style.display = 'block';
            valid = false;
        }

        if (!valid) return;

        closeModal();
       messageDiv.textContent = `Заявка на ${equipmentSelect.value}, тип: ${serviceTypeSelect.value}, дата: ${dateInput.value} создана! Рассмотрение заявки займет 2-3 рабочих дня.`;
    });
})();




// Простой тестовый фреймворк
const Test = {
    totalTests: 0,
    passedTests: 0,
    
    describe(description, fn) {
        console.group(`DESCRIBE: ${description}`);
        this.currentDescribe = description;
        try {
            fn();
        } catch (e) {
            console.error('Test suite failed:', e);
        }
        console.groupEnd();
    },
    
    it(testName, fn) {
        this.totalTests++;
        try {
            fn();
            this.passedTests++;
            console.log(`✓ IT: ${testName}`);
        } catch (e) {
            console.error(`✕ IT: ${testName}`, e.message);
        }
    },
    
    expect(actual) {
        return {
            toBe(expected) {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toBeTruthy() {
                if (!actual) {
                    throw new Error(`Expected truthy value, but got ${actual}`);
                }
            },
            toBeFalsy() {
                if (actual) {
                    throw new Error(`Expected falsy value, but got ${actual}`);
                }
            }
        };
    }
};

// Запускаем тесты после загрузки страницы
window.addEventListener('DOMContentLoaded', () => {
    // Получаем доступ к элементам и функциям из вашего кода
    const table = document.getElementById('equipmentTable');
    const tbody = table.querySelector('tbody');
    const modal = document.getElementById('requestModal');
    const requestForm = document.getElementById('requestForm');
    const createRequestButton = document.getElementById('createRequestButton');
    const cancelBtn = document.getElementById('cancelBtn');
    const equipmentSelect = document.getElementById('equipmentSelect');
    const dateInput = document.getElementById('dateInput');
    const serviceTypeSelect = document.getElementById('serviceTypeSelect');
    const equipmentError = document.getElementById('equipmentError');
    const dateError = document.getElementById('dateError');
    const serviceTypeError = document.getElementById('serviceTypeError');


// Тест 1: Проверка функции фильтрации
Test.describe('Фильтрация таблицы', () => {
    Test.it('должна правильно фильтровать по оборудованию', () => {
        // Подготавливаем тестовые данные
        const originalRows = Array.from(tbody.rows);
        
        // Устанавливаем фильтр для "Станок №1" и применяем
        filterEquipment.value = 'Станок №1';
        filterBtn.click();
        
        // Проверяем, что отображаются только строки с "Станок №1"
        const filteredRows = Array.from(tbody.rows).filter(row => row.style.display !== 'none');
        filteredRows.forEach(row => {
            Test.expect(row.cells[0].textContent.trim()).toBe('Станок №1');
        });
        
        // Проверяем, что количество отфильтрованных строк меньше или равно исходному
        Test.expect(filteredRows.length <= originalRows.length).toBeTruthy();
        
        // Сбрасываем фильтры
        clearFilterBtn.click();
    });

    Test.it('должна правильно фильтровать по типу обслуживания', () => {
        // Устанавливаем фильтр для "Ремонт" и применяем
        filterServiceType.value = 'Ремонт';
        filterBtn.click();
        
        // Проверяем, что отображаются только строки с "Ремонт"
        const filteredRows = Array.from(tbody.rows).filter(row => row.style.display !== 'none');
        filteredRows.forEach(row => {
            Test.expect(row.cells[4].textContent.trim()).toBe('Ремонт');
        });
        
        // Сбрасываем фильтры
        clearFilterBtn.click();
    });

    Test.it('должна правильно фильтровать по дате', () => {
        // Устанавливаем фильтр для конкретной даты и применяем
        filterDate.value = '2025-05-20';
        filterBtn.click();
        
        // Проверяем, что отображаются только строки с указанной датой
        const filteredRows = Array.from(tbody.rows).filter(row => row.style.display !== 'none');
        filteredRows.forEach(row => {
            Test.expect(row.cells[2].textContent.trim()).toBe('2025-05-20');
        });
        
        // Сбрасываем фильтры
        clearFilterBtn.click();
    });

    Test.it('должна правильно работать с комбинированными фильтрами', () => {
        // Устанавливаем несколько фильтров одновременно
        filterEquipment.value = 'Станок №1';
        filterServiceType.value = 'Ремонт';
        filterBtn.click();
        
        // Проверяем, что отображаются только соответствующие строки
        const filteredRows = Array.from(tbody.rows).filter(row => row.style.display !== 'none');
        filteredRows.forEach(row => {
            Test.expect(row.cells[0].textContent.trim()).toBe('Станок №1');
            Test.expect(row.cells[4].textContent.trim()).toBe('Ремонт');
        });
        
        // Сбрасываем фильтры
        clearFilterBtn.click();
    });

    Test.it('должна правильно сбрасывать фильтры', () => {
        // Устанавливаем фильтры
        filterEquipment.value = 'Станок №1';
        filterServiceType.value = 'Ремонт';
        filterBtn.click();
        
        // Сбрасываем фильтры
        clearFilterBtn.click();
        
        // Проверяем, что все строки отображаются
        const allRowsVisible = Array.from(tbody.rows).every(row => row.style.display === '');
        Test.expect(allRowsVisible).toBeTruthy();
        
        // Проверяем, что поля фильтров очищены
        Test.expect(filterEquipment.value).toBe('');
        Test.expect(filterServiceType.value).toBe('');
        Test.expect(filterDate.value).toBe('');
    });
});
    // Тест 2: Проверка валидации формы
    Test.describe('Валидация формы заявки', () => {
        Test.it('должна показывать ошибки при пустых полях', () => {
            // Подготавливаем форму
            equipmentSelect.value = '';
            dateInput.value = '';
            serviceTypeSelect.value = '';
            
            // Сбрасываем ошибки
            equipmentError.style.display = 'none';
            dateError.style.display = 'none';
            serviceTypeError.style.display = 'none';
            
            // Имитируем отправку формы
            const event = new Event('submit', { cancelable: true });
            requestForm.dispatchEvent(event);
            
            // Проверяем, что ошибки отображаются
            Test.expect(equipmentError.style.display).toBe('block');
            Test.expect(dateError.style.display).toBe('block');
            Test.expect(serviceTypeError.style.display).toBe('block');
        });
    });

    // Тест 3: Проверка работы модального окна
    Test.describe('Модальное окно', () => {
        Test.it('должно открываться и закрываться', () => {
            createRequestButton.click();
            Test.expect(window.getComputedStyle(modal).display).toBe('flex');
            cancelBtn.click();
            Test.expect(window.getComputedStyle(modal).display).toBe('none');
        });
    });
    console.log(`Тесты завершены: ${Test.passedTests} из ${Test.totalTests} пройдены успешно`);
});


// Валидация формы заявки
requestForm.addEventListener('submit', e => {
    e.preventDefault();
    resetErrors();

    let valid = true;
    if (!equipmentSelect.value) {
        equipmentError.style.display = 'block';
        valid = false;
    }
    if (!dateInput.value) {
        dateError.style.display = 'block';
        valid = false;
    }
    if (!serviceTypeSelect.value) {
        serviceTypeError.style.display = 'block';
        valid = false;
    }

    if (valid) {
        closeModal();
        showSuccessMessage();
    }
});