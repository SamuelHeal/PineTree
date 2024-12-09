'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface RiskSettings {
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  maxPositions: number;
}

interface RiskManagementModalProps {
  settings: RiskSettings;
  onSettingsChange: (settings: RiskSettings) => void;
}

export default function RiskManagementModal({ settings, onSettingsChange }: RiskManagementModalProps) {
  const handleInputChange = (field: keyof RiskSettings, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSettingsChange({
        ...settings,
        [field]: numValue
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Risk Management</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Risk Management Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stopLoss" className="text-right">
              Stop Loss %
            </Label>
            <Input
              id="stopLoss"
              type="number"
              step="0.1"
              value={settings.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="takeProfit" className="text-right">
              Take Profit %
            </Label>
            <Input
              id="takeProfit"
              type="number"
              step="0.1"
              value={settings.takeProfit}
              onChange={(e) => handleInputChange('takeProfit', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="positionSize" className="text-right">
              Position Size %
            </Label>
            <Input
              id="positionSize"
              type="number"
              step="1"
              value={settings.positionSize}
              onChange={(e) => handleInputChange('positionSize', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxPositions" className="text-right">
              Max Positions
            </Label>
            <Input
              id="maxPositions"
              type="number"
              step="1"
              value={settings.maxPositions}
              onChange={(e) => handleInputChange('maxPositions', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
