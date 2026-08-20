import { describe, expect, it } from "vitest";
import { buildAvailabilitySnapshot } from "../../../scripts/availability-generator";
import type { CalendarSource } from "@/lib/availability/types";

describe("availability generation", () => {
  it("publishes only normalized ranges grouped independently by house", async () => {
    const sources: CalendarSource[] = [
      {
        houseId: "casa-01",
        label: "Casa Turquesa",
        async getEvents() {
          return {
            eventsFound: 2,
            events: [
              {
                uid: "private-one@example.test",
                startDate: "2026-09-10",
                endDate: "2026-09-15",
                status: "confirmed" as const,
              },
              {
                uid: "private-two@example.test",
                startDate: "2026-09-14",
                endDate: "2026-09-20",
                status: "confirmed" as const,
              },
            ],
          };
        },
      },
      {
        houseId: "casa-02",
        label: "Casa Corais",
        async getEvents() {
          return { eventsFound: 0, events: [] };
        },
      },
    ];

    const { snapshot, summary } = await buildAvailabilitySnapshot(
      sources,
      "2026-08-19T12:00:00.000Z",
    );
    const serialized = JSON.stringify(snapshot);

    expect(snapshot).toEqual({
      updatedAt: "2026-08-19T12:00:00.000Z",
      houses: {
        "casa-01": {
          houseId: "casa-01",
          updatedAt: "2026-08-19T12:00:00.000Z",
          unavailableRanges: [{ start: "2026-09-10", end: "2026-09-20" }],
        },
        "casa-02": {
          houseId: "casa-02",
          updatedAt: "2026-08-19T12:00:00.000Z",
          unavailableRanges: [],
        },
      },
    });
    expect(summary.map((item) => item.unavailableRangeCount)).toEqual([1, 0]);
    expect(serialized).not.toMatch(/uid|summary|description|email|phone|https?:/i);
    expect(serialized).not.toContain("private-one@example.test");
  });
});
