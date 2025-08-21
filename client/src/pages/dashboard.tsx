import Header from "@/components/header";
import SummaryCards from "@/components/summary-cards";
import TradeEntryForm from "@/components/trade-entry-form";
import TradesList from "@/components/trades-list";
import QuarterlyAnalytics from "@/components/quarterly-analytics";
import CapitalManagement from "@/components/capital-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Activity } from "lucide-react";

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
            
            {/* Trading Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Performance Chart Placeholder */}
                <div className="h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-500">Quarterly Performance Chart</div>
                    <div className="text-xs text-slate-400">Chart implementation coming soon</div>
                  </div>
                </div>
                
                {/* Best/Worst Performers */}
                <div>
                  <h3 className="font-medium text-slate-700 mb-3">Performance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium text-slate-800">Best Quarter</div>
                          <div className="text-xs text-slate-500">Q3 Performance</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+15.8%</div>
                        <div className="text-xs text-slate-500">Jul-Sep</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-slate-800">Win Rate</div>
                          <div className="text-xs text-slate-500">Success ratio</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">68.5%</div>
                        <div className="text-xs text-slate-500">Overall</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
