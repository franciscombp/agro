// Abono por etapa: qué toca, sin dosis, y sin repetir la tarea.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ABONO_ETAPA, tareaAbono, yaHayAbono } from '../abono.js';
import { ETAPAS } from '../water.js';

test('cada etapa del riego tiene su entrada de abono, aunque sea «nada»', () => {
  assert.deepEqual(Object.keys(ABONO_ETAPA).sort(), Object.keys(ETAPAS).sort());
});

test('la tarea dice qué abonar, la nota de la especie y de dónde sale la cantidad', () => {
  const t = tareaAbono({ id: 's1', etapa: 'brotacion' }, ['arandano', 'arandano']);
  assert.equal(t.type, 'fertilización');
  assert.equal(t.targetId, 's1');
  assert.equal(t.etapa, 'brotacion');
  assert.match(t.notes, /nitrógeno/);
  assert.match(t.notes, /amonio/);
  assert.equal(t.notes.match(/Arándano/g).length, 1);
  assert.match(t.notes, /análisis de suelo/);
  assert.doesNotMatch(t.notes, /\d+\s?(g|kg|ml|cc)\b/);   // ninguna dosis inventada
});

test('en cosecha o sin etapa no hay tarea', () => {
  assert.equal(tareaAbono({ id: 's1', etapa: 'cosecha' }), null);
  assert.equal(tareaAbono({ id: 's1' }), null);
});

test('no se repite una tarea de abono pendiente para la misma etapa', () => {
  const tasks = [{ type: 'fertilización', targetType: 'sector', targetId: 's1', etapa: 'floracion' }];
  assert.equal(yaHayAbono(tasks, 's1', 'floracion'), true);
  assert.equal(yaHayAbono(tasks, 's1', 'llenado'), false);
  assert.equal(yaHayAbono([{ ...tasks[0], doneAt: '2026-10-01' }], 's1', 'floracion'), false);
});
