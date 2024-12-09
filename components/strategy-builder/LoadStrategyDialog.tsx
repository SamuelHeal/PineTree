"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Strategy } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface LoadStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStrategyLoad: (strategy: Strategy) => void;
}

export default function LoadStrategyDialog({
  open,
  onOpenChange,
  onStrategyLoad,
}: LoadStrategyDialogProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadStrategies = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          title: "Error",
          description: "Please sign in to view your strategies",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStrategies(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load strategies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadStrategies();
    }
  }, [open]);

  const handleLoadStrategy = (strategy: Strategy) => {
    onStrategyLoad(strategy);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Load Strategy</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : strategies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No saved strategies found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell>{strategy.description || "-"}</TableCell>
                    <TableCell>{formatDate(strategy.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadStrategy(strategy)}
                      >
                        Load
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
