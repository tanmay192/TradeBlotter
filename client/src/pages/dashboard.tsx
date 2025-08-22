import Header from "@/components/header";
import SummaryCards from "@/components/summary-cards";
import TradeEntryForm from "@/components/trade-entry-form";
import TradesList from "@/components/trades-list";
import QuarterlyAnalytics from "@/components/quarterly-analytics";
import CapitalManagement from "@/components/capital-management";
import TradingInsights from "@/components/trading-insights";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SummaryCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <TradeEntryForm />
            <TradesList />
          </div>
          
          <div className="space-y-8">
            <CapitalManagement />
            <QuarterlyAnalytics />
            <TradingInsights />
          </div>
        </div>
      </main>
    </div>
  );
}
