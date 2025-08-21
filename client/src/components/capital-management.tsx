import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Plus, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, calculateTradeMetrics } from "@/lib/trade-utils";
import { type Trade } from "@shared/schema";

export default function CapitalManagement() {
  const [capitalAmount, setCapitalAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: capitalData } = useQuery<{ totalCapital: number }>({
    queryKey: ['/api/capital'],
  });

  const { data: trades = [] } = useQuery<Trade[]>({
    queryKey: ['/api/trades'],
  });

  const updateCapitalMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('PATCH', '/api/capital', { amount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capital'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      setCapitalAmount("");
      setIsDialogOpen(false);
      toast({
        title: "Capital updated successfully",
        description: "Your total capital has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update capital",
        variant: "destructive",
      });
    },
  });

  const totalCapital = capitalData?.totalCapital || 0;
  const metrics = calculateTradeMetrics(trades, totalCapital);

  const handleUpdateCapital = () => {
    const amount = parseFloat(capitalAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }
    updateCapitalMutation.mutate(amount);
  };

  // Calculate pie chart data
  const pieData = [
    { name: 'Free Capital', value: metrics.freeCapital, color: '#10B981' },
    { name: 'Deployed Capital', value: metrics.deployedCapital, color: '#3B82F6' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <span>Capital Management</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Update Capital
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Total Capital</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="capital">Total Capital (₹)</Label>
                  <Input
                    id="capital"
                    type="number"
                    step="0.01"
                    placeholder="100000"
                    value={capitalAmount}
                    onChange={(e) => setCapitalAmount(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateCapital}
                    disabled={updateCapitalMutation.isPending}
                    className="flex-1"
                  >
                    {updateCapitalMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capital Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Total Capital</p>
            <p className="text-lg font-semibold text-slate-800">
              {formatCurrency(totalCapital)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Portfolio Return</p>
            <p className={`text-lg font-semibold ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Capital Allocation Pie Chart */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Capital Allocation</span>
          </div>
          
          {totalCapital > 0 ? (
            <>
              {/* SVG Pie Chart */}
              <div className="flex justify-center">
                <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="16"
                    strokeDasharray={`${(metrics.freeCapital / totalCapital) * 351.86} 351.86`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="16"
                    strokeDasharray={`${(metrics.deployedCapital / totalCapital) * 351.86} 351.86`}
                    strokeDashoffset={`-${(metrics.freeCapital / totalCapital) * 351.86}`}
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-sm text-slate-600">Free Capital</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-800">
                      {formatCurrency(metrics.freeCapital)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {((metrics.freeCapital / totalCapital) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm text-slate-600">Deployed Capital</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-800">
                      {formatCurrency(metrics.deployedCapital)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {((metrics.deployedCapital / totalCapital) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Capital Utilization */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Capital Utilization</span>
                  <span className="font-medium text-slate-800">
                    {metrics.capitalUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.capitalUtilization}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm">No capital added yet</p>
              <p className="text-xs text-slate-400">Add your total capital to track allocation</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}