"use client";

import { ShieldCheck } from "lucide-react";

type ResponsibleGuestFormProps = {
  responsibleName: string;
  cpf: string;
  birthDate: string;
  notes: string;
  errors: {
    responsibleName?: string;
    cpf?: string;
    birthDate?: string;
  };
  inputClassName: string;
  onChange: (
    field: "responsibleName" | "cpf" | "birthDate" | "notes",
    value: string,
  ) => void;
};

export function ResponsibleGuestForm({
  responsibleName,
  cpf,
  birthDate,
  notes,
  errors,
  inputClassName,
  onChange,
}: ResponsibleGuestFormProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-semibold text-[var(--color-ink)] sm:col-span-2 lg:col-span-1">
        Nome completo do responsável
        <input
          className={inputClassName}
          type="text"
          value={responsibleName}
          autoComplete="name"
          onChange={(event) => onChange("responsibleName", event.target.value)}
          aria-invalid={Boolean(errors.responsibleName)}
          aria-describedby={errors.responsibleName ? "responsible-name-error" : undefined}
        />
        {errors.responsibleName ? (
          <span className="mt-2 block text-sm text-red-700" id="responsible-name-error">
            {errors.responsibleName}
          </span>
        ) : null}
      </label>

      <label className="text-sm font-semibold text-[var(--color-ink)]">
        CPF
        <input
          className={inputClassName}
          type="text"
          inputMode="numeric"
          value={cpf}
          autoComplete="off"
          placeholder="000.000.000-00"
          onChange={(event) => onChange("cpf", event.target.value)}
          aria-invalid={Boolean(errors.cpf)}
          aria-describedby={errors.cpf ? "cpf-error" : undefined}
        />
        {errors.cpf ? (
          <span className="mt-2 block text-sm text-red-700" id="cpf-error">
            {errors.cpf}
          </span>
        ) : null}
      </label>

      <label className="text-sm font-semibold text-[var(--color-ink)]">
        Data de nascimento
        <input
          className={inputClassName}
          type="date"
          value={birthDate}
          autoComplete="bday"
          onChange={(event) => onChange("birthDate", event.target.value)}
          aria-invalid={Boolean(errors.birthDate)}
          aria-describedby={errors.birthDate ? "birth-date-error" : undefined}
        />
        {errors.birthDate ? (
          <span className="mt-2 block text-sm text-red-700" id="birth-date-error">
            {errors.birthDate}
          </span>
        ) : null}
      </label>

      <label className="text-sm font-semibold text-[var(--color-ink)] sm:col-span-2">
        Observações
        <textarea
          className={`${inputClassName} min-h-20 resize-y py-3`}
          value={notes}
          onChange={(event) => onChange("notes", event.target.value)}
          placeholder="Gostaria de saber valores, condições e disponibilidade."
        />
      </label>

      <p className="flex gap-2 text-xs leading-5 text-[var(--color-muted)] sm:col-span-2">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-ocean)]" size={15} />
        <span>
          Seus dados serão utilizados exclusivamente para dar continuidade à sua solicitação de hospedagem.
        </span>
      </p>
    </div>
  );
}
