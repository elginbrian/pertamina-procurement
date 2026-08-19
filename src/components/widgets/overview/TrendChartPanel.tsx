"use client";

type TrendChartPanelProps = {
  months: string[];
  demandBars: number[];
};

export function TrendChartPanel({ months, demandBars }: TrendChartPanelProps) {
  const maxValue = Math.max(...demandBars, 100);

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Kebutuhan Pengadaan</p>
          <p className="text-xs text-slate-500">Performa 7 bulan terakhir</p>
        </div>
        <div className="rounded-full bg-[#edf5ff] px-2 py-1 text-[10px] font-semibold text-[#0a4d8c]">
          +12.4%
        </div>
      </div>

      <div className="relative h-56 overflow-hidden rounded-xl bg-slate-50 p-3">
        <div className="absolute inset-x-3 bottom-9 top-3 grid grid-rows-4">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-b border-slate-200/80" />
          ))}
        </div>

        <div className="relative z-10 flex h-full items-end gap-3 px-2 pt-2">
          {demandBars.map((value, index) => {
            const barHeight = `${Math.max(14, (value / maxValue) * 100)}%`;

            return (
              <div key={months[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-full w-full items-end justify-center">
                  <div
                    className="w-full rounded-t-xl bg-[#0a4d8c]"
                    style={{ height: barHeight }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500">{months[index]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrendChartPanel;
