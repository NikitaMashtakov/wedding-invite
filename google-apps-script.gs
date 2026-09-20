/**
 * Приём анкет со свадебного приглашения в Google-таблицу.
 *
 * Установка:
 *  1. Создайте таблицу на drive.google.com (Google Таблицы).
 *  2. В ней: Расширения → Apps Script. Удалите всё из редактора и вставьте
 *     этот файл целиком. Сохраните (Ctrl+S).
 *  3. Развернуть → Новое развёртывание → тип «Веб-приложение»:
 *       «Запуск от имени»      — От моего имени
 *       «У кого есть доступ»   — У всех
 *     Нажмите «Развернуть», разрешите доступ к таблице.
 *  4. Скопируйте «URL веб-приложения» (оканчивается на /exec) и вставьте его
 *     в index.html в переменную RSVP_ENDPOINT.
 *
 * Важно: после любой правки этого скрипта нужно сделать
 * Развернуть → Управление развёртываниями → «Изменить» → Версия: «Новая»,
 * иначе изменения не подхватятся, а URL останется прежним.
 */

var SHEET_NAME = 'Ответы';
var HEADERS = ['Время', 'Имя и фамилия', 'Придёт', 'Спутник(ца)', 'Напитки'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      String(data.name || ''),
      String(data.attending || ''),
      String(data.companion || ''),
      String(data.drinks || '')
    ]);

    return json_({ ok: true });
  } catch (err) {
    // Ошибку видно в Apps Script → «Выполнения»
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

/** Открыть страницу /exec в браузере — быстрая проверка, что развёртывание живо. */
function doGet() {
  return json_({ ok: true, rows: getSheet_().getLastRow() - 1 });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
