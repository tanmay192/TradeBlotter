import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Trade } from "@shared/schema";
import { getQuarterlyAnalytics, formatCurrency } from "@/lib/trade-utils";

export default function QuarterlyAnalytics() {
  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    queryKey: ['/api/trades'],
  });

  const currentYear = new Date().getFullYear();
  const quarterlyData = getQuarterlyAnalytics(trades, currentYear);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const quarterColors = {
    Q1: 'bg-red-500',
    Q2: 'bg-yellow-500',
    Q3: 'bg-green-500',
    Q4: 'bg-blue-500',
  };

  const quarterNames = {
    Q1: 'Q1 (Jan-Mar)',
    Q2: 'Q2 (Apr-Jun)',
    Q3: 'Q3 (Jul-Sep)',
    Q4: 'Q4 (Oct-Dec)',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quarterly Performance</CardTitle>
          <Select defaultValue={currentYear.toString()}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
              <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(quarterlyData).reverse().map(([quarter, data]) => (
          <div key={quarter} className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${quarterColors[quarter as keyof typeof quarterColors]} rounded-full`}></div>
                <span className="font-medium text-slate-800">
                  {quarterNames[quarter as keyof typeof quarterNames]}
                </span>
              </div>
              {quarter === 'Q4' && (
                <span className="text-sm text-slate-500">Current</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-600">Booked P&L</div>
                <div className={`font-semibold ${data.bookedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.bookedPL >= 0 ? '+' : ''}{formatCurrency(data.bookedPL)}
                </div>
              </div>
              <div>
                <div className="text-slate-600">Open Positions</div>
                <div className="font-semibold text-blue-600">
                  {data.openPositions}
                </div>
              </div>
              <div>
                <div className="text-slate-600">Return %</div>
                <div className={`font-semibold ${data.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.returnPercentage >= 0 ? '+' : ''}{data.returnPercentage.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-slate-600">Total Trades</div>
                <div className="font-semibold text-slate-800">{data.totalTrades}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
