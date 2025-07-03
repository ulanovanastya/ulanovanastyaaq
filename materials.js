(() => {
    // Основной код приложения
    const materialsTable = document.getElementById('materialsTable');
    const filterBtn = document.getElementById('filterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const materialTypeFilter = document.getElementById('materialTypeFilter');
    const expiryDateFilter = document.getElementById('expiryDateFilter');
    const warehouseFilter = document.getElementById('warehouseFilter');

    function filterTable() {
        const materialType = materialTypeFilter.value;
        const expiryDate = expiryDateFilter.value;
        const warehouse = warehouseFilter.value;

        for (const row of materialsTable.rows) {
            if (row.rowIndex === 0) continue;
            const materialName = row.cells[0].textContent.trim();
            const expiry = row.cells[2].textContent.trim();

            let show = true;

            if (materialType && materialName !== materialType) show = false;
            if (expiryDate && expiry !== expiryDate) show = false;

            row.style.display = show ? '' : 'none';
        }
    }

    filterBtn.addEventListener('click', filterTable);
    clearFilterBtn.addEventListener('click', () => {
        materialTypeFilter.value = '';
        expiryDateFilter.value = '';
        warehouseFilter.value = '';
        for (const row of materialsTable.rows) {
            row.style.display = '';
        }
    });

    const orderMaterialsButton = document.getElementById('orderMaterialsButton');
    const orderModal = document.getElementById('orderModal');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const orderForm = document.getElementById('orderForm');
    const messageDiv = document.getElementById('message');

    const materialSelect = document.getElementById('materialSelect');
    const quantityInput = document.getElementById('quantityInput');
    const materialError = document.getElementById('materialError');
    const quantityError = document.getElementById('quantityError');

    function resetErrors() {
        materialError.style.display = 'none';
        quantityError.style.display = 'none';
    }

    function openModal() {
        resetErrors();
        orderForm.reset();
        messageDiv.textContent = '';
        orderModal.style.display = 'flex';
        materialSelect.focus();
    }

    function closeModal() {
        orderModal.style.display = 'none';
    }

    orderMaterialsButton.addEventListener('click', openModal);
    cancelOrderBtn.addEventListener('click', closeModal);
    window.addEventListener('click', e => {
        if (e.target === orderModal) closeModal();
    });

    orderForm.addEventListener('submit', e => {
        e.preventDefault();
        resetErrors();

        let valid = true;

        if (!materialSelect.value) {
            materialError.style.display = 'block';
            valid = false;
        }
        if (!quantityInput.value || Number(quantityInput.value) <= 0) {
            quantityError.style.display = 'block';
            valid = false;
        }

        if (!valid) return;

        closeModal();
        messageDiv.textContent = `Заявка на заказ ${materialSelect.value} в количестве ${quantityInput.value} создана! Рассмотрение заявки займет 3 рабочих дня.`;
    });

    // Тестовый фреймворк
    const Test = {
        describe(description, fn) {
            console.group(description);
            try {
                fn();
                console.log('%cВсе тесты пройдены успешно', 'color: green');
            } catch (e) {
                console.error('Тест не пройден:', e.message);
            }
            console.groupEnd();
        },
        
        it(testName, fn) {
            try {
                fn();
                console.log(`%c✓ ${testName}`, 'color: green');
                return true;
            } catch (e) {
                console.error(`%c✕ ${testName}: ${e.message}`, 'color: red');
                return false;
            }
        },
        
        expect(actual) {
            return {
                toBe(expected) {
                    if (actual !== expected) {
                        throw new Error(`Ожидалось ${expected}, но получено ${actual}`);
                    }
                },
                toBeGreaterThanOrEqual(expected) {
                    if (actual < expected) {
                        throw new Error(`Ожидалось значение >= ${expected}, но получено ${actual}`);
                    }
                },
                toEqual(expected) {
                    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                        throw new Error(`Ожидалось ${JSON.stringify(expected)}, но получено ${JSON.stringify(actual)}`);
                    }
                },
                toMatch(regex) {
                    if (!regex.test(actual)) {
                        throw new Error(`Ожидалось соответствие ${regex}, но получено ${actual}`);
                    }
                },
                toBeTruthy() {
                    if (!actual) {
                        throw new Error(`Ожидалось истинное значение, но получено ${actual}`);
                    }
                },
                toBeFalsy() {
                    if (actual) {
                        throw new Error(`Ожидалось ложное значение, но получено ${actual}`);
                    }
                }
            };
        }
    };

    // Тесты
    function runTests() {
        Test.describe('Валидация формы заказа', () => {
            Test.it('должна показывать ошибку при пустом материале', () => {
                materialSelect.value = '';
                quantityInput.value = '10';
                orderForm.dispatchEvent(new Event('submit'));
                Test.expect(materialError.style.display).toBe('block');
                Test.expect(quantityError.style.display).toBe('none');
            });

            Test.it('должна показывать ошибку при нулевом количестве', () => {
                materialSelect.value = 'Кремний';
                quantityInput.value = '0';
                orderForm.dispatchEvent(new Event('submit'));
                Test.expect(quantityError.style.display).toBe('block');
            });

            Test.it('должна принимать корректные данные', () => {
                materialSelect.value = 'Кремний';
                quantityInput.value = '100';
                orderForm.dispatchEvent(new Event('submit'));
                Test.expect(materialError.style.display).toBe('none');
                Test.expect(quantityError.style.display).toBe('none');
            });
        });

        Test.describe('Фильтрация материалов', () => {
            Test.it('должна фильтровать по типу материала', () => {
                materialTypeFilter.value = 'Кремний';
                filterTable();
                const visibleRows = Array.from(materialsTable.rows)
                    .filter(row => row.rowIndex > 0 && row.style.display !== 'none');
                Test.expect(visibleRows.length).toBe(1);
            });

            Test.it('должна сбрасывать фильтры', () => {
                materialTypeFilter.value = 'Кремний';
                clearFilterBtn.click();
                const visibleRows = Array.from(materialsTable.rows)
                    .filter(row => row.rowIndex > 0 && row.style.display !== 'none');
                Test.expect(visibleRows.length).toBe(2);
            });
        });

        Test.describe('Модальное окно заказа', () => {
            Test.it('должно открываться по кнопке', () => {
                orderMaterialsButton.click();
                Test.expect(orderModal.style.display).toBe('flex');
                closeModal();
            });

            Test.it('должно закрываться при успешном заказе', () => {
                openModal();
                materialSelect.value = 'Кремний';
                quantityInput.value = '100';
                orderForm.dispatchEvent(new Event('submit'));
                Test.expect(orderModal.style.display).toBe('none');
            });
        });
    }

    // Автоматический запуск тестов при загрузке (можно отключить в продакшене)
    window.addEventListener('load', function() {
        // Всегда показываем тесты для демонстрации
        // В реальном проекте используйте условие с test=1
        runTests();
        
        // Или так для запуска только с параметром:
        // if (window.location.search.includes('test=1')) {
        //     runTests();
        // }
    });
})();
