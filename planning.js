document.getElementById('planningForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const planName = document.getElementById('planName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const description = document.getElementById('description').value;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${planName}</td>
        <td>${startDate}</td>
        <td>$${endDate}</td>
        <td>${description}</td>
    `;

    document.getElementById('plansTable').appendChild(newRow);

    document.getElementById('planningForm').reset();

    alert('План успешно создан!');
});



// // Простой тестовый фреймворк
// const Test = {
//   describe(description, fn) {
//     console.group(description);
//     try {
//       fn();
//     } catch (e) {
//       console.error('Test failed:', e.message);
//     }
//     console.groupEnd();
//   },
  
//   it(testName, fn) {
//     try {
//       fn();
//       console.log(`✓ ${testName}`);
//     } catch (e) {
//       console.error(`✕ ${testName}`, e.message);
//     }
//   },
  
//   expect(actual) {
//     return {
//       toBe(expected) {
//         if (actual !== expected) {
//           throw new Error(`Expected ${expected}, but got ${actual}`);
//         }
//       },
//       toBeTruthy() {
//         if (!actual) {
//           throw new Error(`Expected truthy value, but got ${actual}`);
//         }
//       },
//       toBeFalsy() {
//         if (actual) {
//           throw new Error(`Expected falsy value, but got ${actual}`);
//         }
//       }
//     };
//   }
// };

// // Тест 13: Проверка добавления плана в таблицу
// Test.describe('Добавление нового плана', () => {
//   Test.it('должен добавлять новую строку в таблицу', () => {
//     const initialRowCount = document.querySelectorAll('#plansTable tr').length;
//     document.getElementById('planName').value = 'Тестовый план';
//     document.getElementById('startDate').value = '2025-06-01';
//     document.getElementById('endDate').value = '2025-06-30';
//     document.getElementById('description').value = 'Тестовое описание';
//     document.getElementById('planningForm').dispatchEvent(new Event('submit'));
//     const newRowCount = document.querySelectorAll('#plansTable tr').length;
//     Test.expect(newRowCount).toBe(initialRowCount + 1);
//   });
// });

// // Тест 14: Проверка очистки формы
// Test.describe('Очистка формы', () => {
//   Test.it('должен очищать форму после отправки', () => {
//     document.getElementById('planName').value = 'Тестовый план';
//     document.getElementById('startDate').value = '2025-06-01';
//     document.getElementById('endDate').value = '2025-06-30';
//     document.getElementById('description').value = 'Тестовое описание';
//     document.getElementById('planningForm').dispatchEvent(new Event('submit'));
//     Test.expect(document.getElementById('planName').value).toBe('');
//     Test.expect(document.getElementById('startDate').value).toBe('');
//     Test.expect(document.getElementById('endDate').value).toBe('');
//     Test.expect(document.getElementById('description').value).toBe('');
//   });
// });


// // Тест 16: Проверка предотвращения стандартной отправки формы
// Test.describe('Поведение формы при отправке', () => {
//   Test.it('должен предотвращать стандартную отправку формы', () => {
//     let formSubmitted = false;
//     const originalSubmit = HTMLFormElement.prototype.submit;
    
//     HTMLFormElement.prototype.submit = function() {
//       formSubmitted = true;
//     };
    
//     document.getElementById('planningForm').dispatchEvent(new Event('submit'));
//     Test.expect(formSubmitted).toBe(false);
    
//     HTMLFormElement.prototype.submit = originalSubmit;
//   });
// });



