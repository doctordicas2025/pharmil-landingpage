import assert from "node:assert/strict";
import { test } from "node:test";

import { getWhatsappHref } from "../lib/site-config.ts";

test("o link de atendimento preserva a mensagem inteira em um único parâmetro", () => {
  const message = "Olá! Dúvida sobre preço & entrega + indicação #1?";
  const destination = new URL(getWhatsappHref(message));

  assert.equal(destination.origin, "https://wa.me");
  assert.match(destination.pathname, /^\/[1-9]\d+$/);
  assert.deepEqual([...destination.searchParams], [["text", message]]);
  assert.equal(destination.hash, "");
});
