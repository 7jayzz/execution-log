import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Risk Disclaimer" };

export default function Disclaimer() {
  return (
    <LegalPage title="Risk Disclaimer" current="/disclaimer" intro="The Execution Log helps you understand your own trading. It doesn't tell you what to trade.">
      <h2>Not financial advice</h2>
      <p>Nothing on this website or in the app is financial, investment, tax or legal advice, or a recommendation to buy, sell or hold any financial instrument. That includes statistics, insights, goals, reminders, example accounts, prop firm templates, educational content and anything the AI coach says. The Execution Log is not authorised or regulated by the Financial Conduct Authority.</p>

      <h2>Trading is high risk</h2>
      <p>Trading forex, CFDs, indices, commodities, crypto and other leveraged products carries a high risk of losing money quickly because of leverage. Many retail traders lose money. Only trade with money you can afford to lose, and consider getting independent advice.</p>

      <h2>Past results don't guarantee future ones</h2>
      <p>Win rates, profit factors, expectancy and other statistics describe what has already happened in your journal. They don't predict or guarantee future performance.</p>

      <h2>Check your figures</h2>
      <p>Figures are calculated from what you enter or import. Imports, exchange rates and contract sizes can be wrong or out of date. Your broker's or prop firm's statements are the official record.</p>

      <h2>Prop firms and platforms</h2>
      <p>The Execution Log is independent. We're not affiliated with, endorsed by or sponsored by any broker, trading platform or prop firm, including those whose names appear in our templates or import options. Names are used only to describe compatibility. Prop firm rules change often, so always confirm the current rules with your firm.</p>

      <h2>Example accounts</h2>
      <p>Example accounts and sample trades are made up for demonstration. They aren't real results.</p>
    </LegalPage>
  );
}
