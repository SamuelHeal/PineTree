"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SaveStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: any[];
  edges: any[];
  riskSettings: {
    stopLossPercent: number;
    takeProfitPercent: number;
    riskPerTradePercent: number;
    maxPositionPercent: number;
    atrPeriod: number;
  };
  pineScript: string;
}

export default function SaveStrategyDialog({
  open,
  onOpenChange,
  nodes,
  edges,
  riskSettings,
  pineScript,
}: SaveStrategyDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a strategy name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        toast({
          title: "Error",
          description: "Please sign in to save strategies",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("strategies").insert({
        name,
        description: description || null,
        nodes,
        edges,
        risk_settings: riskSettings,
        user_id: user.user.id,
        pine_script: pineScript,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Strategy saved successfully",
      });

      onOpenChange(false);
      setName("");
      setDescription("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save strategy",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Strategy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input
              id="name"
              placeholder="Enter strategy name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter strategy description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Strategy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
