import { COMPARISON, COMPARISON_SOON, PLANS } from "@/lib/plans";

export default function CompareTable() {
  return (
    <div className="compare-wrap">
      <table className="compare">
        <thead><tr><th>Feature</th>{PLANS.map((p) => <th key={p.id}>{p.name}<span>{p.price}/mo</span></th>)}</tr></thead>
        <tbody>
          {COMPARISON.map(([f, ...v]) => (
            <tr key={f}><td>{f}{COMPARISON_SOON.has(f) && <span className="soon">Coming soon</span>}</td>{v.map((x, i) => <td key={i} className={x === "—" ? "muted" : x === "✓" ? "pos" : ""}>{x}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
