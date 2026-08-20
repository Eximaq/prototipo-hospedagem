import path from "node:path";

export type CalendarSourceConfig = {
  houseId: string;
  label: string;
  fixturePath: string;
  envVar: "CASA_TURQUESA_ICAL_URL" | "CASA_CORAIS_ICAL_URL";
};

export const calendarSourceConfigs: CalendarSourceConfig[] = [
  {
    houseId: "casa-01",
    label: "Casa Turquesa",
    fixturePath: path.resolve("calendar-fixtures/casa-turquesa.ics"),
    envVar: "CASA_TURQUESA_ICAL_URL",
  },
  {
    houseId: "casa-02",
    label: "Casa Corais",
    fixturePath: path.resolve("calendar-fixtures/casa-corais.ics"),
    envVar: "CASA_CORAIS_ICAL_URL",
  },
];
