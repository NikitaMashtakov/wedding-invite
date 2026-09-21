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
var HEADERS = ['Время', 'Имя и фамилия', 'Придёт', 'Напитки', 'Другой напиток'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      safe_(data.name, 120),
      safe_(data.attending, 20),
      safe_(data.drinks, 200),
      safe_(data.own, 300)
    ]);

    return json_({ ok: true });
  } catch (err) {
    // Ошибку видно в Apps Script → «Выполнения»
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

/** Открыть /exec в браузере — проверка, что развёртывание живо.
 *  Намеренно не отдаёт ничего из таблицы: адрес публичный. */
function doGet() {
  return json_({ ok: true });
}

/**
 * Защита от формульной инъекции. Адрес веб-приложения виден в исходном коде
 * страницы, так что прислать сюда можно что угодно. Google Таблицы считают
 * формулой всё, что начинается с = + - @, и вычисляют её, когда владелец
 * откроет таблицу — например, IMPORTXML утащит содержимое соседних ячеек на
 * чужой сервер. Апостроф в начале заставляет Таблицы считать значение текстом
 * (в самой ячейке он не отображается).
 */
function safe_(value, maxLength) {
  var s = String(value == null ? '' : value).slice(0, maxLength);
  s = s.replace(/[\u0000-\u001F\u007F]/g, ' ');   // управляющие символы
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    writeHeaders_(sheet);
  } else {
    // Состав столбцов менялся. Если шапка не совпадает с HEADERS, переписываем её,
    // иначе новые строки уедут не в те колонки. Уже собранные ответы не трогаем.
    var current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (current.join('\u0000') !== HEADERS.join('\u0000')) {
      writeHeaders_(sheet);
    }
  }
  return sheet;
}

function writeHeaders_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
