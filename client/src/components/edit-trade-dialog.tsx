import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { insertTradeSchema, type InsertTrade, type Trade } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface EditTradeDialogProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTradeDialog({ trade, isOpen, onClose }: EditTradeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTrade>({
    resolver: zodResolver(insertTradeSchema),
    defaultValues: {
      scripName: trade?.scripName || '',
      quantity: trade ? parseFloat(trade.quantity) : 0,
      buyPrice: trade ? parseFloat(trade.buyPrice) : 0,
      sellPrice: trade?.sellPrice ? parseFloat(trade.sellPrice) : undefined,
      buyDate: trade?.buyDate || new Date().toISOString().split('T')[0],
      sellDate: trade?.sellDate || undefined,
    }
  });

  // Reset form when trade changes
  useEffect(() => {
    if (trade) {
      form.reset({
        scripName: trade.scripName,
        quantity: parseFloat(trade.quantity),
        buyPrice: parseFloat(trade.buyPrice),
        sellPrice: trade.sellPrice ? parseFloat(trade.sellPrice) : undefined,
        buyDate: trade.buyDate,
        sellDate: trade.sellDate || undefined,
      });
    }
  }, [trade, form]);

  const updateTradeMutation = useMutation({
    mutationFn: async (data: InsertTrade) => {
      if (!trade) throw new Error('No trade selected');
      const response = await apiRequest('PATCH', `/api/trades/${trade.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      queryClient.invalidateQueries({ queryKey: ['/api/capital'] });
      onClose();
      toast({
        title: "Trade updated successfully",
        description: "Your trade has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating trade",
        description: error.message || "Failed to update trade",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTrade) => {
    updateTradeMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!trade) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Trade - {trade.scripName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scripName">Scrip Name</Label>
              <Input
                id="scripName"
                placeholder="e.g., RELIANCE, TCS"
                {...form.register('scripName')}
              />
              {form.formState.errors.scripName && (
                <p className="text-sm text-red-600">{form.formState.errors.scripName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...form.register('quantity', { valueAsNumber: true })}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-600">{form.formState.errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price (₹)</Label>
              <Input
                id="buyPrice"
                type="number"
                step="0.01"
                {...form.register('buyPrice', { valueAsNumber: true })}
              />
              {form.formState.errors.buyPrice && (
                <p className="text-sm text-red-600">{form.formState.errors.buyPrice.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellPrice">Sell Price (₹)</Label>
              <Input
                id="sellPrice"
                type="number"
                step="0.01"
                placeholder="Leave empty for open position"
                {...form.register('sellPrice', { valueAsNumber: true })}
              />
              {form.formState.errors.sellPrice && (
                <p className="text-sm text-red-600">{form.formState.errors.sellPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyDate">Buy Date</Label>
              <Input
                id="buyDate"
                type="date"
                {...form.register('buyDate')}
              />
              {form.formState.errors.buyDate && (
                <p className="text-sm text-red-600">{form.formState.errors.buyDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellDate">Sell Date</Label>
              <Input
                id="sellDate"
                type="date"
                placeholder="Leave empty for open position"
                {...form.register('sellDate')}
              />
              {form.formState.errors.sellDate && (
                <p className="text-sm text-red-600">{form.formState.errors.sellDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateTradeMutation.isPending}
              className="flex-1"
            >
              {updateTradeMutation.isPending ? 'Updating...' : 'Update Trade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}