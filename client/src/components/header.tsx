import { BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">TradeTracker Pro</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#dashboard" className="text-blue-600 font-medium">Dashboard</a>
            <a href="#trades" className="text-slate-600 hover:text-slate-800 transition-colors">Trades</a>
            <a href="#analytics" className="text-slate-600 hover:text-slate-800 transition-colors">Analytics</a>
            <a href="#reports" className="text-slate-600 hover:text-slate-800 transition-colors">Reports</a>
          </nav>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
