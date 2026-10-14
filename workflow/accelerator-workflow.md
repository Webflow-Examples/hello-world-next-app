# Работа с Frontend Accelerator в этом репозитории

Алгоритм работы и правила написания промптов. Дополняет, но не заменяет
[`AGENTS.md`](../AGENTS.md) и [`CLAUDE.md`](../CLAUDE.md): там лежат claims guardrail,
non-negotiables и открытые решения — они имеют приоритет над всем, что написано здесь.

---

## 1. Как устроен акселератор

### 1.1 Четыре слоя

```text
/coder «текст»
   │
   ▼
.claude/commands/coder.md      ← тонкая обёртка: только Task(subagent_type: coder, prompt: $ARGUMENTS)
   │                             сам работу НЕ делает, следующую команду НЕ запускает
   ▼
.claude/agents/coder.md        ← изолированный агент: tools-whitelist + формат вывода
   │                             (Context Summary / Evidence / Next Step)
   ▼
.claude/skills/coder/SKILL.md  ← вся логика: Purpose, Context Resolution, Ruleset Loading,
   │                             Runtime Toolchain, Procedure, Output, Stop Contract
   ▼
rulesets/common → framework → project   ← знание, подгружаемое по INDEX.md
```

Команда ≠ агент ≠ скилл. Команда — маршрутизатор, агент — песочница с правами, скилл —
процедура. Правка процедуры = правка `SKILL.md` (запрещено: payload), правка знания о
проекте = правка `rulesets/project/` (разрешено, через `/reflect`).

### 1.2 Права пишутся в агенте, а не в скилле

Границы записи принудительны на уровне tools:

| Агент                                                 | Что может писать                           |
| ----------------------------------------------------- | ------------------------------------------ |
| `requirements-analyst`, `brainstorm`, `writing-plans` | `tasks/**`                                 |
| `architect`, `ui-designer`, `api-integration`         | `tasks/**`, `specs/**`                     |
| `coder`, `debugger`, `test-generator`                 | `Edit`, `Write`, `Bash` — весь репозиторий |
| `code-reviewer`                                       | ничего (`git diff*`, `git log*`)           |
| `verify`, `browser-verify`                            | ничего (read + Bash)                       |
| `docs-generator`                                      | `specs/**`, `docs/**`, `README.md`         |
| `reflect`                                             | `rulesets/project/**`                      |
| `finishing-branch`                                    | только whitelisted git-команды             |

Если роль не может писать туда, куда надо — выбрана не та роль.

### 1.3 Граф потока (`flow-next` во фронтматтере)

```text
setup           git-worktrees ──────────────────────────┐
                                                        ▼
discovery       brainstorm ⇄ requirements-analyst ──► planning
                                                        │
planning        architect ⇄ api-integration ⇄ ui-designer
                                  └──► writing-plans ───┤
                                                        ▼
execution                              coder ⇄ debugger
                                                        │
quality/review  code-reviewer · test-generator · browser-verify · verify
                                                        │
finalization             docs-generator ──► finishing-branch ──► release
utility                  reflect · skill-creator
```

Агент **рекомендует** следующий шаг и STOP. Переход делает человек — это контракт
(`Never invoke the recommended command`), не дефект.

### 1.4 Ruleset-резолюция

`ruleset-aware: true` у восьми ролей: `architect`, `api-integration`, `ui-designer`,
`coder`, `code-reviewer`, `test-generator`, `browser-verify`, `debugger`. Они читают
`rulesets/common/` → `rulesets/framework/` → `rulesets/project/` по `INDEX.md`.

`INDEX.md` — условная маршрутизация, а не список. Пример
[`rulesets/project/coder/INDEX.md`](../rulesets/project/coder/INDEX.md):

```text
Always read:                          claims-and-gates, stack, architecture-layers
For any UI work:                      mantine-and-shared-ui, mcp-servers
For routes/layouts/metadata/config:   nextjs-conventions
For interface strings/locales:        i18n-and-routes
Before pushing:                       repository-and-git
```

Практический вывод: называйте в промпте тип работы теми же словами, что в INDEX
(«routes», «metadata», «interface strings», «UI») — агент подтянет нужный слой правил.

Не ruleset-aware: `requirements-analyst`, `writing-plans`, `verify`, `docs-generator`,
`brainstorm`, `reflect`. Им проектный контекст нужно отдать явной ссылкой на файл.

### 1.5 Toolchain

| Что                               | Команда                                                                        | Кто использует                                              |
| --------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Готовность                        | `node ./toolchain/bin/doctor.mjs --json`                                       | обязательно перед `browser-verify`                          |
| Браузер-доказательства            | `node ./toolchain/bin/agent-browser.mjs`                                       | **только** `browser-verify`                                 |
| Актуальная документация библиотек | `ctx7.mjs library <name> "<вопрос>"` → `ctx7.mjs docs <library-id> "<вопрос>"` | architect, api-integration, coder, debugger, test-generator |

Doctor = `DEGRADED` при `hooks:codex` → `PENDING_ACTIVATION` — ожидаемое состояние, не блокер.
Claude-хуки активируются после одного прохода через `/hooks` и перезапуска сессии.

### 1.6 Хуки

`SessionStart` пишет activation proof → `PreToolUse`/`PostToolUse` на `Bash|Edit|Write`
фиксируют изменённые файлы → **`Stop` прогоняет `npm run lint` по файлам, изменённым за
сессию** (timeout 300 c).

- `npm run lint` обязан работать всегда, иначе ломается гейт.
- Lint-ошибку видно в конце сессии, а не в CI.
- Payload (`.claude/`, `.agents/`, `rulesets/common|framework/`, `toolchain/`) в
  `.prettierignore` намеренно: форматирование ломает SHA-256 receipt в
  `.frontend-accelerator/installation.json`, и `frontend-accelerator update` откажется писать.

### 1.7 Артефакты

`tasks/` и `specs/` создаются первой ролью, которой нужен durable handoff.

| Каталог             | Что это                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `tasks/TASK-NNN/`   | история задачи: requirements, brainstorm, architecture, ui-design, api-integration, implementation-plan, verification |
| `specs/`            | что реализовано **сейчас**, только из проверенной правды                                                              |
| `docs/spec/`        | что система **должна** быть (WS-C/WS-D, claim-поверхности, не трогать)                                                |
| `docs/adr/`         | решения с последствиями, по одному на файл                                                                           |
| `rulesets/project/` | правила для агентов, только через `/reflect` и явное одобрение                                                       |

---

## 2. Алгоритм работы

### 2.0 Старт сессии

```bash
node ./toolchain/bin/doctor.mjs --json   # DEGRADED из-за codex — норма
git status
```

### 2.1 Маршрутизация запроса

```text
Баг с воспроизведением            → /debugger
«А как лучше?» без ТЗ             → /brainstorm
Пункт FE-NN из fe-scope.md        → полный цикл (2.2)
Правка в 1–2 файла, решения есть  → короткий цикл (2.3)
«Проверь»                         → /verify | /code-reviewer | /browser-verify
Ошибка повторилась 2+ раза        → /reflect
```

### 2.2 Полный цикл для пункта FE-NN

**Шаг 0 — входной гейт (до любой команды).** `docs/spec/fe-scope.md` задаёт для каждого
FE-NN **Required input**. Сверьтесь с открытыми решениями из `AGENTS.md`:

| Блокер                                                | Что блокирует                   |
| ----------------------------------------------------- | ------------------------------- |
| WS-C дизайн-токены (`theme.ts` — скелет `TODO(WS-C)`) | FE-03 и всё визуальное          |
| Утверждённая копия и gate страницы                    | FE-06…FE-15 (клинические слоты) |
| Webflow plan tier                                     | модель контента                 |
| Доступ к HubSpot                                      | FE-17                           |
| Хостинг                                               | кэширование и рендеринг         |
| Trailing slash (ADR-0001)                             | канонические URL                |

Нет входа — не начинать. Результатом является названный недостающий вход.

**Шаг 1 — `/requirements-analyst`.** → `tasks/TASK-NNN/requirements.md`.
Acceptance criteria из `fe-scope.md` переносятся дословно.

**Шаг 2 — специалисты, только нужные.** По одной команде за раз:

- `/architect` — границы, роутинг, владение состоянием, кэширование, где рендерить;
- `/api-integration` — Webflow Data API / HubSpot, классификация контракта
  (confirmed / assumed / proposed / blocked);
- `/ui-designer` — структура слотов, порядок блоков, состояния, responsive, WCAG AA.

Роль пропускается, если решение уже зафиксировано в `docs/adr/` или `rulesets/project/`.

**Шаг 3 — `/writing-plans`.** Файловый план. Если план начинается с «предположим, что…» —
вернуться на шаг 2.

**Шаг 4 — `/coder`.** Реализация и тесты, доказывающие поведение.

**Шаг 5 — контроль, по возрастанию стоимости:**

```text
/verify            lint + typecheck + unit → PASS / FAIL / BLOCKED, без ремонта
/code-reviewer     read-only → PASS / NEEDS-CHANGES
/test-generator    риск-ориентированное покрытие сверх essential
/browser-verify    только если нужны живые доказательства UI
npm run test:e2e   если менялись routing, metadata, canonical, hreflang, SSR
```

**Шаг 6 — финал.** `/docs-generator` (требует успешного `verify`) → `/finishing-branch`.
Remote — Bitbucket: `gh` нет, PR не создаётся. Ветка пушится, имя сообщается.

### 2.3 Короткий цикл

`/coder` → `/verify` → `/code-reviewer`. Не вызывайте `/architect` ради переименования пропа.

### 2.4 Правила перехода

- Одна команда за раз. Агент STOP → читаете Evidence → решаете сами.
- `NEEDS-CHANGES` → `/coder` с **цитатой находки**, а не «поправь замечания».
- `FAIL` от verify → `/debugger` (доказывает причину), не `/coder` (будет угадывать).
- `BLOCKED` — это результат. Зафиксировать недостающий вход и остановиться.

---

## 3. Как писать промпты

### 3.1 Анатомия

Промпт целиком уходит в изолированного агента как `$ARGUMENTS`. **У него нет истории чата.**

```text
1. ЗАДАЧА      одно предложение, глагол + объект
2. КОНТЕКСТ    пути к файлам (спека, задача, исходники). Пути, а не пересказ
3. ГРАНИЦЫ     что НЕ трогать
4. КРИТЕРИЙ    по чему судить, что готово
5. ИЗВЕСТНОЕ   уже принятые решения, чтобы агент не решал заново
6. АРТЕФАКТ    куда писать, или «ответом, без файла»
```

### 3.2 Шаблон

```text
/<роль> <Задача одним предложением>.

Контекст:
- docs/spec/fe-scope.md → FE-NN (acceptance criteria — контракт, не пересказывать)
- docs/spec/page-register.md → строка <URL>, gate=<LOW|MEDIUM|HARD>
- docs/spec/claims-guardrails.md
- src/<конкретные файлы>

Уже решено (не пересматривать):
- <решение> — docs/adr/000N-....md

Границы:
- Не трогать <...>
- Mantine только в src/shared/; приложение импортирует @/shared/ui
- Плейсхолдер-копия запрещена; отсутствующая строка → TODO(WS-D) и стоп

Готово, когда:
- <проверяемое условие>
- npm run verify — PASS

Артефакт: tasks/TASK-NNN/<файл>.md
```

### 3.3 Готовые промпты по ролям

**`/requirements-analyst`**

```text
/requirements-analyst Оформить требования для FE-07 (Stats bar: 3 metric tiles + disclaimer).

Контекст: docs/spec/fe-scope.md → FE-07; docs/spec/templates.md (порядок слотов);
docs/spec/claims-guardrails.md; docs/spec/page-register.md → строка «/».
Acceptance criteria из fe-scope.md перенести дословно.
Метрики и цитаты — claim-поверхность под QARA: если утверждённых строк нет,
зафиксировать как Open Question, не придумывать.
Артефакт: tasks/TASK-007/requirements.md
```

**`/architect`**

```text
/architect Решить, где живёт данные-слой новостной карусели (FE-16) и на каком уровне
кэшируется, при next.config.ts с cacheComponents: true.

Контекст: src/shared/config/, src/screens/home/, next.config.ts,
rulesets/project/architect/rules/rendering-and-caching.md
Ограничение: хостинг не выбран — никаких Vercel/Cloudflare-специфичных API.
Нужно: решение, отвергнутые альтернативы, последствия. Если выбор необратим —
дать варианты и остановиться для решения человеком.
```

**`/coder`**

```text
/coder Реализовать по плану tasks/TASK-007/implementation-plan.md.

Границы: только src/widgets/stats-bar/ и src/screens/home/;
Mantine не импортировать вне src/shared/ — брать из @/shared/ui;
направление импортов app→screens→widgets→features→entities→shared;
List.Item в Server Component не использовать — только ListItem;
копии в слотах метрик нет — TODO(WS-D).
Готово: npm run verify PASS и тест на рендер трёх тайлов в served HTML.
```

**`/code-reviewer`**

```text
/code-reviewer Отревьюить рабочий diff против main.

База сравнения: main. Приоритет: claim-поверхности (title/description/slug/alt/schema),
направление FSD-импортов, граница Mantine, наличие evidence в served HTML,
контраст по WCAG AA.
Находки — с файлом, строкой и конкретным сценарием отказа.
```

**`/browser-verify`**

```text
/browser-verify Проверить главную на локальном production-сервере.

Перед запуском: node ./toolchain/bin/doctor.mjs --json
Сервер: спросить разрешение, затем npm run build && npm run start;
порт не угадывать — взять из вывода процесса.
Проверить: 360px и 1440px, keyboard-навигацию по header, skip-to-content,
console и network errors, фокус-кольца.
Инструмент: только node ./toolchain/bin/agent-browser.mjs, сессия --session home-fe07.
```

**`/reflect`**

```text
/reflect Ошибка повторилась дважды: URL записан строковым литералом вместо
src/shared/config/page-register.ts (коммиты <hash1>, <hash2>).
Предложить правило в rulesets/project/coder/. Показать точный файл и полный текст
перед записью — писать только после явного одобрения.
```

### 3.4 Антипаттерны

| Плохо                                    | Почему                             | Как                                                                   |
| ---------------------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| «Сделай главную»                         | роль не выбрана, scope безграничен | один FE-NN за раз                                                     |
| «Как мы обсуждали выше»                  | у агента нет истории               | ссылка на файл                                                        |
| «Напиши подходящий заголовок»            | **нарушение claims guardrail**     | «вставить утверждённую строку из X; если нет — TODO(WS-D) и стоп»     |
| «Исправь все замечания ревью»            | ревью агент не видит               | цитата находки и путь:строка                                          |
| `/architect` и `/coder` одним сообщением | контракт one-command-at-a-time     | по одной                                                              |
| «Отформатируй проект»                    | ломает installation receipt        | payload не трогать                                                    |
| «Проверь через Playwright MCP»           | MCP не источник доказательств      | `agent-browser.mjs` для verify, Playwright MCP — для написания `e2e/` |

### 3.5 Чеклист перед отправкой промпта

1. Роль соответствует праву записи (§ 1.2)?
2. Пути к файлам вместо пересказа?
3. Gate страницы назван (`LOW` / `MEDIUM` / `HARD` / `RESERVED`)?
4. Ни одна пользовательская строка не просится «придумать»?
5. Открытые решения из `AGENTS.md`, которых касается задача, перечислены — как «не
   пересматривать» или как блокер?
6. Указан критерий готовности, проверяемый командой?

---

**Принцип всей конструкции:** акселератор превращает «агент решил» в «агент предъявил
доказательство и остановился». Промпт тем лучше, чем меньше в нём остаётся места для
решения, которое должны принять человек или спецификация.
