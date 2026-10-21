import { describe, expect, it } from "vitest";
import {
  PLAN_TASKS,
  PLAN_STORAGE_KEY,
  completionPercent,
  parsePlan,
  planAsMarkdown,
  toggleTask,
} from "../client/src/lib/study-plan";

describe("90-day guide content contract", () => {
  it("includes twelve unique real tasks spanning all four phases", () => {
    expect(PLAN_TASKS).toHaveLength(12);
    expect(new Set(PLAN_TASKS.map(t => t.id)).size).toBe(12);
    expect(new Set(PLAN_TASKS.map(t => t.phase))).toEqual(new Set([1, 2, 3, 4]));
    for (const task of PLAN_TASKS) {
      expect(task.title.length).toBeGreaterThan(9);
      expect(task.action.length).toBeGreaterThan(50);
      expect(task.deliverable.length).toBeGreaterThan(15);
      expect(task.pass.length).toBeGreaterThan(20);
    }
    expect(PLAN_STORAGE_KEY).toMatch(/^empieza-con-ia:/);
  });

  it("toggles known milestones and ignores unknown keys", () => {
    const first = PLAN_TASKS[0].id;
    expect(toggleTask([], first)).toEqual([first]);
    expect(toggleTask([first], first)).toEqual([]);
    expect(toggleTask([], "unexpected")).toEqual([]);
  });

  it("does not mistake repeated tasks for more than 100% completion", () => {
    const all = PLAN_TASKS.map(t => t.id);
    expect(completionPercent([])).toBe(0);
    expect(completionPercent([all[0]])).toBe(8);
    expect(completionPercent([...all, ...all])).toBe(100);
  });

  it("parses malformed and tampered browser data without crashing", () => {
    expect(parsePlan("invalid JSON")).toEqual([]);
    expect(parsePlan(JSON.stringify({ id: "bad" }))).toEqual([]);
    expect(parsePlan(JSON.stringify([PLAN_TASKS[0].id, PLAN_TASKS[0].id, "spoofed"])))
      .toEqual([PLAN_TASKS[0].id]);
    expect(parsePlan("x".repeat(20001))).toEqual([]);
  });

  it("exports an offline portable plan including rubric and selections", () => {
    const selected = [PLAN_TASKS[0].id, PLAN_TASKS[11].id];
    const md = planAsMarkdown(selected);
    expect(md).toContain("# Empieza con IA");
    expect(md).toContain("- [x]");
    expect(md).toContain("- [ ]");
    expect(md).toContain("Comprobación:");
    expect(md).toContain("**Avance guardado:** 17%");
    expect(md).toContain("## Fase 4");
  });
});
