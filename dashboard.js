(() => {
    console.log('Dashboard loaded');
})();

    // Простой тестовый фреймворк
    const Test = {
        describe(description, fn) {
            console.group(description);
            try {
                fn();
            } catch (e) {
                console.error('Test failed:', e.message);
            }
            console.groupEnd();
        },
        
        it(testName, fn) {
            try {
                fn();
                console.log(`✓ ${testName}`);
            } catch (e) {
                console.error(`✕ ${testName}`, e.message);
            }
        },
        
        expect(actual) {
            return {
                toBe(expected) {
                    if (actual !== expected) {
                        throw new Error(`Expected ${expected}, but got ${actual}`);
                    }
                },
                toBeGreaterThanOrEqual(expected) {
                    if (actual < expected) {
                        throw new Error(`Expected value >= ${expected}, but got ${actual}`);
                    }
                },
                toEqual(expected) {
                    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                    }
                },
                toMatch(regex) {
                    if (!regex.test(actual)) {
                        throw new Error(`Expected ${actual} to match ${regex}`);
                    }
                }
            };
        }
    };

    // Запускаем тесты после загрузки страницы
    window.addEventListener('DOMContentLoaded', () => {

        
        // Проверка структуры dashboard
        Test.describe('Структура панели мониторинга', () => {
            Test.it('должна содержать 4 карточки данных', () => {
                const cards = document.querySelectorAll('.dashboard .card');
                Test.expect(cards.length).toBe(4);
            });
            
            Test.it('должна содержать правильные заголовки карточек', () => {
                const cardTitles = Array.from(document.querySelectorAll('.dashboard .card h3'))
                                    .map(el => el.textContent);
                Test.expect(cardTitles).toEqual([
                    'Состояние оборудования',
                    'Уровень запасов',
                    'Выполнение плана',
                    'Последние задачи'
                ]);
            });
        });

        // Проверка формата процентных значений
        Test.describe('Формат процентных значений', () => {
            Test.it('должен отображать проценты корректно', () => {
                const equipmentCard = document.querySelector('.dashboard .card:nth-child(1) p').textContent;
                Test.expect(equipmentCard).toMatch(/\d+%/);
                
                const partsMatch = equipmentCard.match(/(\d+)%/g);
                Test.expect(partsMatch.length).toBe(3);
            });
        });

        
        console.log('Все тесты завершены');
    });