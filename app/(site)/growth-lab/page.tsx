"use client";
import clsx from "clsx";
import { useState } from "react";
import { BASE, type Inputs } from "@/lib/model";
import { useStoredState } from "@/lib/store";
import { DriversTab, ModelResults, ParamPanel, ScenarioPicker } from "@/components/lab/ModelTab";
import { CohortTab, ExperimentTab, FunnelTab } from "@/components/lab/EvidenceTabs";
import { Kicker } from "@/components/ui";

const TABS = [
  { k: "model", label: "Modello d'impatto" },
  { k: "funnel", label: "Funnel di acquisizione" },
  { k: "cohort", label: "Coorti di retention" },
  { k: "exp", label: "Esperimenti" },
  { k: "drivers", label: "Driver del risultato" },
] as const;

export default function GrowthLab() {
  const [inputs, setInputs] = useStoredState<Inputs>("lab:inputs:v2", BASE);
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("model");

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <Kicker>Growth Lab</Kicker>
      <h1 className="display mt-3 max-w-4xl text-[2.2rem] text-ink sm:text-[3rem]">Ogni numero ha un&apos;origine. Cambia le ipotesi, guarda cosa decide.</h1>
      <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-ink-2">
        Non abbiamo dati interni del Corriere: ogni valore qui è un&apos;ipotesi dichiarata o un dato simulato, e accanto a ogni ipotesi c&apos;è il modo di
        verificarla. Il modello è lo stesso descritto in docs/STRATEGY.md e coperto dai test automatici. Le ipotesi si salvano in questo browser.
      </p>

      <div className="mt-8 border-b border-rule">
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Sezioni del Growth Lab">
          {TABS.map((t) => (
            <button
              key={t.k}
              role="tab"
              aria-selected={tab === t.k}
              onClick={() => setTab(t.k)}
              className={clsx(
                "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                tab === t.k ? "border-navy text-navy" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8" role="tabpanel">
        {(tab === "model" || tab === "funnel" || tab === "drivers") && (
          <div className="mb-6">
            <ScenarioPicker inputs={inputs} setInputs={setInputs} />
          </div>
        )}
        {tab === "model" && (
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside aria-label="Ipotesi del modello" className="lg:max-h-[calc(100dvh-140px)] lg:overflow-y-auto lg:pr-1">
              <ParamPanel inputs={inputs} setInputs={setInputs} />
            </aside>
            <ModelResults inputs={inputs} />
          </div>
        )}
        {tab === "funnel" && <FunnelTab inputs={inputs} />}
        {tab === "cohort" && <CohortTab />}
        {tab === "exp" && <ExperimentTab />}
        {tab === "drivers" && <DriversTab inputs={inputs} />}
      </div>
    </div>
  );
}
